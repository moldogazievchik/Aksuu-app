import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitle: "AKSUU",
        headerBackTitle: "Назад",
      }}
    >
      <Stack.Screen name="login" options={{ title: "AKSUU" }} />
      <Stack.Screen name="register" options={{ title: "AKSUU" }} />
      
      <Stack.Screen name="reset-1-email" options={{ title: "AKSUU" }} />
      <Stack.Screen name="reset-2-code" options={{ title: "AKSUU" }} />
      <Stack.Screen name="reset-3-new-password" options={{ title: "AKSUU" }} />
    </Stack>
  );
}