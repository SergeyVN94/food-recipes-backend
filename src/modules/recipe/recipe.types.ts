import { RecipeEntity } from './entity/recipe.entity';

export type RecipeResponse = Omit<RecipeEntity, 'steps'> & {
  steps: string[];
};
