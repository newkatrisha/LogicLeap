import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ImageSourcePropType,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "@/contexts/UserContext";
import i18n from "@/locales/localization";
import { router } from "expo-router";
import * as images from "@/assets/images";
// import { customEvent } from 'vexo-analytics'

const LoginScreen = () => {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(i18n.t("loginError"), i18n.t("enterEmailAndPassword"));
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      const userDocRef = doc(FIREBASE_DB, "users", userCredential.user.uid);

      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Create a properly formatted user object
        const customUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || "",
          level: userData.level || 1,
          questionsSolved: userData.questionsSolved || 0,
          coins: userData.coins || 0,
          age: userData.age,
          nickname: userData.nickname,
          purchasedItems: userData.purchasedItems || ["default"],
          purchasedStories: userData.purchasedStories || [
            { id: 0, name: "Harry Potter" },
          ],
          avatar: userData.avatar || "default",
        };

        login(customUser);
      } else {
        console.error("No user doc exists");
        Alert.alert(i18n.t("loginError"), i18n.t("noUserDataAvailable"));
      }
    } catch (error: unknown) {
      let errorMessage = "Authentication failed";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert(i18n.t("loginError"), errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t("mathAdventure")}</Text>
      <Image
        source={images.loginIllustration as ImageSourcePropType}
        style={styles.illustration}
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder={i18n.t("emailPlaceholder")}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder={i18n.t("passwordPlaceholder")}
        secureTextEntry={!passwordVisible}
      />
      <TouchableOpacity
        onPress={() => setPasswordVisible(!passwordVisible)}
        style={{ marginBottom: 10 }}
      >
        <Text>
          {passwordVisible ? i18n.t("hidePassword") : i18n.t("showPassword")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>{i18n.t("enter")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.signUpText}>{i18n.t("newUserJoinNow")}</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 10,
  },
  illustration: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  signUpText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#FF6347",
    width: "100%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LoginScreen;
