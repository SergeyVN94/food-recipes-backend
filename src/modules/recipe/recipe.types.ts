import { RecipeEntity } from './entity/recipe.entity';

export type RecipeResponse = Omit<RecipeEntity, 'id' | 'steps'> & {
  steps: string[];
};
