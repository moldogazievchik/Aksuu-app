import * as SecureStore from "expo-secure-store";

export type EventCategory = "sport" | "health" | "culture" | "hobby" | "education";
export type EventStatus = "draft" | "published";

export type EventDraft = {
  title: string;
  description: string;
  category: EventCategory | null;
  startsAt: string; // ISO string
  locationName: string;
  photoUri?: string; // локальная картинка (позже заменим на storage)
  limit: number | null;
  price: number; // 0 = бесплатно
};

export type EventEntity = EventDraft & {
  id: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  organizerEmail: string;
  organizerName: string;
};

const EVENTS_KEY = "aksuu_events_v1";

let cache: EventEntity[] | null = null;

async function load(): Promise<EventEntity[]> {
  if (cache) return cache;
  const raw = await SecureStore.getItemAsync(EVENTS_KEY);
  cache = raw ? (JSON.parse(raw) as EventEntity[]) : [];
  return cache!;
}

async function save(list: EventEntity[]) {
  cache = list;
  await SecureStore.setItemAsync(EVENTS_KEY, JSON.stringify(list));
}

export async function listEvents(): Promise<EventEntity[]> {
  const list = await load();
  return [...list].sort((a, b) => (a.startsAt < b.startsAt ? 1 : -1));
}

export async function getEvent(id: string): Promise<EventEntity | null> {
  const list = await load();
  return list.find((e) => e.id === id) ?? null;
}

export async function upsertEvent(
  payload: EventDraft,
  meta: { status: EventStatus; organizerEmail: string; organizerName: string; id?: string }
): Promise<EventEntity> {
  const list = await load();
  const now = new Date().toISOString();

  if (meta.id) {
    const idx = list.findIndex((x) => x.id === meta.id);
    if (idx === -1) throw new Error("Событие не найдено");

    const updated: EventEntity = {
      ...list[idx],
      ...payload,
      status: meta.status,
      updatedAt: now,
    };

    const next = [...list];
    next[idx] = updated;
    await save(next);
    return updated;
  }

  const created: EventEntity = {
    id: String(Date.now()) + "_" + Math.random().toString(16).slice(2),
    ...payload,
    status: meta.status,
    createdAt: now,
    updatedAt: now,
    organizerEmail: meta.organizerEmail,
    organizerName: meta.organizerName,
  };

  await save([created, ...list]);
  return created;
}