import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const items = [
  { id: "1", title: "Поход в горы", role: "Участвую" },
  { id: "2", title: "Йога на рассвете", role: "Организую" },
];

export default function MyEvents() {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Мои мероприятия</Text>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>{item.role}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", padding: 16, paddingTop: 24 },
  h1: { fontSize: 20, fontWeight: "900", textAlign: "center", marginBottom: 12 },
  card: { backgroundColor: "white", borderRadius: 18, padding: 14, marginBottom: 10 },
  title: { fontSize: 15, fontWeight: "800" },
  sub: { marginTop: 6, color: "#666", fontWeight: "600" },
});