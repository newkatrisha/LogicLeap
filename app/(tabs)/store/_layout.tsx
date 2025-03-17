import i18n from "@/locales/localization";
import { Stack } from "expo-router";

export default function StoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: true, headerTitle: i18n.t("store") }}
      />
      <Stack.Screen
        name="avatars"
        options={{
          headerShown: true,
          headerTitle: i18n.t("avatars"),
        }}
      />
      <Stack.Screen
        name="stories"
        options={{ headerShown: true, headerTitle: i18n.t("stories") }}
      />
    </Stack>
  );
}
