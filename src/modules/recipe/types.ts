// import { RecipeIngredient } from 'src/modules/recipe-ingredient';

export type Recipe = {
  id: number;
  slug: string;
  title: string;
  description: string;
  // images: string[];
  steps: string[]; // json строка '{ order: number, content: string }'
  // ingredients: RecipeIngredient['id'][];
};
