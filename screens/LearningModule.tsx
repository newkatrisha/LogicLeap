import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ImageSourcePropType,
} from "react-native";
import i18n from "@/locales/localization";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as images from "@/assets/images";
import { Link, router } from "expo-router";
import ScreenContainer from "@/components/ScreenContainer";
// import { customEvent } from 'vexo-analytics'

const LearningModule = () => {
  const handlePress = (type: string) => {
    router.push(`/home/math/${type}`);
    // customEvent("Choose math problem", { type: type});
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.storiesHeader}>{i18n.t("stories")}</Text>
        <Link href="/home/stories_picker" asChild>
          <TouchableOpacity
            style={styles.storiesButton}
            onPress={() => {
              console.log("Stories");
            }}
          >
            <ImageBackground
              source={images.backgroundStories as ImageSourcePropType}
              style={styles.storiesButtonBackground}
              imageStyle={styles.imageStyle}
            >
              <Text style={styles.storiesButtonText}>
                {i18n.t("startStory")}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </Link>
        <Text style={styles.header}>{i18n.t("chooseMathCategory")}:</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress("sum")}
          >
            <AntDesign name="pluscircleo" size={60} color="purple" />
            <Text style={styles.iconText}>{i18n.t("addition")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress("minus")}
          >
            <AntDesign name="minuscircleo" size={60} color="purple" />
            <Text style={styles.iconText}>{i18n.t("subtraction")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress("multiply")}
          >
            <FontAwesome6 name="multiply" size={60} color="purple" />
            <Text style={styles.iconText}>{i18n.t("multiplication")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress("divide")}
          >
            <FontAwesome5 name="divide" size={60} color="purple" />
            <Text style={styles.iconText}>{i18n.t("division")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  storiesHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "purple",
    textAlign: "center",
  },
  storiesButton: {
    width: "90%",
    marginBottom: 20,
    alignItems: "center",
  },
  storiesButtonBackground: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  imageStyle: {
    borderRadius: 15,
  },
  storiesButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconText: {
    marginTop: 5,
    fontSize: 14,
    color: "purple",
    textAlign: "center",
  },
});

export default LearningModule;
