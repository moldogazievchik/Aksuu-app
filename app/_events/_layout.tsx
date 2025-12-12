import { Stack } from "expo-router";

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitle: "AKSUU",
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="filter" options={{ title: "Фильтры" }} />
      {/* позже: event details */}
    </Stack>
  );
}