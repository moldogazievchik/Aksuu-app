import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth/auth";

export default function ResetStep3NewPassword() {
  const { setNewPassword } = useAuth();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  const onFinish = async () => {
    try {
      if (p1 !== p2) throw new Error("Пароли не совпадают");
      await setNewPassword(p1);
      Alert.alert("Готово", "Пароль обновлён");
      router.replace("/_auth/login");
    } catch (e: any) {
      Alert.alert("Ошибка", e.message ?? "Не удалось обновить пароль");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Новый пароль</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Новый пароль"
          secureTextEntry
          value={p1}
          onChangeText={setP1}
        />
        <TextInput
          style={styles.input}
          placeholder="Повторите пароль"
          secureTextEntry
          value={p2}
          onChangeText={setP2}
        />

        <Text style={styles.hint}>
          Минимум 12 символов, 1 заглавная, 1 строчная, 1 цифра и 1 спецсимвол.
        </Text>

        <Pressable style={styles.button} onPress={onFinish}>
          <Text style={styles.buttonText}>Сохранить пароль</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", justifyContent: "center", padding: 20 },
  h1: { fontSize: 22, fontWeight: "900", textAlign: "center", marginBottom: 12 },
  card: { backgroundColor: "white", borderRadius: 22, padding: 18 },
  input: { backgroundColor: "#f2f4f7", borderRadius: 14, padding: 12, marginBottom: 10, fontSize: 14 },
  hint: { fontSize: 12, color: "#666", marginBottom: 12, lineHeight: 16 },
  button: { backgroundColor: "#0f8a87", borderRadius: 16, paddingVertical: 12, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "800" },
});