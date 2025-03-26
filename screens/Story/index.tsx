import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { Audio } from "expo-av";
import api from "@/api";
// import { customEvent } from 'vexo-analytics';
import i18n from "@/locales/localization";
import { router, useLocalSearchParams } from "expo-router";
import config from "@/config";

// Define state types
interface StoryContent {
  question: string | null;
  imageUrls: string[];
  endOfStory: boolean;
}

interface MediaState {
  sound: Audio.Sound | null;
  audioDuration: number;
  currentImageIndex: number;
  audioUrl: string;
}

const Story = () => {
  const { name, isContinuing } = useLocalSearchParams();
  const { user } = useUser();

  // Group API/content-related states
  const [storyContent, setStoryContent] = useState<StoryContent>({
    question: null,
    imageUrls: [],
    endOfStory: false,
  });

  // Group media player related states
  const [mediaState, setMediaState] = useState<MediaState>({
    sound: null,
    audioDuration: 0,
    currentImageIndex: 0,
    audioUrl: "",
  });

  // Keep loading as a separate state since it's UI-specific
  const [loading, setLoading] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const baseUrl = config.API_HOST;

  const fetchStory = async (endpoint: string) => {
    try {
      const url = `${baseUrl}/${endpoint}`;
      const payload = isContinuing
        ? { user_id: user?.uid }
        : {
            story_name: name,
            age: user?.age,
            user_id: user?.uid,
            language: i18n.locale,
          };

      const response = await api.post(url, payload, { timeout: 10000 });

      const imageUrlsWithCacheBusting = response.data.imageUrls.map(
        (url: string) => `${baseUrl}${url}?cb=${new Date().getTime()}`
      );

      // Update story content state
      setStoryContent({
        question: response.data.question,
        imageUrls: imageUrlsWithCacheBusting,
        endOfStory: response.data.end_of_story,
      });

      // Update media state - reset image index
      setMediaState((prev) => ({
        ...prev,
        currentImageIndex: 0,
        audioUrl: response.data.audioUrl
          ? `${baseUrl}${response.data.audioUrl}`
          : "",
      }));

      setLoading(false);

      // Preload images
      imageUrlsWithCacheBusting.forEach((url: string) => {
        Image.prefetch(url);
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching story:", errorMessage);
      Alert.alert(i18n.t("error"), i18n.t("unable_to_start_story"));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!name) return;

    if (!isContinuing) {
      fetchStory("start-story");
    }
  }, [name, isContinuing]);

  useEffect(() => {
    if (mediaState.audioUrl) {
      handlePlayAudio(mediaState.audioUrl);
    }
  }, [mediaState.audioUrl]);

  const handlePlayAudio = async (url: string) => {
    if (url) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true }
        );
        const status = await newSound.getStatusAsync();
        const duration = status.isLoaded ? status.durationMillis || 0 : 0;

        // Update media state
        setMediaState((prev) => ({
          ...prev,
          sound: newSound,
          audioDuration: duration,
        }));

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            handleNextQuestion();
          }
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Error playing audio:", errorMessage);
      }
    }
  };

  useEffect(() => {
    const { imageUrls } = storyContent;
    const { audioDuration } = mediaState;

    if (imageUrls.length > 1 && audioDuration > 0) {
      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Calculate the interval based on audio duration and number of images
      const interval = Math.floor(audioDuration / imageUrls.length);

      // Set new interval
      intervalRef.current = setInterval(() => {
        setMediaState((prev) => {
          const nextIndex = prev.currentImageIndex + 1;
          if (nextIndex < imageUrls.length) {
            return { ...prev, currentImageIndex: nextIndex };
          } else {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            return prev;
          }
        });
      }, interval); // Switch image based on calculated interval
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [storyContent.imageUrls, mediaState.audioDuration]);

  useEffect(() => {
    return () => {
      if (mediaState.sound) {
        console.log("Unloading sound");
        mediaState.sound.unloadAsync();
      }
    };
  }, [mediaState.sound]);

  const handleNextQuestion = () => {
    if (storyContent.endOfStory) {
      //   customEvent("story ended", { story: story_name });
      Alert.alert(
        i18n.t("end_of_story"),
        i18n.t("you_have_reached_end_of_story"),
        [{ text: i18n.t("ok"), onPress: () => router.replace("/home") }]
      );
      return;
    }
    if (storyContent.question) {
      // Reset sound
      setMediaState((prev) => ({ ...prev, sound: null }));

      // Properly encode the question as JSON string and then URI encode for URL
      const encodedQuestion = encodeURIComponent(
        JSON.stringify(storyContent.question)
      );

      router.push(
        `/home/story/math-problem?question=${encodedQuestion}&story_name=${name}&isContinuing=${isContinuing}`
      );
    } else {
      console.error("Question is null");
      Alert.alert(
        i18n.t("error"),
        i18n.t("unable_to_navigate_to_next_question")
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          {i18n.t("loading_story_and_question")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {storyContent.imageUrls.length > 0 ? (
        <Image
          source={{ uri: storyContent.imageUrls[mediaState.currentImageIndex] }}
          style={styles.backgroundImage}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  loadingText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: "50%",
  },
});

export default Story;
