export type Category = "sport" | "hobby" | "health" | "culture" | "education";

export type EventStatus = "OPEN" | "FEW_LEFT" | "SOLD_OUT";

export type EventItem = {
  id: string;
  title: string;
  category: Category;
  imageUrl: string;

  startsAt: number; // timestamp
  locationName: string;
  distanceKm: number;

  organizerName: string;
  organizerRating: number;

  capacity: number;
  joined: number;

  price: number; // 0 = free
  waitlistEnabled?: boolean;
};