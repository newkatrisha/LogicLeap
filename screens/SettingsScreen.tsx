import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import i18n from "../locales/localization";
import { useUser } from "@/contexts/UserContext";
import { router } from "expo-router";

const SettingsScreen = () => {
  const { logout } = useUser();
  const [language, setLanguage] = useState(i18n.locale);

  const handleLogout = async () => {
    await logout();
    // customEvent("logout called", {});
    router.replace("/");
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    // customEvent("change language", { language: lang });
    i18n.locale = lang;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("settings")}</Text>
      <View style={styles.content}>
        <Text style={styles.label}>{i18n.t("selectLanguage")}</Text>
        <Picker
          selectedValue={language}
          onValueChange={(itemValue) => changeLanguage(itemValue)}
          style={pickerSelectStyles.inputIOS} // Use the same styles for consistency
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Русский" value="ru" />
          <Picker.Item label="עברית" value="he" />
        </Picker>
        <View style={styles.buttonContainer}>
          <Button
            title={i18n.t("logout")}
            onPress={handleLogout}
            color="#FF6347"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    position: "absolute",
    top: 50,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    marginTop: 100,
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "gray",
  },
  buttonContainer: {
    marginTop: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    width: 200,
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    width: 200,
    marginBottom: 20,
  },
});

export default SettingsScreen;
