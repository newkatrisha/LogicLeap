import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { generateMathQuestions } from "@/utils/generateMathQuestions";
import { useUser } from "@/contexts/UserContext";
import { router } from "expo-router";

const TestSkills = () => {
  const navigation = useNavigation();
  const { user, markTestCompleted } = useUser();
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [scores, setScores] = useState({ plus: 0, minus: 0, multiply: 0 });

  useEffect(() => {
    handleStart();
  }, []); // Dependency array is empty, so this runs only once when the component mounts

  const handleStart = () => {
    if (!user || !user.age) {
      alert("Please create an account with your age to take the test.");
      navigation.goBack();
      return;
    }
    const generatedQuestions = generateMathQuestions(user.age);
    setQuestions(generatedQuestions);
    setQuestionIndex(1); // Set to 1 since array index 0 will be accessed as the first question
    setUserAnswer("");
    setScores({ plus: 0, minus: 0, multiply: 0 });
  };

  const handleAnswerSubmit = () => {
    const currentQuestion = questions[questionIndex - 1];
    if (parseInt(userAnswer) === currentQuestion.answer) {
      const operation = currentQuestion.question.includes("+")
        ? "plus"
        : currentQuestion.question.includes("-")
        ? "minus"
        : "multiply";
      setScores((prevScores) => ({
        ...prevScores,
        [operation]: prevScores[operation] + 1,
      }));
    }
    setUserAnswer("");
    if (questionIndex < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      markTestCompleted();
      router.replace("/home");
    }
  };

  return (
    <View style={styles.container}>
      {questions.length > 0 && questionIndex > 0 && (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {questions[questionIndex - 1].question}
          </Text>
          <TextInput
            style={styles.answerInput}
            keyboardType="numeric"
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Enter your answer"
          />
          <Button title="Submit Answer" onPress={handleAnswerSubmit} />
        </View>
      )}
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
  questionContainer: {
    alignItems: "center",
    width: "100%",
  },
  questionText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  answerInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 20,
    width: 200,
    paddingHorizontal: 10,
  },
});

export default TestSkills;
