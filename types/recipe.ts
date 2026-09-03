export type Recipe = {
  id: string | number;
  title: string;
  description?: string;
  imageUrl: string;
  prepTime?: number;
  difficulty?: "Fácil" | "Médio" | "Difícil" | string;
  category?: string;
  rating?: number;
  favorite?: boolean;
};

export type GuideFilter =
  | "all"
  | "favorites"
  | "weekly"
  | "quick"
  | "sweet"
  | "savory";
