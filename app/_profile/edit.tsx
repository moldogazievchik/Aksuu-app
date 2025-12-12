import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth/auth";

const phoneRe = /^[+0-9 ()-]{7,20}$/;

export default function EditProfile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [language, setLanguage] = useState(user?.language ?? "ru");
  const [photoUri, setPhotoUri] = useState(user?.photoUri ?? "");

  const avatar = useMemo(() => {
    if (photoUri) return { uri: photoUri };
    return { uri: "https://i.pravatar.cc/200?img=12" };
  }, [photoUri]);

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Доступ запрещён", "Разрешите доступ к фото, чтобы выбрать аватар");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!res.canceled) setPhotoUri(res.assets[0].uri);
  };

  const onSave = async () => {
    try {
      const n = name.trim();
      if (n.length < 2) throw new Error("Имя должно быть минимум 2 символа");

      const p = phone.trim();
      if (p && !phoneRe.test(p)) throw new Error("Некорректный телефон");

      await updateProfile({ name: n, phone: p, language, photoUri });
      router.back();
    } catch (e: any) {
      Alert.alert("Ошибка", e.message ?? "Не удалось сохранить");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Редактировать профиль</Text>

      <View style={styles.card}>
        <View style={{ alignItems: "center", marginBottom: 14 }}>
          <Image source={avatar} style={styles.avatar} />
          <Pressable onPress={pickPhoto} style={styles.linkBtn}>
            <Text style={styles.link}>Изменить фото</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Имя</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ваше имя" />

        <Text style={styles.label}>Телефон</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+996..."
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Язык интерфейса</Text>
        <View style={styles.row}>
          {(["ru", "kg", "en"] as const).map((l) => (
            <Pressable
              key={l}
              onPress={() => setLanguage(l)}
              style={[styles.chip, language === l && styles.chipActive]}
            >
              <Text style={[styles.chipText, language === l && styles.chipTextActive]}>
                {l.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.btn} onPress={onSave}>
          <Text style={styles.btnText}>Сохранить</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", padding: 16, paddingTop: 24 },
  h1: { fontSize: 20, fontWeight: "900", textAlign: "center", marginBottom: 12 },
  card: { backgroundColor: "white", borderRadius: 18, padding: 16 },
  avatar: { width: 96, height: 96, borderRadius: 26, backgroundColor: "#e6e8ee" },
  linkBtn: { marginTop: 8 },
  link: { color: "#0f8a87", fontWeight: "900" },
  label: { fontSize: 12, color: "#777", marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: "#f2f4f7", borderRadius: 14, padding: 12 },
  row: { flexDirection: "row", gap: 8, marginTop: 6, marginBottom: 14 },
  chip: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: "#f2f4f7" },
  chipActive: { backgroundColor: "#0f8a87" },
  chipText: { fontWeight: "900", color: "#111" },
  chipTextActive: { color: "white" },
  btn: { backgroundColor: "#0f8a87", paddingVertical: 12, borderRadius: 16, alignItems: "center", marginTop: 14 },
  btnText: { color: "white", fontWeight: "800" },
});