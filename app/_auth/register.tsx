import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth/auth";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const onRegister = async () => {
    try {
      if (password !== password2) throw new Error("Пароли не совпадают");
      await register(email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Ошибка регистрации", e.message ?? "Не удалось создать аккаунт");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <View style={styles.card}>
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
          placeholder="Пароль (мин. 12 символов)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Повторите пароль"
          secureTextEntry
          value={password2}
          onChangeText={setPassword2}
        />

        <Pressable style={styles.button} onPress={onRegister}>
          <Text style={styles.buttonText}>Создать аккаунт</Text>
        </Pressable>

        <Text style={styles.small}>
          Уже есть аккаунт?{" "}
          <Link href="/_auth/login" style={styles.link}>
            Войти
          </Link>
        </Text>

        <Text style={styles.footer}>
          Регистрируясь, вы принимаете{"\n"}
          <Text style={styles.link}>Условия использования</Text> и{" "}
          <Text style={styles.link}>Политику конфиденциальности</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "900", textAlign: "center", marginBottom: 14 },
  card: { backgroundColor: "white", borderRadius: 22, padding: 18 },
  input: { backgroundColor: "#f2f4f7", borderRadius: 14, padding: 12, marginBottom: 10, fontSize: 14 },
  button: { backgroundColor: "#0f8a87", borderRadius: 16, paddingVertical: 12, alignItems: "center", marginTop: 6 },
  buttonText: { color: "white", fontWeight: "800", fontSize: 15 },
  small: { marginTop: 14, textAlign: "center", color: "#444" },
  link: { color: "#0f8a87", fontWeight: "800" },
  footer: { marginTop: 16, textAlign: "center", color: "#666", lineHeight: 18 },
});