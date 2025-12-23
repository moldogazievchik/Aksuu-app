import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth/auth";
import { EventCategory, EventDraft, upsertEvent } from "../../src/events/store";

const CATS: { id: EventCategory; label: string }[] = [
  { id: "sport", label: "Спорт" },
  { id: "health", label: "Здоровье" },
  { id: "culture", label: "Культура" },
  { id: "hobby", label: "Хобби" },
  { id: "education", label: "Обучение" },
];

const EMPTY: EventDraft = {
  title: "",
  description: "",
  category: null,
  startsAt: new Date(Date.now() + 24 * 3600_000).toISOString(), // завтра
  locationName: "",
  photoUri: "",
  limit: null,
  price: 0,
};

function validate(d: EventDraft) {
  const errs: string[] = [];
  if (!d.title.trim()) errs.push("Название");
  if (!d.description.trim()) errs.push("Описание");
  if (!d.category) errs.push("Категория");
  if (!d.locationName.trim()) errs.push("Локация");
  if (!d.startsAt) errs.push("Дата/время");
  if (d.limit == null || Number.isNaN(d.limit) || d.limit <= 0) errs.push("Лимит участников (> 0)");
  if (d.price < 0) errs.push("Цена (>= 0)");
  return errs;
}

export default function CreateEventScreen() {
  const { user } = useAuth();
  const [draft, setDraft] = useState<EventDraft>(EMPTY);
  const [saving, setSaving] = useState(false);

  const prettyDate = useMemo(() => {
    try {
      const dt = new Date(draft.startsAt);
      return dt.toLocaleString("ru-RU");
    } catch {
      return draft.startsAt;
    }
  }, [draft.startsAt]);

  const onSave = async (status: "draft" | "published") => {
    if (!user) return;

    const errors = validate(draft);
    if (errors.length) {
      Alert.alert("Проверь поля", "Нужно заполнить: " + errors.join(", "));
      return;
    }

    setSaving(true);
    try {
      const saved = await upsertEvent(draft, {
        status,
        organizerEmail: user.email,
        organizerName: user.name,
      });

      Alert.alert(
        status === "published" ? "Опубликовано" : "Сохранено",
        status === "published" ? "Событие появилось в ленте" : "Черновик сохранён"
      );

      // дальше: router.replace(`/_events/${saved.id}`) когда будет страница события
      router.back();
    } catch (e: any) {
      Alert.alert("Ошибка", e?.message ?? "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text style={styles.h1}>Создание события</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Название *</Text>
        <TextInput
          style={styles.input}
          value={draft.title}
          onChangeText={(v) => setDraft((s) => ({ ...s, title: v }))}
          placeholder="Например: Футбол во дворе"
        />

        <Text style={styles.label}>Описание *</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={draft.description}
          onChangeText={(v) => setDraft((s) => ({ ...s, description: v }))}
          placeholder="Что будет? Что нужно взять? Кому подходит?"
          multiline
        />

        <Text style={styles.label}>Категория *</Text>
        <View style={styles.rowWrap}>
          {CATS.map((c) => {
            const active = draft.category === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setDraft((s) => ({ ...s, category: c.id }))}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Дата/время *</Text>
        <Text style={styles.hint}>Сейчас: {prettyDate}</Text>
        <TextInput
          style={styles.input}
          value={draft.startsAt}
          onChangeText={(v) => setDraft((s) => ({ ...s, startsAt: v }))}
          placeholder="ISO строка (позже заменим на DatePicker)"
        />

        <Text style={styles.label}>Локация *</Text>
        <TextInput
          style={styles.input}
          value={draft.locationName}
          onChangeText={(v) => setDraft((s) => ({ ...s, locationName: v }))}
          placeholder="Например: Бишкек, парк Панфилова"
        />

        <Text style={styles.label}>Лимит участников *</Text>
        <TextInput
          style={styles.input}
          value={draft.limit == null ? "" : String(draft.limit)}
          onChangeText={(v) =>
            setDraft((s) => ({ ...s, limit: v ? Number(v.replace(/\D/g, "")) : null }))
          }
          keyboardType="number-pad"
          placeholder="Например: 20"
        />

        <Text style={styles.label}>Цена</Text>
        <TextInput
          style={styles.input}
          value={String(draft.price)}
          onChangeText={(v) =>
            setDraft((s) => ({ ...s, price: Number(v.replace(/[^\d]/g, "")) || 0 }))
          }
          keyboardType="number-pad"
          placeholder="0 = бесплатно"
        />

        <View style={{ height: 12 }} />

        <Pressable style={[styles.btn, saving && { opacity: 0.6 }]} disabled={saving} onPress={() => onSave("draft")}>
          <Text style={styles.btnText}>Сохранить черновик</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.btnPrimary, saving && { opacity: 0.6 }]}
          disabled={saving}
          onPress={() => onSave("published")}
        >
          <Text style={styles.btnText}>Опубликовать</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9" },
  h1: { fontSize: 20, fontWeight: "900", textAlign: "center", marginTop: 10, marginBottom: 10 },
  card: { backgroundColor: "white", borderRadius: 18, padding: 14 },
  label: { fontSize: 12, color: "#666", fontWeight: "700", marginTop: 10, marginBottom: 8 },
  hint: { color: "#777", fontWeight: "600", marginBottom: 8 },
  input: { backgroundColor: "#f2f4f7", borderRadius: 14, padding: 12, fontWeight: "700" },
  textarea: { minHeight: 90, textAlignVertical: "top" as any },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: "#f2f4f7" },
  chipActive: { backgroundColor: "#0f8a87" },
  chipText: { fontWeight: "800", color: "#111" },
  chipTextActive: { color: "white" },
  btn: { backgroundColor: "#111", paddingVertical: 12, borderRadius: 16, alignItems: "center", marginTop: 10 },
  btnPrimary: { backgroundColor: "#0f8a87" },
  btnText: { color: "white", fontWeight: "900" },
});