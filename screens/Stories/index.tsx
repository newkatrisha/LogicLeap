import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  FlatList,
} from "react-native";
import { useUser } from "@/contexts/UserContext";
import i18n from "@/locales/localization";
import * as images from "@/assets/images";
import { storiesForSale } from "./constants";
import ScreenContainer from "@/components/ScreenContainer";
// import { customEvent } from 'vexo-analytics'

const StoriesScreen = () => {
  const { user, updateProfile } = useUser();

  const handlePurchase = (story: {
    id: string;
    name: string;
    cost: number;
  }) => {
    if ((user?.coins ?? 0) >= story.cost) {
      //   customEvent("story purchased", { story: story.name, cost: story.cost });

      const updatedpurchasedStories = [
        ...(user?.purchasedStories ?? []),
        { id: story.id, name: story.name },
      ];
      updateProfile({
        purchasedStories: updatedpurchasedStories,
        coins: (user?.coins ?? 0) - story.cost,
      });
    } else {
      alert(i18n.t("notEnoughCoins"));
    }
  };

  const renderItem = ({
    item,
  }: {
    item: {
      id: string;
      name: string;
      cost: number;
      image: ImageSourcePropType;
    };
  }) => {
    if ((user?.purchasedStories ?? []).some((story) => story.id === item.id))
      return null;

    const isAffordable = (user?.coins ?? 0) >= item.cost;

    return (
      <View style={styles.itemContainer}>
        <Image source={item.image} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.costContainer}>
          <Text style={styles.itemCost}>{item.cost}</Text>
          <Image source={images.coinsIcon} style={styles.coinIcon} />
        </View>
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            !isAffordable && styles.disabledButton,
          ]}
          onPress={() => handlePurchase(item)}
          disabled={!isAffordable}
        >
          <Text style={styles.purchaseButtonText}>{i18n.t("buy")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenContainer>
      {/* <Text style={styles.title}>{i18n.t("buyStories")}</Text> */}
      <FlatList
        data={storiesForSale.filter(
          (item) =>
            !(user?.purchasedStories ?? []).some(
              (story) => story.id === item.id
            )
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    justifyContent: "space-between",
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
    width: "48%",
    marginTop: 20,
  },
  itemImage: {
    width: 130,
    height: 130,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemCost: {
    fontSize: 16,
    marginBottom: 10,
  },
  coinIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
    marginBottom: 10,
  },
  costContainer: {
    flexDirection: "row",
    alignItems: "center",
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

export default StoriesScreen;
