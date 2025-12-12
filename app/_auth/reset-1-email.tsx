import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth/auth"; // поправь путь если у тебя другой


export default function ResetStep1Email() {
  const { requestReset } = useAuth();
  const [email, setEmail] = useState("");

const onNext = async () => {
  try {
    await requestReset(email);

    Alert.alert(
      "Код отправлен",
      "Если email зарегистрирован, вы получите код для восстановления."
    );

    router.push("/_auth/reset-2-code");
  } catch (e: any) {
    Alert.alert("Ошибка", e.message ?? "Не удалось отправить код");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Восстановление пароля</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Введите email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Pressable style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Получить код</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", justifyContent: "center", padding: 20 },
  h1: { fontSize: 22, fontWeight: "900", textAlign: "center", marginBottom: 12 },
  card: { backgroundColor: "white", borderRadius: 22, padding: 18 },
  label: { fontSize: 13, color: "#555", marginBottom: 8 },
  input: { backgroundColor: "#f2f4f7", borderRadius: 14, padding: 12, marginBottom: 12, fontSize: 14 },
  button: { backgroundColor: "#0f8a87", borderRadius: 16, paddingVertical: 12, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "800" },
  demo: { marginTop: 12, textAlign: "center", color: "#666" },
  demoBold: { fontWeight: "900", color: "#111" },
});