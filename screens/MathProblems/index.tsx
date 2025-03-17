import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import {
  generateMathQuestions,
  MathQuestion,
} from "@/utils/generateMathQuestions";
import { useUser } from "@/contexts/UserContext";
import i18n from "@/locales/localization";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import * as images from "@/assets/images";
import { correctSoundFiles, incorrectSoundFiles } from "./constants";
import LevelUpModal from "@/components/LevelUpModal";
import ScreenContainer from "@/components/ScreenContainer";

const MathProblems = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { user, updateLevelIfNeeded, updateCoins, updateQuestionsSolved } =
    useUser();
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackImage, setFeedbackImage] =
    useState<ImageSourcePropType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const correctSoundRef = useRef<Audio.Sound | null>(null);
  const incorrectSoundRef = useRef<Audio.Sound | null>(null);

  const language = i18n.locale;
  const correctAnswer = questions[currentQuestionIndex]?.answer;

  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: correctSound } = await Audio.Sound.createAsync(
          correctSoundFiles[language as keyof typeof correctSoundFiles],
          { shouldPlay: false }
        );
        const { sound: incorrectSound } = await Audio.Sound.createAsync(
          incorrectSoundFiles[language as keyof typeof incorrectSoundFiles]
        );
        correctSoundRef.current = correctSound;
        incorrectSoundRef.current = incorrectSound;
      } catch (error) {
        console.error("Error loading sounds:", error);
      }
    };

    loadSounds();

    return () => {
      correctSoundRef.current?.unloadAsync();
      incorrectSoundRef.current?.unloadAsync();
    };
  }, [language]);

  useEffect(() => {
    if (user && user.age && questions.length === 0) {
      setQuestions(generateMathQuestions(type, user.age));
    }
  }, [user, questions, type]);

  const handleAnswerSubmit = async (choice: number) => {
    const isCorrect = choice === correctAnswer;
    setSelectedAnswer(choice);
    setFeedback(i18n.t(isCorrect ? "correct" : "incorrect"));
    setFeedbackImage(isCorrect ? images.correctSmile : images.incorrectSmile);

    if (isCorrect) {
      if (correctSoundRef.current) {
        await correctSoundRef.current.replayAsync();
      }
      updateCoins(1);
      updateQuestionsSolved(1);

      const { newLevel, leveledUp } = updateLevelIfNeeded();

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
      try {
        if (incorrectSoundRef.current) {
          await incorrectSoundRef.current.setPositionAsync(0);
          await incorrectSoundRef.current.playAsync();
        }
      } catch (error) {
        console.error("Error playing incorrect sound:", error);
      }
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
    <ScreenContainer>
      <View style={styles.container}>
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
              {
                color: feedbackImage === images.correctSmile ? "green" : "red",
              },
            ]}
          >
            {feedback}
          </Text>
        )}
        <LevelUpModal
          isVisible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            router.replace("/home/learning");
          }}
          message={modalContent}
        />
      </View>
    </ScreenContainer>
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
