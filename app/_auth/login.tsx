import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth/auth";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)"); // в приложение
    } catch (e: any) {
      Alert.alert("Ошибка входа", e.message ?? "Не удалось войти");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AKSUU</Text>

      <View style={styles.card}>
        <Text style={styles.h1}>Вход</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Войти</Text>
        </Pressable>

      <Pressable onPress={() => router.push("/_auth/reset-1-email")} style={{ marginTop: 12 }}>
        <Text style={{ color: "#0f8a87", fontWeight: "800", textAlign: "center" }}>
          Забыли пароль?
        </Text>
      </Pressable>

        <Text style={styles.small}>
          Нет аккаунта?{" "}
          <Link href="/_auth/register" style={styles.link}>
            Зарегистрироваться
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "800", textAlign: "center", marginBottom: 16 },
  card: { backgroundColor: "white", borderRadius: 22, padding: 18 },
  h1: { fontSize: 18, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  input: { backgroundColor: "#f2f4f7", borderRadius: 14, padding: 12, marginBottom: 10, fontSize: 14 },
  button: { backgroundColor: "#0f8a87", borderRadius: 16, paddingVertical: 12, alignItems: "center", marginTop: 6 },
  buttonText: { color: "white", fontWeight: "700", fontSize: 15 },
  small: { marginTop: 14, textAlign: "center", color: "#444" },
  link: { color: "#0f8a87", fontWeight: "700" },
});