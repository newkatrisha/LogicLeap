import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  generateMathQuestions,
  MathQuestion,
} from "@/utils/generateMathQuestions";
import { useUser } from "@/contexts/UserContext";
// import LevelUpModal from "../components/LevelUpModal";
import i18n from "../locales/localization";
// import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import * as images from "@/assets/images";
import CoinDisplay from "@/components/CoinDisplay";

// const correctSoundFiles = {
//     en: require('../../assets/sounds/good_job_en.aac'),
//     ru: require('../../assets/sounds/good_job_ru.aac'),
//     he: require('../../assets/sounds/good_job_he.aac'),
// };

// const incorrectSoundFiles = {
//     en: require('../../assets/sounds/try_again_en.aac'),
//     ru: require('../../assets/sounds/try_again_ru.aac'),
//     he: require('../../assets/sounds/try_again_he.aac'),
// };

const MathProblems = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { user, updateLevelIfNeeded, updateCoins, updateQuestionsSolved } =
    useUser();
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackImage, setFeedbackImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);

  const language = i18n.locale;
  const correctAnswer = questions[currentQuestionIndex]?.answer;

  // useEffect(() => {
  //     const loadSounds = async () => {
  //         try {
  //             const { sound: correctSound } = await Audio.Sound.createAsync(correctSoundFiles[language]);
  //             const { sound: incorrectSound } = await Audio.Sound.createAsync(incorrectSoundFiles[language]);
  //             correctSoundRef.current = correctSound;
  //             incorrectSoundRef.current = incorrectSound;
  //         } catch (error) {
  //             console.error('Error loading sounds:', error);
  //         }
  //     };

  //     loadSounds();

  //     return () => {
  //         correctSoundRef.current?.unloadAsync();
  //         incorrectSoundRef.current?.unloadAsync();
  //     };
  // }, [language]);

  useEffect(() => {
    if (user && user.age && questions.length === 0) {
      setQuestions(generateMathQuestions(type, user.age));
    }
  }, [user, questions, type]);

  const handleAnswerSubmit = async (choice) => {
    const isCorrect = choice === correctAnswer;
    setSelectedAnswer(choice);
    setFeedback(i18n.t(isCorrect ? "correct" : "incorrect"));
    setFeedbackImage(isCorrect ? images.correctSmile : images.incorrectSmile);

    if (isCorrect) {
      // if (correctSoundRef.current) {
      //     await correctSoundRef.current.replayAsync();
      // }
      updateCoins(1);
      updateQuestionsSolved(1);

      const { newLevel, leveledUp } = await updateLevelIfNeeded();
      if (leveledUp) {
        setModalContent(
          `${i18n.t("congratulations")}! ${i18n.t("leveledUp")} ${newLevel}!`
        );
        setModalVisible(true);
      }

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
          setModalContent(i18n.t("completedAllProblems"));
          setModalVisible(true);
        }
        resetFeedback();
      }, 2000);
    } else {
      // if (incorrectSoundRef.current) {
      //     await incorrectSoundRef.current.replayAsync();
      // }
      setTimeout(resetFeedback, 2000);
    }
  };

  const resetFeedback = () => {
    setFeedback("");
    setFeedbackImage(null);
    setSelectedAnswer(null);
  };

  const renderQuestion = () => {
    const { num1, operation, num2, answer } =
      questions[currentQuestionIndex] || {};
    return (
      <View style={styles.questionContainer}>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{num1}</Text>
        </View>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{operation}</Text>
        </View>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{num2}</Text>
        </View>
        <Text style={styles.questionText}>=</Text>
        <View style={styles.answerBox}>
          {selectedAnswer === correctAnswer && (
            <Text style={styles.correctAnswerText}>{answer}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CoinDisplay />
      {renderQuestion()}
      <View style={styles.choicesContainer}>
        {questions[currentQuestionIndex]?.choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.choiceButton,
              selectedAnswer === choice &&
                (choice === correctAnswer
                  ? styles.correctAnswer
                  : styles.incorrectAnswer),
            ]}
            onPress={() => handleAnswerSubmit(choice)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.choiceText}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.indexText}>{`${currentQuestionIndex + 1}/${
        questions.length
      }`}</Text>
      {feedbackImage && (
        <Image source={feedbackImage} style={styles.feedbackImage} />
      )}
      {feedback && (
        <Text
          style={[
            styles.feedback,
            { color: feedbackImage === images.correctSmile ? "green" : "red" },
          ]}
        >
          {feedback}
        </Text>
      )}
      {/* <LevelUpModal
        isVisible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
        //   navigation.replace("LearningModule");
        }}
        message={modalContent}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#006400",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  questionBox: {
    backgroundColor: "#8FBC8F",
    padding: 15,
    margin: 5,
    borderRadius: 5,
    minWidth: 60,
    alignItems: "center",
  },
  questionText: {
    fontSize: 24,
    color: "#fff",
  },
  answerBox: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 5,
    borderRadius: 5,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  correctAnswerText: {
    fontSize: 24,
    color: "#000",
  },
  choicesContainer: {
    width: "100%",
    marginBottom: 20,
  },
  choiceButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#add8e6",
    borderRadius: 10,
    alignItems: "center",
  },
  choiceText: {
    fontSize: 18,
  },
  correctAnswer: {
    backgroundColor: "green",
  },
  incorrectAnswer: {
    backgroundColor: "red",
  },
  feedback: {
    fontSize: 18,
    marginTop: 10,
  },
  feedbackImage: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
  indexText: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
  },
});

export default MathProblems;
