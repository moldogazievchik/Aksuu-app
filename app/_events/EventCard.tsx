import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { EventItem } from "../../src/events/types";

function formatWhen(ts: number) {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}, ${hh}:${mi}`;
}

function categoryLabel(c: EventItem["category"]) {
  switch (c) {
    case "sport": return "Спорт";
    case "health": return "Здоровье";
    case "culture": return "Культура";
    case "hobby": return "Хобби";
    case "education": return "Обучение";
  }
}

export function EventCard({
  item,
  onPress,
}: {
  item: EventItem;
  onPress: () => void;
}) {
  const left = item.capacity - item.joined;

  const status = useMemo(() => {
    if (left <= 0) return item.waitlistEnabled ? "WAITLIST" : "SOLD_OUT";
    if (left <= 3) return "FEW_LEFT";
    return "OPEN";
  }, [left, item.waitlistEnabled]);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.more}>Подробнее…</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🏷 {categoryLabel(item.category)}</Text>
          </View>

          {status === "SOLD_OUT" ? (
            <View style={[styles.status, styles.statusSold]}>
              <Text style={styles.statusText}>Распродано</Text>
            </View>
          ) : status === "WAITLIST" ? (
            <View style={[styles.status, styles.statusWait]}>
              <Text style={styles.statusText}>В ожидание</Text>
            </View>
          ) : status === "FEW_LEFT" ? (
            <View style={[styles.status, styles.statusFew]}>
              <Text style={styles.statusText}>Мест мало: {left}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaText}>🗓 {formatWhen(item.startsAt)}</Text>
          <Text style={styles.metaText}>📍 {item.locationName} • {item.distanceKm.toFixed(1)} км</Text>
          <Text style={styles.metaText}>
            👤 {item.organizerName} • ⭐ {item.organizerRating.toFixed(1)} • {item.joined}/{item.capacity}
          </Text>
          <Text style={styles.metaText}>
            💰 {item.price === 0 ? "Бесплатно" : `${item.price} сом`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "white", borderRadius: 18, overflow: "hidden", marginBottom: 14 },
  image: { width: "100%", height: 190, backgroundColor: "#e6e8ee" },
  body: { padding: 14 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  title: { flex: 1, fontSize: 18, fontWeight: "900" },
  more: { color: "#0f8a87", fontWeight: "800", marginTop: 3 },
  badgeRow: { flexDirection: "row", gap: 8, alignItems: "center", marginTop: 10, flexWrap: "wrap" },
  badge: { backgroundColor: "#eef7f7", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 },
  badgeText: { fontWeight: "800", color: "#0b5f5d", fontSize: 12 },

  status: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 },
  statusText: { fontWeight: "900", fontSize: 12, color: "white" },
  statusSold: { backgroundColor: "#b00020" },
  statusWait: { backgroundColor: "#6a4cff" },
  statusFew: { backgroundColor: "#ff8a00" },

  meta: { marginTop: 10, gap: 6 },
  metaText: { color: "#555", fontWeight: "700" },
});