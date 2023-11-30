import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import * as crypto from 'crypto';

import { RecipeIngredientModule } from '../recipe-ingredient';

import { RecipeController } from './recipe.controller';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [
    TypeOrmModule.forFeature([RecipeEntity]),
    RecipeIngredientModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './public/recipes',
        filename: (_, file, next) => {
          const ext = path.extname(file.originalname);
          let err = null;

          if (!ext || !/^\.(jpg|jpeg|png)$/.test(ext)) {
            err = 400;
          }

          const fileName = `${crypto.randomUUID()}${ext}`;
          next(err, fileName);
        },
      }),
    }),
  ],
})
export class RecipeModule {}
