import { Stack } from "expo-router";

export default function StoreLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="avatars"
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="stories"
        options={{ headerShown: true, headerTitle: "" }}
      />
    </Stack>
  );
}
