import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUser } from "@/contexts/UserContext";
import correctSmile from "@/assets/images/correctSmile.png";
import incorrectSmile from "@/assets/images/incorrectSmile.png";
// import CoinDisplay from "@/components/CoinsDisplay";
import LevelUpModal from "@/components/LevelUpModal";
import i18n from "@/locales/localization";
import { router, useLocalSearchParams } from "expo-router";

// Type for the math question
interface MathQuestion {
  num1: number;
  num2: number;
  operation: string;
}

// Type for the image sources
type ImageSource = typeof correctSmile | typeof incorrectSmile | null;

const generateChoices = (correctAnswer: number) => {
  const choices = new Set<number>();
  choices.add(correctAnswer);

  while (choices.size < 4) {
    const wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
    if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
      choices.add(wrongAnswer);
    }
  }

  return Array.from(choices).sort(() => Math.random() - 0.5);
};

const StoryMathProblem = () => {
  // Get params - extract what we need immediately to avoid dependency issues
  const params = useLocalSearchParams();
  const questionParam = params.question as string | undefined;
  const storyName = params.story_name as string | undefined;

  // All hooks must be called at the top level
  const { updateLevelIfNeeded, updateCoins, updateQuestionsSolved } = useUser();
  const [parsedQuestion, setParsedQuestion] = useState<MathQuestion | null>(
    null
  );
  const [error, setError] = useState(false);
  const [choices, setChoices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackImage, setFeedbackImage] = useState<ImageSource>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswerVisible, setCorrectAnswerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Parse question only once on component mount
  useEffect(() => {
    // Prevent repeated parsing
    if (isInitialized) return;

    try {
      if (typeof questionParam === "string" && questionParam) {
        const decodedQuestion = decodeURIComponent(questionParam);
        const questionObj = JSON.parse(decodedQuestion);

        // Ensure we have valid numbers
        const parsedObj: MathQuestion = {
          num1: Number(questionObj.num1),
          num2: Number(questionObj.num2),
          operation: String(questionObj.operation),
        };

        setParsedQuestion(parsedObj);
        setIsInitialized(true);
        setIsLoading(false);
      } else {
        console.error("Question parameter is not a string:", questionParam);
        setError(true);
        setIsInitialized(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error parsing question:", err);
      setError(true);
      setIsInitialized(true);
      setIsLoading(false);
    }
  }, [questionParam, isInitialized]);

  // Generate choices when question is parsed - memoize this function
  const getCorrectAnswer = useCallback((): number => {
    if (!parsedQuestion) return 0;

    const { num1, num2, operation } = parsedQuestion;

    switch (operation) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return Math.floor(num1 / num2);
      default:
        return 0;
    }
  }, [parsedQuestion]);

  // Generate choices only when parsedQuestion changes
  useEffect(() => {
    if (parsedQuestion && choices.length === 0) {
      try {
        const correctAnswer = getCorrectAnswer();
        setChoices(generateChoices(correctAnswer));
      } catch (err) {
        console.error("Error generating choices:", err);
        setError(true);
      }
    }
  }, [parsedQuestion, getCorrectAnswer, choices.length]);

  // Handle redirect on error - only run when error state changes
  useEffect(() => {
    if (error && storyName) {
      let isRedirecting = false;

      if (!isRedirecting) {
        isRedirecting = true;
        Alert.alert(
          "Error",
          "There was a problem with the math question. Returning to story."
        );

        const timer = setTimeout(() => {
          router.replace(`/home/story/${storyName}?isContinuing=true`);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [error, storyName]);

  // Reset feedback state
  const resetFeedback = () => {
    setFeedback("");
    setFeedbackImage(null);
    setSelectedAnswer(null);
  };

  // Handle answer submission
  const handleAnswerSubmit = async (choice: number) => {
    if (!parsedQuestion) return;

    try {
      const correctAnswer = getCorrectAnswer();
      const isCorrect = choice === correctAnswer;

      setSelectedAnswer(choice);
      setFeedback(i18n.t(isCorrect ? "correct" : "incorrect"));
      setFeedbackImage(isCorrect ? correctSmile : incorrectSmile);

      if (isCorrect) {
        setCorrectAnswerVisible(true);
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
          if (storyName) {
            router.replace(`/home/story/${storyName}?isContinuing=true`);
          } else {
            router.back();
          }
          resetFeedback();
        }, 2000);
      } else {
        setTimeout(resetFeedback, 2000);
      }
    } catch (err) {
      console.error("Error in handleAnswerSubmit:", err);
      Alert.alert("Error", "There was a problem processing your answer.");
    }
  };

  // Render the question UI
  const renderQuestion = () => {
    if (!parsedQuestion) return null;

    const { num1, operation, num2 } = parsedQuestion;
    const correctAnswer = getCorrectAnswer();

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
          {correctAnswerVisible && (
            <Text style={styles.correctAnswerText}>{correctAnswer}</Text>
          )}
        </View>
      </View>
    );
  };

  // Show loading screen
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render the full component
  return (
    <View style={styles.container}>
      {/* <CoinDisplay /> */}
      {renderQuestion()}
      <View style={styles.choicesContainer}>
        {choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.choiceButton,
              selectedAnswer === choice &&
                (correctAnswerVisible
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
      {feedbackImage && (
        <Image source={feedbackImage} style={styles.feedbackImage} />
      )}
      {feedback && (
        <Text
          style={[
            styles.feedback,
            { color: feedbackImage === correctSmile ? "green" : "red" },
          ]}
        >
          {feedback}
        </Text>
      )}
      <LevelUpModal
        isVisible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
        }}
        message={modalContent}
      />
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
});

export default StoryMathProblem;
