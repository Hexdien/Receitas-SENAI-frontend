export type Recipe = {
  id: string | number;
  title: string;
  description?: string;
  imageUrl: string | null;
  prepTime?: number;
  difficulty?: "Fácil" | "Médio" | "Difícil" | string;
  category?: string | null;
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

/** O que o formulário de receita envia. A imagem é opcional na edição. */
export type RecipeInput = {
  nome: string;
  desc: string;
  tempo: number;
  categoria?: string;
  imagem?: File | null;
};
