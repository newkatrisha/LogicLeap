import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import i18n from "../locales/localization";
import { router } from "expo-router";

const StoreScreen = () => {
  const defaultAvatarImage = require("../assets/images/userIcon.png");
  const defaultStoryImage = require("../assets/images/backgroundStories.png");

  const handleNavigateToAvatars = () => {
    // router.navigate("Avatars");
  };

  const handleNavigateToStories = () => {
    // router.navigate("BuyStories");
  };

  return (
    <View style={styles.container}>
      {/* <CoinDisplay /> */}
      <Text style={styles.title}>{i18n.t("store")}</Text>
      <View style={styles.contentContainer}>
        <View style={styles.gridView}>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={handleNavigateToAvatars}
          >
            <Image source={defaultAvatarImage} style={styles.itemImage} />
            <Text style={styles.itemCost}>{i18n.t("avatars")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={handleNavigateToStories}
          >
            <Image source={defaultStoryImage} style={styles.itemImage} />
            <Text style={styles.itemCost}>{i18n.t("stories")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  itemCost: {
    fontSize: 16,
  },
  coinIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
    marginBottom: 10,
  },
  purchaseButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#d3d3d3",
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default StoreScreen;
