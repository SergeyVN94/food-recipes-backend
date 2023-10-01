export type RecipeIngredient = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image?: string;
};

export type AmountType = {
  id: number;
  name: string;
};

export type QueryFilter = {
  query?: string;
  limit?: number;
  page?: number;
};
