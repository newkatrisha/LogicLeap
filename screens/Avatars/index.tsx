import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
// import { FlatGrid } from 'react-native-super-grid';
import { useUser } from "@/contexts/UserContext";
import i18n from "@/locales/localization";
import CoinDisplay from "@/components/CoinDisplay";
import * as images from "@/assets/images";
import { itemsForSale } from "./constants";

// import { customEvent } from 'vexo-analytics'

const AvatarsScreen = () => {
  const { user, updateProfile } = useUser();
  // Import the coin icon image

  const handlePurchase = (item) => {
    if (user?.coins || 0 >= item.cost) {
      // customEvent("avatar purchased", { id: item.id, cost: item.cost });

      const updatedPurchasedItems = [...(user?.purchasedItems || []), item.id];
      updateProfile({
        purchasedItems: updatedPurchasedItems,
        coins: (user?.coins || 0) - item.cost,
      });
    } else {
      alert(i18n.t("notEnoughCoins"));
    }
  };

  const renderItem = ({ item }) => {
    if (user?.purchasedItems?.includes(item.id)) return null;

    const isAffordable = user?.coins || 0 >= item.cost;

    return (
      <View style={styles.itemContainer}>
        <Image source={item.image} style={styles.itemImage} />
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
    <View style={styles.container}>
      <CoinDisplay />
      <Text style={styles.title}>{i18n.t("avatars")}</Text>
      <FlatList
        data={itemsForSale.filter(
          (item) => !user?.purchasedItems?.includes(item.id)
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      {/* <FlatGrid
        itemDimension={130}
        data={itemsForSale.filter(item => !user.purchasedItems.includes(item.id))}
        renderItem={renderItem}
        spacing={10}
        keyExtractor={(item) => item.id}
        style={styles.gridView}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  gridView: {
    flex: 1,
    width: "100%",
    marginBottom: 60,
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
  },
  itemImage: {
    width: 100,
    height: 100,
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
    backgroundColor: "#d3d3d3", // Light gray color for disabled button
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AvatarsScreen;
