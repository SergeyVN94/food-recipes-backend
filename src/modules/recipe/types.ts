import { RecipeIngredient } from 'src/modules/recipe-ingredient';

export type RecipeStep = {
  description: string;
  images?: string[];
  ingredients?: RecipeIngredient['id'][];
  step: number;
};

export type Recipe = {
  id: number;
  slug: string;
  title: string;
  description: string;
  images?: string[];
  steps: RecipeStep[];
  ingredients: RecipeIngredient['id'][];
};
