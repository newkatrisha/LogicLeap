import { Platform } from "react-native";

// Android emulator needs to use 10.0.2.2 to access the host machine's localhost
const API_HOST =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

export default {
  API_HOST,
};
