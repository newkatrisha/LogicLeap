import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import i18n from "../locales/localization";
import * as images from "@/assets/images";
import { Link } from "expo-router";
import ScreenContainer from "@/components/ScreenContainer";

const StoreScreen = () => {
  return (
    <ScreenContainer>
      <Text style={styles.title}>{i18n.t("store")}</Text>
      <View style={styles.contentContainer}>
        <View style={styles.gridView}>
          <Link href="/store/avatars" asChild>
            <TouchableOpacity style={styles.itemContainer}>
              <Image
                source={images.userIcon as ImageSourcePropType}
                style={styles.itemImage}
              />
              <Text style={styles.itemText}>{i18n.t("avatars")}</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/store/stories" asChild>
            <TouchableOpacity style={styles.itemContainer}>
              <Image
                source={images.backgroundStories as ImageSourcePropType}
                style={styles.itemImage}
              />
              <Text style={styles.itemText}>{i18n.t("stories")}</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gridView: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: 150,
    height: 150,
    margin: 20,
  },
  itemImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default StoreScreen;
