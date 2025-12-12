import { router, Stack, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/auth/auth";

function RootNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const first = String(segments[0] ?? "");
    const inAuth = first === "_auth";
    const inTabs = first === "(tabs)";
    const inProfile = first === "_profile";
    const inEvents = first === "_events";

    // 1) Если НЕ залогинен — можно быть только в auth
    if (!user && !inAuth) {
      router.replace("/_auth/login");
      return;
    }

    // 2) Если залогинен — нельзя оставаться в auth (логин/рег)
    if (user && inAuth) {
      router.replace("/(tabs)");
      return;
    }

    // 3) Если залогинен — разрешаем tabs и profile
    if (user && !(inTabs || inProfile || inEvents)) {
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  return (
    <Stack>
      <Stack.Screen name="_auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="_profile" options={{ headerShown: true, title: "" }} />
      <Stack.Screen name="modal" options={{ presentation: "modal", headerShown: true }} />
      <Stack.Screen name="_events" options={{ headerShown: true, title: "" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}