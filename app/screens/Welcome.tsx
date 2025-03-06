import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { signInAnonymously } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import i18n from "../../locales/localization";
// import { customEvent } from 'vexo-analytics'
import { useUser } from "@/contexts/UserContext";

const WelcomeScreen = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      //   navigation.replace("Home"); // Navigate immediately if user is found
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleSignIn = () => {
    setLoading(true); // Reactivate loading state when starting the sign-in process
    signInAnonymously(FIREBASE_AUTH)
      .then(() => {
        // customEvent("Anonymous Sign In", {});
        // navigation.replace("Home"); // Use replace to avoid navigation stack buildup
      })
      .catch((error) => {
        setLoading(false); // Ensure loading is stopped if there's an error
        if (error.code === "auth/operation-not-allowed") {
          console.log("Enable anonymous in your firebase console.");
          Alert.alert(i18n.t("error"), i18n.t("enableAnonymous"));
        } else {
          console.error(error);
          Alert.alert(
            i18n.t("error"),
            `${i18n.t("signInFailed")}: ${error.message}`
          );
        }
      });
  };

  const handleLogin = () => {
    // navigation.navigate("Login");
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else {
      return (
        <View style={styles.buttonContainer}>
          <Button
            title={i18n.t("startGame")}
            onPress={handleSignIn}
            color="purple"
          />
          <Button title={i18n.t("login")} onPress={handleLogin} color="blue" />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/homepageBackground.png")}
        style={styles.backgroundImage}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  buttonContainer: {
    position: "absolute",
    top: "60%",
    width: "60%",
    paddingHorizontal: 20,
    spacing: 20,
  },
});

export default WelcomeScreen;
