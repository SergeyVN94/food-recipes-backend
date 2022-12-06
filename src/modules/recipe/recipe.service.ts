import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { Recipe } from './types';
import * as recipes from './recipes.json';

interface FetchFilter {
  query?: string;
  slugs?: string[];
}

@Injectable()
export class RecipeService {
  getRecipes(filter?: FetchFilter): { results: Recipe[] } {
    if (_.isEmpty(filter)) return { results: recipes as Recipe[] };

    const { query = '', slugs } = filter;
    const normalizedQuery = (
      _.isString(query) ? query.trim() : ''
    ).toLowerCase();

    const recipesRes = recipes.filter((r) => {
      if (normalizedQuery)
        return (
          r.title.toLowerCase().includes(normalizedQuery) ||
          r.description.toLowerCase().includes(normalizedQuery)
        );

      if (slugs && slugs.length > 0) return slugs.includes(r.slug);

      return false;
    });

    return { results: recipesRes as Recipe[] };
  }
}
