import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Support() {
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");

  const onSend = () => {
    if (!topic.trim() || !text.trim()) {
      Alert.alert("Ошибка", "Заполните тему и текст");
      return;
    }
    Alert.alert("Отправлено", "Мы получили сообщение. Ответим позже.");
    setTopic("");
    setText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Поддержка</Text>

      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Тема" value={topic} onChangeText={setTopic} />
        <TextInput
          style={[styles.input, { height: 120, textAlignVertical: "top" }]}
          placeholder="Сообщение"
          value={text}
          onChangeText={setText}
          multiline
        />

        <Pressable style={styles.btn} onPress={onSend}>
          <Text style={styles.btnText}>Отправить</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", padding: 16, paddingTop: 24 },
  h1: { fontSize: 20, fontWeight: "900", textAlign: "center", marginBottom: 12 },
  card: { backgroundColor: "white", borderRadius: 18, padding: 16 },
  input: { backgroundColor: "#f2f4f7", borderRadius: 14, padding: 12, marginBottom: 10 },
  btn: { backgroundColor: "#0f8a87", paddingVertical: 12, borderRadius: 16, alignItems: "center" },
  btnText: { color: "white", fontWeight: "800" },
});