import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { Audio } from "expo-av";
import api from "@/api";
// import { customEvent } from 'vexo-analytics';
import i18n from "@/locales/localization";
import { router, useLocalSearchParams } from "expo-router";
import config from "@/config";

const Story = () => {
  const { name, isContinuing } = useLocalSearchParams();
  const { user } = useUser();
  const [question, setQuestion] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [endOfStory, setEndOfStory] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const intervalRef = useRef(null);
  const baseUrl = config.API_HOST;

  const fetchStory = async (endpoint) => {
    console.log(`${isContinuing ? "Continuing" : "Starting"} story with:`, {
      name,
      age: user.age,
      user_id: user.uid,
    });

    try {
      const url = `${baseUrl}/${endpoint}`;
      const payload = isContinuing
        ? { user_id: user.uid }
        : {
            story_name: name,
            age: user.age,
            user_id: user.uid,
            language: i18n.locale,
          };

      const response = await api.post(url, payload, { timeout: 10000 }); // 10 seconds timeout

      setQuestion(response.data.question);
      const imageUrlsWithCacheBusting = response.data.imageUrls.map(
        (url) => `${baseUrl}${url}?cb=${new Date().getTime()}`
      );
      setImageUrls(imageUrlsWithCacheBusting);
      setCurrentImageIndex(0); // Reset the current image index
      setLoading(false);
      setEndOfStory(response.data.end_of_story);

      // Preload images
      imageUrlsWithCacheBusting.forEach((url) => {
        Image.prefetch(url);
      });

      if (response.data.audioUrl) {
        setNextUrl(baseUrl + response.data.audioUrl);
      }
    } catch (error) {
      console.error(
        `Error ${isContinuing ? "continuing" : "starting"} story:`,
        error.message
      );
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
    if (nextUrl) {
      console.log("nextUrl", nextUrl);
      handlePlayAudio(nextUrl);
    }
  }, [nextUrl]);

  const handlePlayAudio = async (url) => {
    if (url) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true }
        );
        const status = await newSound.getStatusAsync();
        const duration = status.durationMillis || 0;
        setAudioDuration(duration);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            handleNextQuestion();
          }
        });
        setSound(newSound);
      } catch (error) {
        console.error("Error playing audio:", error.message);
      }
    }
  };

  useEffect(() => {
    if (imageUrls.length > 1 && audioDuration > 0) {
      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Calculate the interval based on audio duration and number of images
      const interval = Math.floor(audioDuration / imageUrls.length);

      // Set new interval
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < imageUrls.length) {
            return nextIndex;
          } else {
            clearInterval(intervalRef.current);
            return prevIndex;
          }
        });
      }, interval); // Switch image based on calculated interval
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [imageUrls, audioDuration]);

  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Unloading sound");
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleNextQuestion = () => {
    if (endOfStory) {
      //   customEvent("story ended", { story: story_name });
      Alert.alert(
        i18n.t("end_of_story"),
        i18n.t("you_have_reached_end_of_story"),
        [{ text: i18n.t("ok"), onPress: () => router.replace("/home") }]
      );
      return;
    }
    if (question) {
      setSound(null); // Clear the previous sound
      console.log("Navigating to StoryMathProblem");
      //   navigation.navigate("StoryMathProblem", {
      //     question,
      //     story_name,
      //     isContinuing: true,
      //   });
    } else {
      console.error("Question is null");
      Alert.alert(
        i18n.t("error"),
        i18n.t("unable_to_navigate_to_next_question")
      );
    }
  };

  //   useEffect(() => {
  //     const unsubscribe = navigation.addListener("focus", () => {
  //       if (isContinuing) {
  //         console.log("Continuing story");
  //         fetchStory("continue-story");
  //       }
  //     });

  //     return unsubscribe;
  //   }, [navigation, story_name, isContinuing]);

  if (loading) {
    // TODO: Add a loading spinner
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
      {imageUrls.length > 0 && (
        <Image
          source={{ uri: imageUrls[currentImageIndex] }}
          style={styles.backgroundImage}
        />
      )}
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
