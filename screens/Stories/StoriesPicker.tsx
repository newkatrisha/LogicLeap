import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import i18n from "@/locales/localization";
import { useUser } from "@/contexts/UserContext";
import CoinDisplay from "@/components/CoinDisplay";
// import { customEvent } from 'vexo-analytics';

const StoriesPicker = () => {
  const { user } = useUser();
  const [selectedStory, setSelectedStory] = useState(
    user?.purchasedStories?.[0]?.name || ""
  );

  const handleStartStory = async () => {
    const story = user?.purchasedStories?.find(
      (story) => story.name === selectedStory
    );

    // customEvent("story started", { story: story?.name });
    // navigation.navigate('StoryPage', { story_name: story?.name });
  };

  return (
    <View style={styles.container}>
      <CoinDisplay />
      <Text style={styles.header}>{i18n.t("chooseStory")}</Text>
      <Picker
        selectedValue={selectedStory}
        onValueChange={(itemValue) => setSelectedStory(itemValue)}
        style={styles.picker}
      >
        {user?.purchasedStories?.map((story) => (
          <Picker.Item key={story.id} label={story.name} value={story.name} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.startButton} onPress={handleStartStory}>
        <Text style={styles.startButtonText}>{i18n.t("startStory")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  picker: {
    width: "80%",
    height: 50,
    marginBottom: 20,
  },
  startButton: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "purple",
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default StoriesPicker;
