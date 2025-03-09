import React, { useEffect, useState } from "react";
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
} from "react-native";
// import CoinDisplay from '../components/CoinsDisplay'; // Import the CoinDisplay component
// import BottomNavigation from '../components/BottomNavigation'; // Import the BottomNavigation component
import i18n from "../locales/localization"; // Import localization
import { useUser } from "@/contexts/UserContext";
import { UserContextType } from "@/types/user";

const avatars = [
  { id: "default", source: require("@/assets/images/userIcon.png") },
  { id: "1", source: require("@/assets/images/store/avatar1.png") },
  { id: "2", source: require("@/assets/images/store/avatar2.png") },
  { id: "3", source: require("@/assets/images/store/avatar3.png") },
  { id: "4", source: require("@/assets/images/store/avatar4.png") },
  { id: "5", source: require("@/assets/images/store/avatar5.png") },
  { id: "6", source: require("@/assets/images/store/avatar6.png") },
  { id: "7", source: require("@/assets/images/store/avatar7.png") },
  { id: "8", source: require("@/assets/images/store/avatar8.png") },
  { id: "9", source: require("@/assets/images/store/avatar9.png") },
  { id: "10", source: require("@/assets/images/store/avatar10.png") },
  { id: "11", source: require("@/assets/images/store/avatar11.png") },
  { id: "12", source: require("@/assets/images/store/avatar12.png") },
  { id: "13", source: require("@/assets/images/store/avatar13.png") },
  { id: "14", source: require("@/assets/images/store/avatar14.png") },
  { id: "15", source: require("@/assets/images/store/avatar15.png") },
  { id: "16", source: require("@/assets/images/store/avatar16.png") },
];

const getAvatarSource = (id: string) => {
  const avatar = avatars.find((avatar) => avatar.id === id);
  return avatar ? avatar.source : avatars[0].source; // Default to first avatar if not found
};

const HomeScreen = () => {
  const { user, updateNickname, updateAvatar } = useUser() as UserContextType;
  const [isEditing, setIsEditing] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  useEffect(() => {
    if (user?.scores) {
      const message = i18n.t("thankYouMessage");
      setThankYouMessage(message);

      setTimeout(() => {
        setThankYouMessage("");
      }, 5000);
    }
  }, [user?.scores]);

  const handleNicknameSubmit = (newNickname) => {
    updateNickname(newNickname);
    setIsEditing(false);
  };

  const handleAvatarChange = (avatarId) => {
    updateAvatar(avatarId);
    setAvatarModalVisible(false);
  };

  const selectableAvatars = [
    "default",
    ...(user?.purchasedItems
      ? user.purchasedItems.filter((item) => item !== "default")
      : []),
  ];

  const renderAvatarOption = ({ item }) => (
    <TouchableOpacity key={item} onPress={() => handleAvatarChange(item)}>
      <Image source={getAvatarSource(item)} style={styles.avatarItem} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <CoinDisplay /> */}
      <View style={styles.userInfoSection}>
        <TouchableOpacity onPress={() => setAvatarModalVisible(true)}>
          <Image
            source={getAvatarSource(user?.avatar || "default")}
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
          {Math.round(((user?.questionsSolved % 15) / 15) * 100)}%
        </Text>
        {thankYouMessage && (
          <Text style={styles.thankYouMessage}>{thankYouMessage}</Text>
        )}
        {user &&
          !user.testCompleted && ( // Only show if test has not been completed
            <View style={styles.buttonContainer}>
              <Button
                title={i18n.t("testSkills")}
                // onPress={() => navigation.navigate("TestSkills")}
                color="#8A2BE2"
              />
            </View>
          )}
        <View style={styles.extraMargin}>
          <Button
            title={i18n.t("startLearning")}
            // onPress={() => navigation.navigate("LearningModule")}
            color="#32CD32"
          />
        </View>
      </View>
      {/* <BottomNavigation navigation={navigation} /> */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  userInfoSection: {
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
