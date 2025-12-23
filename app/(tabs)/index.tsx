import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { DEMO_EVENTS } from "../../src/events/demoData";
import { EventItem } from "../../src/events/types";
import { EventCard } from "../_events/EventCard";

type Filter = {
  q: string;
  categories: Set<string>;
  dateRange: "any" | "today" | "week" | "month";
  price: "any" | "free" | "paid";
};

const defaultFilter: Filter = {
  q: "",
  categories: new Set(),
  dateRange: "any",
  price: "any",
};

export default function HomeFeed() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<EventItem[]>([]);

  const params = useLocalSearchParams<{
  q?: string;
  categories?: string; // "sport,health"
  dateRange?: "any" | "today" | "week" | "month";
  price?: "any" | "free" | "paid";
}>();

const filter: Filter = useMemo(() => {
  const q = (params.q ?? "").toString();

  const categories = new Set(
    (params.categories ?? "")
      .toString()
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
  );

  const dateRange = (params.dateRange ?? "any") as Filter["dateRange"];
  const price = (params.price ?? "any") as Filter["price"];

  return { q, categories, dateRange, price };
}, [params.q, params.categories, params.dateRange, params.price]);

  // имитация загрузки
  useEffect(() => {
    const t = setTimeout(() => {
      setItems(DEMO_EVENTS);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = filter.q.trim().toLowerCase();
    const now = Date.now();
    const day = 24 * 3600_000;

    return items.filter((e) => {
      if (q) {
        const hay = `${e.title} ${e.locationName} ${e.organizerName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (filter.categories.size > 0 && !filter.categories.has(e.category)) return false;

      if (filter.price === "free" && e.price !== 0) return false;
      if (filter.price === "paid" && e.price === 0) return false;

      if (filter.dateRange === "today" && e.startsAt > now + day) return false;
      if (filter.dateRange === "week" && e.startsAt > now + 7 * day) return false;
      if (filter.dateRange === "month" && e.startsAt > now + 30 * day) return false;

      return true;
    });
  }, [items, filter]);

  const openFilters = () => {
    router.push({
      pathname: "/_events/filter",
      params: {
        q: filter.q,
        categories: Array.from(filter.categories).join(","),
        dateRange: filter.dateRange,
        price: filter.price,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.logo}>AKSUU</Text>
        <ActivityIndicator />
        <Text style={styles.hint}>Загружаем события…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.logo}>AKSUU</Text>

        <Pressable style={styles.filterBtn} onPress={openFilters}>
          <Text style={styles.filterText}>⛭  Фильтры</Text>
        </Pressable>
        <Pressable style={styles.filterBtn} onPress={() => router.push("/_events/create")}>
          <Text style={styles.filterText}>＋ Создать событие</Text>
        </Pressable>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Ничего не найдено</Text>
          <Text style={styles.emptyText}>
            Попробуйте изменить фильтры или сбросить их.
          </Text>
          <Pressable style={styles.resetBtn} onPress={() => router.push("/_events/filter" as const)}>
            <Text style={styles.resetText}>Открыть фильтры</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{ padding: 16, paddingTop: 10, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onPress={() => {
                // позже: /_events/[id]
                // пока просто покажем алерт/заглушку
                router.push("/_events/filter" as const);
              }}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9" },
  top: { paddingTop: 14, paddingHorizontal: 16, gap: 10 },
  logo: { fontSize: 18, fontWeight: "900" },
  filterBtn: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e6e8ee",
  },
  filterText: { fontWeight: "900", color: "#111" },

  center: { flex: 1, backgroundColor: "#f3f5f9", justifyContent: "center", alignItems: "center", gap: 10 },
  hint: { color: "#666", fontWeight: "700" },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "900" },
  emptyText: { color: "#666", fontWeight: "700", textAlign: "center" },
  resetBtn: { backgroundColor: "#0f8a87", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, marginTop: 8 },
  resetText: { color: "white", fontWeight: "900" },
});