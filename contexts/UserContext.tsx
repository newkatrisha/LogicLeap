import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { User, UserContextType } from "@/types/user";

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);

  const sanitizeUserData = (firebaseUser, additionalData = {}) => {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      level: additionalData.level || 1,
      questionsSolved: additionalData.questionsSolved || 0,
      coins: additionalData.coins || 0,
      age: additionalData.age,
      nickname: additionalData.nickname,
      purchasedItems: additionalData.purchasedItems || ["default"],
      purchasedStories: additionalData.purchasedStories || [
        { id: 0, name: "Harry Potter" },
      ],
      avatar: additionalData.avatar || "default",
    };
  };

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("userData");
      console.log("userData", userData);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    loadUser();

    const unsubscribe = onAuthStateChanged(
      FIREBASE_AUTH,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const userRef = doc(FIREBASE_DB, "users", firebaseUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const sanitizedData = sanitizeUserData(
                firebaseUser,
                userDoc.data()
              );
              setUser(sanitizedData);
              await AsyncStorage.setItem(
                "userData",
                JSON.stringify(sanitizedData)
              ); // Synchronize with local storage
            } else {
              console.log("No user data available");
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to load user data:", error);
          await AsyncStorage.removeItem("userData");
          setUser(null);
        }
      }
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const updateStorage = async () => {
      try {
        if (user) {
          const userDataToStore = {
            uid: user.uid,
            email: user.email,
            level: user.level,
            questionsSolved: user.questionsSolved,
            coins: user.coins,
            age: user.age,
            nickname: user.nickname,
            purchasedItems: user.purchasedItems || [],
            purchasedStories: user.purchasedStories || [
              { id: 0, name: "Harry Potter" },
            ],
            avatar: user.avatar || null, // Ensure avatar is included
          };

          const userDataString = JSON.stringify(userDataToStore);
          await AsyncStorage.setItem("userData", userDataString); // Asynchronously update local storage

          if (user.uid) {
            const userRef = doc(FIREBASE_DB, "users", user.uid);
            await updateDoc(userRef, userDataToStore); // Directly pass sanitized user data
          }
        }
      } catch (error) {
        console.error("Failed to update user data in storage:", error);
        await AsyncStorage.removeItem("userData");
      }
    };
    updateStorage();
  }, [user]);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    await FIREBASE_AUTH.signOut();
    setUser(null);
    await AsyncStorage.removeItem("userData");
  };

  const markTestCompleted = async () => {
    setTestCompleted(true);
  };

  const updateNickname = async (newNickname) => {
    if (user) {
      const userRef = doc(FIREBASE_DB, "users", user.uid);
      try {
        await updateDoc(userRef, {
          nickname: newNickname,
        });
        setUser({ ...user, nickname: newNickname }); // Update user in context
      } catch (error) {
        console.error("Failed to update nickname:", error);
      }
    }
  };

  const updateLevelIfNeeded = async () => {
    if (user) {
      let newLevel = 1 + Math.floor(user.questionsSolved / 15); // Increase level every 15 questions solved
      if (newLevel > user.level) {
        setUser((prev) => ({
          ...prev,
          level: newLevel,
        }));
        return { newLevel, leveledUp: true }; // Return the new level and that a level up occurred
      }
    }
    return { newLevel: user.level, leveledUp: false }; // No level change occurred
  };

  const updateCoins = async (additionalCoins) => {
    if (user) {
      const newCoins = user.coins + additionalCoins;
      setUser((prev) => ({
        ...prev,
        coins: newCoins,
      }));
    }
  };

  const updateQuestionsSolved = async (additionalQuestions) => {
    if (user) {
      const QuestionsSolved = user.questionsSolved + additionalQuestions;
      setUser((prev) => ({
        ...prev,
        questionsSolved: QuestionsSolved,
      }));
    }
  };

  const updateAvatar = async (newAvatar) => {
    if (user) {
      const userRef = doc(FIREBASE_DB, "users", user.uid);
      try {
        await updateDoc(userRef, {
          avatar: newAvatar,
        });
        setUser({ ...user, avatar: newAvatar }); // Update user in context
      } catch (error) {
        console.error("Failed to update avatar:", error);
      }
    }
  };

  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        testCompleted,
        markTestCompleted,
        updateNickname,
        updateLevelIfNeeded,
        updateCoins,
        updateProfile,
        updateQuestionsSolved,
        updateAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
