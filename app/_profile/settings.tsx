import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useAuth } from "../../src/auth/auth";

type SettingsState = {
  publicProfile: boolean;
  publicEvents: boolean;
  notifPush: boolean;
  notifEmail: boolean;
};

const SETTINGS_KEY = "aksuu_profile_settings_v1";

const defaultSettings: SettingsState = {
  publicProfile: true,
  publicEvents: true,
  notifPush: true,
  notifEmail: false,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function RowSwitch({
  label,
  value,
  onValueChange,
  hint,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function RowAction({
  label,
  onPress,
  danger,
  hint,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
  hint?: string;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={[styles.rowLabel, danger && { color: "#b00020" }]}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      <Text style={[styles.chevron, danger && { color: "#b00020" }]}>›</Text>
    </Pressable>
  );
}

export default function Settings() {
  const { logout } = useAuth();
  const [s, setS] = useState<SettingsState>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const raw = await SecureStore.getItemAsync(SETTINGS_KEY);
      if (raw) {
        try {
          setS({ ...defaultSettings, ...JSON.parse(raw) });
        } catch {
          setS(defaultSettings);
        }
      }
      setLoading(false);
    })();
  }, []);

  const persist = async (next: SettingsState) => {
    setS(next);
    await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(next));
  };

  const toggle = (key: keyof SettingsState) => async (v: boolean) => {
    const next = { ...s, [key]: v };
    await persist(next);
  };

  const onChangePassword = () => {
    Alert.alert(
      "Смена пароля",
      "Для MVP используем тот же flow восстановления пароля.",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Продолжить", onPress: () => router.push("/_auth/reset-1-email" as const) },
      ]
    );
  };

  const onDeleteAccount = () => {
    Alert.alert(
      "Удаление аккаунта",
      "DEMO: удалим локальные данные и выйдем. В проде это будет запрос к серверу.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            // Удаляем всё demo-локально
            await SecureStore.deleteItemAsync("aksuu_demo_user");
            await SecureStore.deleteItemAsync("aksuu_demo_email");
            await SecureStore.deleteItemAsync("aksuu_demo_pass");
            await SecureStore.deleteItemAsync("aksuu_reset_code");
            await SecureStore.deleteItemAsync("aksuu_reset_email");
            await SecureStore.deleteItemAsync("aksuu_reset_expires");
            await SecureStore.deleteItemAsync(SETTINGS_KEY);

            await logout();
            router.replace("/_auth/login" as const);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>Настройки</Text>
        <Text style={styles.sub}>Загрузка…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Настройки профиля</Text>

      <Section title="Конфиденциальность">
        <RowSwitch
          label="Показывать профиль другим"
          hint="Если выключить — профиль будет доступен только вам"
          value={s.publicProfile}
          onValueChange={toggle("publicProfile")}
        />
        <View style={styles.divider} />
        <RowSwitch
          label="Показывать мои события"
          hint="Если выключить — другие не увидят мероприятия, где вы участвуете"
          value={s.publicEvents}
          onValueChange={toggle("publicEvents")}
        />
      </Section>

      <Section title="Уведомления">
        <RowSwitch
          label="Push-уведомления"
          hint="Новые события и напоминания"
          value={s.notifPush}
          onValueChange={toggle("notifPush")}
        />
        <View style={styles.divider} />
        <RowSwitch
          label="Email-уведомления"
          hint="Дублировать важные уведомления на почту"
          value={s.notifEmail}
          onValueChange={toggle("notifEmail")}
        />
      </Section>

      <Section title="Аккаунт">
        <RowAction label="Сменить пароль" hint="Минимум 12 символов, сложный пароль" onPress={onChangePassword} />
        <View style={styles.divider} />
        <RowAction
          label="Привязка соцсетей (скоро)"
          hint="Telegram / Google / Apple"
          onPress={() => Alert.alert("Скоро", "Это будет на следующем этапе")}
        />
        <View style={styles.divider} />
        <RowAction
          label="Удалить аккаунт"
          hint="DEMO: удалит локальные данные"
          danger
          onPress={onDeleteAccount}
        />
      </Section>

      <Section title="Про приложение">
        <RowAction
          label="Версия"
          hint="AKSUU MVP v0.1"
          onPress={() => Alert.alert("Версия", "AKSUU MVP v0.1")}
        />
        <View style={styles.divider} />
        <RowAction
          label="Политика конфиденциальности"
          onPress={() => Alert.alert("Политика", "Пока заглушка. Позже откроем страницу/ссылку.")}
        />
        <View style={styles.divider} />
        <RowAction
          label="Пользовательское соглашение"
          onPress={() => Alert.alert("Соглашение", "Пока заглушка. Позже откроем страницу/ссылку.")}
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f5f9", padding: 16, paddingTop: 24 },
  h1: { fontSize: 20, fontWeight: "900", textAlign: "center", marginBottom: 10 },
  sub: { textAlign: "center", color: "#666", fontWeight: "700" },

  section: { marginTop: 12 },
  sectionTitle: { fontSize: 12, color: "#666", fontWeight: "900", marginBottom: 8, marginLeft: 2 },
  card: { backgroundColor: "white", borderRadius: 18, padding: 12 },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  pressed: { opacity: 0.6 },
  rowLabel: { fontSize: 15, fontWeight: "800", color: "#111" },
  rowHint: { marginTop: 4, fontSize: 12, color: "#777", fontWeight: "600" },
  chevron: { fontSize: 22, color: "#888", paddingHorizontal: 6, marginTop: -2 },

  divider: { height: 1, backgroundColor: "#eef0f5" },
});