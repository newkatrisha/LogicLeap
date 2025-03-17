import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import i18n from "@/locales/localization";
import { useUser } from "@/contexts/UserContext";
import ScreenContainer from "@/components/ScreenContainer";
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
    console.log("Starting story:", story?.name);
    // customEvent("story started", { story: story?.name });
    // navigation.navigate('StoryPage', { story_name: story?.name });
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.header}>{i18n.t("chooseStory")}</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStory}
            onValueChange={(itemValue) => setSelectedStory(itemValue)}
            style={Platform.OS === "ios" ? styles.pickerIOS : styles.picker}
            itemStyle={Platform.OS === "ios" ? styles.pickerItemIOS : {}}
          >
            {user?.purchasedStories?.map((story) => (
              <Picker.Item
                key={story.id}
                label={story.name}
                value={story.name}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartStory}>
          <Text style={styles.startButtonText}>{i18n.t("startStory")}</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
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
  pickerContainer: {
    width: "80%",
    marginBottom: 20,
    borderWidth: Platform.OS === "android" ? 0 : 1,
    borderColor: Platform.OS === "android" ? "transparent" : "#ddd",
    borderRadius: 8,
    overflow: Platform.OS === "android" ? "visible" : "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  pickerIOS: {
    width: "100%",
    height: 150,
  },
  pickerItemIOS: {
    fontSize: 16,
    height: 150,
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
