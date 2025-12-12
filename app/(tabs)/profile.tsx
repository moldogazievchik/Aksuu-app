import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth/auth";

export default function ProfileTab() {
  const { user, logout } = useAuth();

  const avatar = user?.photoUri
    ? { uri: user.photoUri }
    : { uri: "https://i.pravatar.cc/200?img=12" }; // DEMO заглушка

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.meta}>{user?.email}</Text>
          <Text style={styles.meta}>{user?.phone || "Телефон не указан"}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {user?.rating?.toFixed(1) ?? "—"}</Text>
            <Text style={styles.lang}>• {user?.language?.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.btn} onPress={() => router.push("/_profile/edit" as const)}>
        <Text style={styles.btnText}>Редактировать профиль</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={() => router.push("/_profile/my-events" as const)}>
        <Text style={styles.btnText}>Мои мероприятия</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={() => router.push("/_profile/settings" as const)}>
        <Text style={styles.btnText}>Настройки</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={() => router.push("/_profile/support" as const)}>
        <Text style={styles.btnText}>Поддержка</Text>
      </Pressable>

      {user?.isAdmin ? (
        <Pressable style={styles.btn} onPress={() => router.push("/_profile/reviews" as const)}>
          <Text style={styles.btnText}>Отзывы пользователей (админ)</Text>
        </Pressable>
      ) : null}

      <Pressable
        style={[styles.btn, { backgroundColor: "#111", marginTop: 18 }]}
        onPress={async () => {
          await logout();
          router.replace("/_auth/login" as const);
        }}
      >
        <Text style={styles.btnText}>Выйти</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", padding: 16, paddingTop: 24 },
  header: { backgroundColor: "white", borderRadius: 18, padding: 14, flexDirection: "row", gap: 12, marginBottom: 12 },
  avatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: "#e6e8ee" },
  name: { fontSize: 18, fontWeight: "900" },
  meta: { marginTop: 2, color: "#666", fontWeight: "600" },
  ratingRow: { flexDirection: "row", gap: 8, marginTop: 6, alignItems: "center" },
  rating: { fontWeight: "900" },
  lang: { color: "#666", fontWeight: "700" },
  btn: { backgroundColor: "#0f8a87", paddingVertical: 12, borderRadius: 16, marginTop: 10, alignItems: "center" },
  btnText: { color: "white", fontWeight: "800" },
});