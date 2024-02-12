import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { RecipeModule } from 'src/modules/recipe';
import { RecipeIngredientModule } from 'src/modules/recipe-ingredient';
// import { FavoritesModule } from 'src/modules/favorites';
import { AuthModule } from 'src/modules/auth';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    RecipeModule,
    RecipeIngredientModule,
    // FavoritesModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'main_db.sqlite3',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      serveStaticOptions: {
        index: false,
      },
      serveRoot: '/public',
      rootPath: join(__dirname, '../../..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
