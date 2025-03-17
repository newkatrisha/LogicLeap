import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ImageSourcePropType,
} from "react-native";
import { useUser } from "@/contexts/UserContext";
import i18n from "@/locales/localization";
import * as images from "@/assets/images";
import { itemsForSale } from "./constants";
import ScreenContainer from "@/components/ScreenContainer";
// import { customEvent } from 'vexo-analytics'

const AvatarsScreen = () => {
  const { user, updateProfile } = useUser();

  const handlePurchase = (item: { id: string; cost: number }) => {
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

  const renderItem = ({
    item,
  }: {
    item: { id: string; cost: number; image: ImageSourcePropType };
  }) => {
    if (user?.purchasedItems?.includes(item.id)) return null;

    const isAffordable = Boolean((user?.coins ?? 0) >= item.cost);

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
    <ScreenContainer>
      <Text style={styles.title}>{i18n.t("avatars")}</Text>
      <FlatList
        data={itemsForSale.filter(
          (item) => !user?.purchasedItems?.includes(item.id)
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
    alignSelf: "center",
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
  },
  itemImage: {
    width: 130,
    height: 130,
    borderRadius: 100,
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
  row: {
    marginBottom: 10,
    justifyContent: "space-between",
  },
});

export default AvatarsScreen;
