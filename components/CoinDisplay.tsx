import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Audio, AVPlaybackSource } from "expo-av";
import { useUser } from "@/contexts/UserContext";
import * as images from "@/assets/images";
import * as sounds from "@/assets/sounds";

const CoinDisplay = () => {
  const { user } = useUser();
  const soundRef = useRef<Audio.Sound | null>(null);
  const lastCoinsRef = useRef(user?.coins || 0);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        sounds.coinFall as AVPlaybackSource
      );
      soundRef.current = sound;
    };

    loadSound();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (user?.coins && user.coins > lastCoinsRef.current && soundRef.current) {
      const playSound = async () => {
        try {
          await soundRef.current?.replayAsync();
          lastCoinsRef.current = user?.coins || 0; // Update the last coin count after playing sound
        } catch (error) {
          console.error("Failed to play sound:", error);
        }
      };

      playSound();
    }
  }, [user?.coins]);

  return (
    <View style={styles.container}>
      <Image
        source={images.coinsIcon as ImageSourcePropType}
        style={styles.icon}
      />
      <Text style={styles.text}>{user?.coins || 0}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CoinDisplay;
