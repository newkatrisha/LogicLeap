import { Stack } from "expo-router";
import { UserProvider } from "@/contexts/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ headerShown: true }} />
        <Stack.Screen name="learning" options={{ headerShown: true }} />
        <Stack.Screen name="math/[type]" options={{ headerShown: true }} />
      </Stack>
    </UserProvider>
  );
}
