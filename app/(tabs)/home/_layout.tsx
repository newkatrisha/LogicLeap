import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="test" options={{ headerShown: true }} />
      <Stack.Screen name="learning" options={{ headerShown: true }} />
      <Stack.Screen name="math/[type]" options={{ headerShown: true }} />
    </Stack>
  );
}
