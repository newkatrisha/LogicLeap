import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="test"
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="learning"
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="math/[type]"
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="stories_picker"
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="story/[name]"
        options={{ headerShown: true, headerTitle: "" }}
      />
    </Stack>
  );
}
