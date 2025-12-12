import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth/auth";

export default function ResetStep2Code() {
  const { verifyResetCode } = useAuth();
  const [code, setCode] = useState("");

  const onNext = async () => {
    try {
      await verifyResetCode(code);
      router.push("/_auth/reset-3-new-password");
    } catch (e: any) {
      Alert.alert("Ошибка", e.message ?? "Неверный код");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Введите код</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="6-значный код"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
          maxLength={6}
        />

        <Pressable style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Далее</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={styles.link}>Назад</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", justifyContent: "center", padding: 20 },
  h1: { fontSize: 22, fontWeight: "900", textAlign: "center", marginBottom: 12 },
  card: { backgroundColor: "white", borderRadius: 22, padding: 18 },
  input: { backgroundColor: "#f2f4f7", borderRadius: 14, padding: 12, marginBottom: 12, fontSize: 14, textAlign: "center", letterSpacing: 3 },
  button: { backgroundColor: "#0f8a87", borderRadius: 16, paddingVertical: 12, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "800" },
  link: { color: "#0f8a87", fontWeight: "800", textAlign: "center" },
});