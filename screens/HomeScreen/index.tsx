import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  FlatList,
  ImageSourcePropType,
} from "react-native";
import { Link } from "expo-router";
import i18n from "@/locales/localization";
import { useUser } from "@/contexts/UserContext";
import { UserContextType } from "@/types/user";
import { getAvatarSource } from "./constants";
import ScreenContainer from "@/components/ScreenContainer";

const HomeScreen = () => {
  const { user, updateNickname, updateAvatar } = useUser() as UserContextType;
  const [isEditing, setIsEditing] = useState(false);
  const [thankYouMessage] = useState("");
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  // useEffect(() => {
  //   if (user?.scores) {
  //     const message = i18n.t("thankYouMessage");
  //     setThankYouMessage(message);

  //     setTimeout(() => {
  //       setThankYouMessage("");
  //     }, 5000);
  //   }
  // }, [user?.scores]);

  const handleNicknameSubmit = (newNickname: string) => {
    updateNickname(newNickname);
    setIsEditing(false);
  };

  const handleAvatarChange = (avatarId: string) => {
    updateAvatar(avatarId);
    setAvatarModalVisible(false);
  };

  const selectableAvatars = [
    "default",
    ...(user?.purchasedItems
      ? user.purchasedItems.filter((item) => item !== "default")
      : []),
  ];

  const renderAvatarOption = ({ item }: { item: string }) => (
    <TouchableOpacity key={item} onPress={() => handleAvatarChange(item)}>
      <Image
        source={getAvatarSource(item) as ImageSourcePropType}
        style={styles.avatarItem}
      />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={styles.userInfoSection}>
        <TouchableOpacity onPress={() => setAvatarModalVisible(true)}>
          <Image
            source={
              getAvatarSource(user?.avatar || "default") as ImageSourcePropType
            }
            style={styles.userIcon}
          />
        </TouchableOpacity>
        {isEditing ? (
          <TextInput
            style={styles.usernameInput}
            value={nickname}
            onChangeText={setNickname}
            autoFocus={true}
            onBlur={() => setIsEditing(false)}
            onSubmitEditing={({ nativeEvent }) =>
              handleNicknameSubmit(nativeEvent.text)
            }
            returnKeyType="done"
          />
        ) : (
          <Text style={styles.userName} onPress={() => setIsEditing(true)}>
            {nickname}
          </Text>
        )}
        <Text style={styles.progressText}>
          {i18n.t("level")}: {user?.level || 1} - {i18n.t("progress")}:{" "}
          {Math.round(((user?.questionsSolved || 0 % 15) / 15) * 100)}%
        </Text>
        {thankYouMessage ? (
          <Text style={styles.thankYouMessage}>{thankYouMessage}</Text>
        ) : null}
        {user && !user.testCompleted ? (
          <Link href="/home/test" asChild>
            <TouchableOpacity style={styles.buttonContainer}>
              <View>
                <Text style={styles.buttonText}>{i18n.t("testSkills")}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ) : null}
        <Link href="/home/learning" asChild>
          <TouchableOpacity style={styles.greenButton}>
            <View>
              <Text style={styles.buttonText}>{i18n.t("startLearning")}</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
      <Modal
        visible={avatarModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{i18n.t("selectAvatar")}</Text>
            <FlatList
              data={selectableAvatars}
              renderItem={renderAvatarOption}
              keyExtractor={(item) => item}
              numColumns={3}
              contentContainerStyle={styles.avatarGrid}
            />
            <Button
              title={i18n.t("close")}
              onPress={() => setAvatarModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  usernameInput: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    minWidth: 100,
    borderBottomWidth: 1,
  },
  progressText: {
    fontSize: 16,
    color: "grey",
    marginTop: 5,
  },
  thankYouMessage: {
    marginTop: 20,
    fontSize: 18,
    color: "green",
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: "#8A2BE2",
    padding: 10,
    borderRadius: 5,
    width: 150,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  greenButton: {
    marginTop: 20,
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 5,
    width: 150,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
  },
  extraMargin: {
    marginTop: 10, // Additional space between the two buttons
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  avatarGrid: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarItem: {
    width: 80,
    height: 80,
    margin: 5,
  },
});

export default HomeScreen;
