import { Stack } from "expo-router";
import React from 'react';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitle: "AKSUU",
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="edit" options={{ title: "AKSUU" }} />
      <Stack.Screen name="my-events" options={{ title: "AKSUU" }} />
      <Stack.Screen name="settings" options={{ title: "AKSUU" }} />
      <Stack.Screen name="support" options={{ title: "AKSUU" }} />
      <Stack.Screen name="reviews" options={{ title: "AKSUU" }} />
    </Stack>
  );
}