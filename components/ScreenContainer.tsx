import { SafeAreaView, StyleSheet, View } from "react-native";
import CoinDisplay from "./CoinDisplay";

const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <CoinDisplay />
        </View>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default ScreenContainer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    paddingBottom: 10,
    alignItems: "flex-start",
    width: "100%",
  },
});
