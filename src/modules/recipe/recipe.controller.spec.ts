import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoremIpsum } from 'lorem-ipsum';
import * as request from 'supertest';

import { RecipeController } from './recipe.controller';
import { RecipeEntity } from './entity/recipe.entity';
import { RecipeDto } from './dto/recipe-create.dto';
import { RecipeService } from './recipe.service';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

describe('RecipeController', () => {
  let controller: RecipeController;
  let service: RecipeService;
  let repository: Repository<RecipeEntity>;
  let app: INestApplication;

  const recipesDto: RecipeDto[] = Array(3)
    .fill('')
    .map((_) => ({
      description: lorem.generateParagraphs(2),
      steps: Array(3)
        .fill('')
        .map((i) => lorem.generateParagraphs(1)),
      tags: Array(3)
        .fill('')
        .map((i) => Math.round(Math.random() * 200).toString()),
      title: lorem.generateWords(Math.round(Math.random() * 3 + 1)),
    }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        RecipeService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useClass: RecipeEntity,
        },
      ],
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'main_db.sqlite3',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
      ],
    }).compile();

    controller = module.get<RecipeController>(RecipeController);
    service = module.get<RecipeService>(RecipeService);
    repository = module.get(getRepositoryToken(RecipeEntity));

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Create recipes', () => {
    it('/post recipes', () => {
      const recipeDto = recipesDto[0];

      return request(app.getHttpServer()).post('/api/v1/recipes').send(recipeDto).expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
