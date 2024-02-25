import { RecipeEntity } from './recipe.entity';

export type RecipeResponse = Omit<RecipeEntity, 'id' | 'steps'> & {
  steps: string[];
};
