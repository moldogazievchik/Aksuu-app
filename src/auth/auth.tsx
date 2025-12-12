import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  email: string;
  name: string;
  phone?: string;
  photoUri?: string;     // локальный uri (работает без storage)
  rating?: number;       // demo
  language: "ru" | "kg" | "en";
  isAdmin: boolean;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  requestReset: (email: string) => Promise<void>;
  verifyResetCode: (code: string) => Promise<void>;
  setNewPassword: (newPassword: string) => Promise<void>;

  updateProfile: (patch: Partial<Pick<User, "name" | "phone" | "photoUri" | "language">>) => Promise<void>;
};

const AUTH_EMAIL_KEY = "aksuu_demo_email";
const AUTH_PASS_KEY = "aksuu_demo_pass";
const AUTH_USER_KEY = "aksuu_demo_user";

const RESET_CODE_KEY = "aksuu_reset_code";
const RESET_EMAIL_KEY = "aksuu_reset_email";
const RESET_EXPIRES_KEY = "aksuu_reset_expires";

const AuthContext = createContext<AuthContextValue | null>(null);

function validatePassword(password: string) {
  const errors: string[] = [];

  if (password.length < 12) errors.push("минимум 12 символов");
  if (!/[a-z]/.test(password)) errors.push("хотя бы 1 строчную букву (a-z)");
  if (!/[A-Z]/.test(password)) errors.push("хотя бы 1 заглавную букву (A-Z)");
  if (!/[0-9]/.test(password)) errors.push("хотя бы 1 цифру (0-9)");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("хотя бы 1 спецсимвол (!@#...)");

  if (errors.length) {
    throw new Error("Слабый пароль: " + errors.join(", "));
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedUser = await SecureStore.getItemAsync(AUTH_USER_KEY);
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setLoading(false);
    })();
  }, []);

  const register = async (email: string, password: string) => {
    // MVP-валидация
    if (!email.includes("@")) throw new Error("Введите корректный email");
    validatePassword(password);

    await SecureStore.setItemAsync(AUTH_EMAIL_KEY, email.trim().toLowerCase());
    await SecureStore.setItemAsync(AUTH_PASS_KEY, password);

    const normalizedEmail = email.trim().toLowerCase();

    const newUser: User = {
      email: normalizedEmail,
      name: "Пользователь",
      phone: "",
      photoUri: "",
      rating: 4.8,
      language: "ru",
      isAdmin: normalizedEmail.endsWith("@aksuu.dev"),
  };

  await SecureStore.setItemAsync(AUTH_EMAIL_KEY, normalizedEmail);
  await SecureStore.setItemAsync(AUTH_PASS_KEY, password);
  await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(newUser));
setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    const savedEmail = await SecureStore.getItemAsync(AUTH_EMAIL_KEY);
    const savedPass = await SecureStore.getItemAsync(AUTH_PASS_KEY);

    if (!savedEmail || !savedPass) {
      throw new Error("Сначала зарегистрируйтесь");
    }

    if (savedEmail !== email.trim().toLowerCase() || savedPass !== password) {
      throw new Error("Неверный email или пароль");
    }

  const storedUser = await SecureStore.getItemAsync(AUTH_USER_KEY);

  const newUser: User = storedUser
    ? JSON.parse(storedUser)
    : { email: savedEmail, name: "Пользователь", language: "ru", isAdmin: false 
  };

  await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(newUser));
  setUser(newUser);
  };

  const updateProfile = async (
    patch: Partial<Pick<User, "name" | "phone" | "photoUri" | "language">>
  ) => {
    if (!user) throw new Error("Нет пользователя");
    const updated: User = { ...user, ...patch };
    await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(AUTH_USER_KEY);
    setUser(null);
  };

  const requestReset = async (email: string) => {
  const savedEmail = await SecureStore.getItemAsync(AUTH_EMAIL_KEY);
  if (!savedEmail) throw new Error("Сначала зарегистрируйтесь");

  const normalized = email.trim().toLowerCase();
  if (normalized !== savedEmail) throw new Error("Этот email не зарегистрирован");

  // генерим 6-значный код
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 минут

  await SecureStore.setItemAsync(RESET_EMAIL_KEY, normalized);
  await SecureStore.setItemAsync(RESET_CODE_KEY, code);
  await SecureStore.setItemAsync(RESET_EXPIRES_KEY, String(expiresAt));

  console.log("[RESET CODE] (dev only):", code);
};

const verifyResetCode = async (code: string) => {
  const savedCode = await SecureStore.getItemAsync(RESET_CODE_KEY);
  const expires = await SecureStore.getItemAsync(RESET_EXPIRES_KEY);

  if (!savedCode || !expires) throw new Error("Сначала запросите код");
  if (Date.now() > Number(expires)) throw new Error("Код истёк. Запросите новый");
  if (code.trim() !== savedCode) throw new Error("Неверный код");
};

const setNewPassword = async (newPassword: string) => {
  // твоя сильная валидация:
  validatePassword(newPassword);

  const resetEmail = await SecureStore.getItemAsync(RESET_EMAIL_KEY);
  const savedEmail = await SecureStore.getItemAsync(AUTH_EMAIL_KEY);

  if (!resetEmail || !savedEmail) throw new Error("Сначала запросите восстановление");

  if (resetEmail !== savedEmail) throw new Error("Email не совпадает");

  await SecureStore.setItemAsync(AUTH_PASS_KEY, newPassword);

  // очистим reset-данные
  await SecureStore.deleteItemAsync(RESET_EMAIL_KEY);
  await SecureStore.deleteItemAsync(RESET_CODE_KEY);
  await SecureStore.deleteItemAsync(RESET_EXPIRES_KEY);
};

  const value = useMemo(
    () => ({ user, loading, register, login, logout, requestReset, verifyResetCode, setNewPassword, updateProfile }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}