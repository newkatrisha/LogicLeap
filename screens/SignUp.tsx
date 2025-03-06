import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";
import { useUser } from "../contexts/UserContext";
import { router } from "expo-router";
// import { customEvent } from 'vexo-analytics'

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(""); // State for the age input
  const { login } = useUser(); // Assuming useUser provides a login function to set user in context

  const handleSignUp = async () => {
    if (!email || !password || !age) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const nickname = email.split("@")[0]; // Extract the part before '@'

      // Prepare user data for Firestore and User Context
      const userData = {
        uid: userCredential.user.uid,
        email: email,
        level: 1,
        questionsSolved: 0,
        coins: 0,
        age: parseInt(age),
        nickname: nickname,
      };

      const userRef = doc(FIREBASE_DB, "users", userCredential.user.uid);
      await setDoc(userRef, userData);
      console.log("userData", userData);

      login(userData);
      // customEvent("Sign Up", { email: email, age: age });
      router.replace("/home");
    } catch (error) {
      console.log("error", error);
      Alert.alert("Sign Up Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Age"
        keyboardType="numeric" // Ensure that the age input only accepts numbers
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
});

export default SignUpScreen;
