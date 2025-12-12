import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth/auth";

type Review = {
  id: string;
  userEmail: string;
  rating: number;
  text: string;
  createdAt: number; // timestamp
  photoUri?: string;
};

const DEMO_REVIEWS: Review[] = [
  {
    id: "r1",
    userEmail: "user1@mail.com",
    rating: 5,
    text: "Очень удобно: быстро нашёл событие и записался.",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    photoUri: "https://i.pravatar.cc/120?img=18",
  },
  {
    id: "r2",
    userEmail: "user2@mail.com",
    rating: 4,
    text: "Неплохо, но хочу фильтры по расстоянию и цене.",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    photoUri: "https://i.pravatar.cc/120?img=22",
  },
  {
    id: "r3",
    userEmail: "user3@mail.com",
    rating: 3,
    text: "Иногда непонятно, где место встречи. Нужна карта на странице события.",
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: "r4",
    userEmail: "user4@mail.com",
    rating: 5,
    text: "Круто! Язык KG/EN прям важная тема, спасибо.",
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    photoUri: "https://i.pravatar.cc/120?img=30",
  },
  {
    id: "r5",
    userEmail: "user5@mail.com",
    rating: 2,
    text: "Нужно добавить восстановление пароля и подтверждение почты.",
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
  },
];

type SortKey = "new" | "old" | "rating";

function formatDate(ts: number) {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yy} ${hh}:${mi}`;
}

export default function Reviews() {
  const { user } = useAuth();

  const [sort, setSort] = useState<SortKey>("new");
  const [page, setPage] = useState(1);
  const pageSize = 3;

  if (!user?.isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>Отзывы пользователей</Text>
        <Text style={styles.warn}>Доступно только админам.</Text>
      </View>
    );
  }

  const sorted = useMemo(() => {
    const arr = [...DEMO_REVIEWS];
    if (sort === "rating") arr.sort((a, b) => b.rating - a.rating);
    if (sort === "new") arr.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "old") arr.sort((a, b) => a.createdAt - b.createdAt);
    return arr;
  }, [sort]);

  const visible = sorted.slice(0, page * pageSize);
  const hasMore = visible.length < sorted.length;

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Отзывы пользователей</Text>

      <View style={styles.sortRow}>
        <SortChip label="Новые" active={sort === "new"} onPress={() => { setSort("new"); setPage(1); }} />
        <SortChip label="Старые" active={sort === "old"} onPress={() => { setSort("old"); setPage(1); }} />
        <SortChip label="Рейтинг" active={sort === "rating"} onPress={() => { setSort("rating"); setPage(1); }} />
      </View>

      <FlatList
        data={visible}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 18 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.top}>
              <Image
                source={item.photoUri ? { uri: item.photoUri } : { uri: "https://i.pravatar.cc/120?img=12" }}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.userEmail}</Text>
                <Text style={styles.sub}>⭐ {item.rating}/5 • {formatDate(item.createdAt)}</Text>
              </View>
            </View>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
        ListFooterComponent={
          hasMore ? (
            <Pressable style={styles.moreBtn} onPress={() => setPage((p) => p + 1)}>
              <Text style={styles.moreText}>Загрузить ещё</Text>
            </Pressable>
          ) : (
            <Text style={styles.end}>Все отзывы загружены</Text>
          )
        }
      />
    </View>
  );
}

function SortChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", padding: 16, paddingTop: 24 },
  h1: { fontSize: 20, fontWeight: "900", textAlign: "center", marginBottom: 10 },
  warn: { textAlign: "center", color: "#666", fontWeight: "700" },

  sortRow: { flexDirection: "row", gap: 8, justifyContent: "center", marginBottom: 6 },
  chip: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: "#f2f4f7" },
  chipActive: { backgroundColor: "#0f8a87" },
  chipText: { fontWeight: "900", color: "#111" },
  chipTextActive: { color: "white" },

  card: { backgroundColor: "white", borderRadius: 18, padding: 14, marginTop: 10 },
  top: { flexDirection: "row", gap: 10, alignItems: "center" },
  avatar: { width: 44, height: 44, borderRadius: 16, backgroundColor: "#e6e8ee" },
  title: { fontSize: 14, fontWeight: "900" },
  sub: { marginTop: 2, color: "#666", fontWeight: "700", fontSize: 12 },
  text: { marginTop: 10, color: "#333", fontWeight: "600", lineHeight: 18 },

  moreBtn: { marginTop: 14, backgroundColor: "#0f8a87", borderRadius: 16, paddingVertical: 12, alignItems: "center" },
  moreText: { color: "white", fontWeight: "900" },
  end: { marginTop: 14, textAlign: "center", color: "#666", fontWeight: "800" },
});