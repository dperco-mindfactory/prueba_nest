// test/user.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Es crucial aplicar el ValidationPipe también en el entorno de prueba
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Obtenemos una instancia de Prisma para limpiar la DB
    prisma = app.get<PrismaService>(PrismaService);
  });

  // Limpiamos la base de datos antes de cada prueba
  beforeEach(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('debería crear un usuario y devolver 201', () => {
      const createUserDto = { email: 'e2e@test.com', name: 'E2E User' };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual({
            id: expect.any(Number),
            email: createUserDto.email,
            name: createUserDto.name,
          });
        });
    });

    it('debería fallar con 400 si el email es inválido', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'invalid-email', name: 'Bad User' })
        .expect(400);
    });
  });

  describe('/users (GET)', () => {
    it('debería devolver un array de usuarios', async () => {
      // Creamos un usuario primero para que no esté vacío
      await prisma.user.create({
        data: { email: 'get@test.com', name: 'Get User' },
      });

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body[0].email).toBe('get@test.com');
        });
    });
  });
});