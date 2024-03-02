export type RecipeIngredient = {
  id: string;
  slug: string;
  name: string;
  description: string;
  amountTypes: AmountType[];
  createdAt: string;
  updateAt: string;
  image?: string;
};

export type AmountType = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updateAt: string;
};

export type QueryFilter = {
  query?: string;
  limit?: number;
  page?: number;
};
