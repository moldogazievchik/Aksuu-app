import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth/auth";
import { EventDraft, getEvent, upsertEvent } from "../../src/events/store";

export default function EditEventScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [draft, setDraft] = useState<EventDraft | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const e = await getEvent(id);
      if (!e) {
        Alert.alert("Ошибка", "Событие не найдено");
        router.back();
        return;
      }
      setDraft({
        title: e.title,
        description: e.description,
        category: e.category,
        startsAt: e.startsAt,
        locationName: e.locationName,
        photoUri: e.photoUri ?? "",
        limit: e.limit,
        price: e.price ?? 0,
      });
    })();
  }, [id]);

  const save = async () => {
    if (!user || !id || !draft) return;
    setSaving(true);
    try {
      await upsertEvent(draft, { id, status: "published", organizerEmail: user.email, organizerName: user.name });
      Alert.alert("Сохранено", "Изменения применены");
      router.back();
    } catch (e: any) {
      Alert.alert("Ошибка", e?.message ?? "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) {
    return (
      <View style={styles.center}>
        <Text style={{ fontWeight: "800" }}>Загружаем…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text style={styles.h1}>Редактирование</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Название</Text>
        <TextInput style={styles.input} value={draft.title} onChangeText={(v) => setDraft((s) => ({ ...s!, title: v }))} />

        <Text style={styles.label}>Описание</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={draft.description}
          onChangeText={(v) => setDraft((s) => ({ ...s!, description: v }))}
          multiline
        />

        <Text style={styles.label}>Локация</Text>
        <TextInput style={styles.input} value={draft.locationName} onChangeText={(v) => setDraft((s) => ({ ...s!, locationName: v }))} />

        <Pressable style={[styles.btn, saving && { opacity: 0.6 }]} disabled={saving} onPress={save}>
          <Text style={styles.btnText}>Сохранить</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  h1: { fontSize: 20, fontWeight: "900", textAlign: "center", marginTop: 10, marginBottom: 10 },
  card: { backgroundColor: "white", borderRadius: 18, padding: 14 },
  label: { fontSize: 12, color: "#666", fontWeight: "700", marginTop: 10, marginBottom: 8 },
  input: { backgroundColor: "#f2f4f7", borderRadius: 14, padding: 12, fontWeight: "700" },
  textarea: { minHeight: 90, textAlignVertical: "top" as any },
  btn: { backgroundColor: "#0f8a87", paddingVertical: 12, borderRadius: 16, alignItems: "center", marginTop: 14 },
  btnText: { color: "white", fontWeight: "900" },
});