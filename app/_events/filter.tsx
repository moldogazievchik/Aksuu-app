import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Category = "sport" | "health" | "culture" | "hobby" | "education";
type DateRange = "any" | "today" | "week" | "month";
type Price = "any" | "free" | "paid";

export type FilterState = {
  q: string;
  categories: Category[];
  dateRange: DateRange;
  price: Price;
};

export const FILTER_DEFAULT: FilterState = {
  q: "",
  categories: [],
  dateRange: "any",
  price: "any",
};

const catLabels: Record<Category, string> = {
  sport: "Спорт",
  health: "Здоровье",
  culture: "Культура",
  hobby: "Хобби",
  education: "Обучение",
};

export default function FilterScreen() {
  const [state, setState] = useState<FilterState>(FILTER_DEFAULT);

  const toggleCat = (c: Category) => {
    setState((s) => {
      const has = s.categories.includes(c);
      return { ...s, categories: has ? s.categories.filter((x) => x !== c) : [...s.categories, c] };
    });
  };

  const apply = () => {
    const params = {
    q: state.q || "",
    categories: state.categories.join(","), // "sport,health"
    dateRange: state.dateRange,
    price: state.price,
  };

  // возвращаемся на главную вкладку и кладём фильтры в URL
  router.replace({ 
    pathname: "/(tabs)", 
    params: {
          q: state.q,
    categories: state.categories.join(","),
    dateRange: state.dateRange,
    price: state.price,
    }, 
  });
};

  const reset = () => setState(FILTER_DEFAULT);

  const hasAny = useMemo(() => {
    return !!(state.q || state.categories.length || state.dateRange !== "any" || state.price !== "any");
  }, [state]);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Фильтры</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Поиск</Text>
        <TextInput
          value={state.q}
          onChangeText={(q) => setState((s) => ({ ...s, q }))}
          placeholder="Название / место"
          style={styles.input}
          placeholderTextColor="#9AA3AF"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Категории</Text>
        <View style={styles.rowWrap}>
          {(Object.keys(catLabels) as Category[]).map((c) => {
            const active = state.categories.includes(c);
            return (
              <Pressable
                key={c}
                onPress={() => toggleCat(c)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{catLabels[c]}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Дата</Text>
        <View style={styles.rowWrap}>
          {(["any", "today", "week", "month"] as const).map((d) => {
            const active = state.dateRange === d;
            const label = d === "any" ? "Любая" : d === "today" ? "Сегодня" : d === "week" ? "Неделя" : "Месяц";
            return (
              <Pressable
                key={d}
                onPress={() => setState((s) => ({ ...s, dateRange: d }))}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Цена</Text>
        <View style={styles.rowWrap}>
          {(["any", "free", "paid"] as const).map((p) => {
            const active = state.price === p;
            const label = p === "any" ? "Любая" : p === "free" ? "Бесплатно" : "Платно";
            return (
              <Pressable
                key={p}
                onPress={() => setState((s) => ({ ...s, price: p }))}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 12 }} />

        <Pressable style={styles.btn} onPress={apply}>
          <Text style={styles.btnText}>Применить</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnGhost, !hasAny && styles.btnDisabled]} onPress={reset} disabled={!hasAny}>
          <Text style={[styles.btnText, styles.btnGhostText, !hasAny && styles.btnDisabledText]}>Сбросить</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", padding: 16, paddingTop: 24 },
  h1: { fontSize: 20, fontWeight: "900", textAlign: "center", marginBottom: 10 },
  card: { backgroundColor: "white", borderRadius: 18, padding: 14 },

  label: { fontSize: 12, color: "#666", fontWeight: "900", marginTop: 10, marginBottom: 8 },

  input: {
    backgroundColor: "#f2f4f7",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  chip: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: "#f2f4f7" },
  chipActive: { backgroundColor: "#0f8a87" },
  chipText: { fontWeight: "900", color: "#111" },
  chipTextActive: { color: "white" },

  btn: { backgroundColor: "#0f8a87", paddingVertical: 12, borderRadius: 16, alignItems: "center", marginTop: 10 },
  btnText: { color: "white", fontWeight: "900" },

  btnGhost: { backgroundColor: "white", borderWidth: 2, borderColor: "#0f8a87" },
  btnGhostText: { color: "#0f8a87" },

  // приятное “disabled”, чтобы не выглядело как будто кнопка сломалась
  btnDisabled: { opacity: 0.5 },
  btnDisabledText: { color: "#0f8a87" },
});