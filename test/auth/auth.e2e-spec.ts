// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../../src/app.module';
import { User } from '../../src/user/user.entity';

describe('Auth Flow (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await dataSource.createQueryBuilder().delete().from(User).execute();
    await app.close();
  });

  describe('User Registration', () => {
    const TEST_EMAIL = 'test@example.com';
    const TEST_PASSWORD = 'SecurePass123!';

    it('should register a new user (POST /auth/register)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(typeof res.body.access_token).toBe('string');
        });
    });

    it('should reject duplicate registration (409)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: TEST_EMAIL, // Same email as above
          password: TEST_PASSWORD,
        })
        .expect(409);
    });
  });

  describe('User Login', () => {
    const TEST_EMAIL = 'test@example.com';
    const TEST_PASSWORD = 'SecurePass123!';

    beforeAll(async () => {
      // Ensure test user exists
      await request(app.getHttpServer()).post('/auth/register').send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
    });

    it('should login with valid credentials (POST /auth/login)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('should reject unregistered email (401)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: TEST_PASSWORD,
        })
        .expect(401);
    });
  });

  // test/auth.e2e-spec.ts
  describe('Validation Tests', () => {
    it('should reject empty email (400)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: '',
          password: 'ValidPass123!',
        })
        .expect(400);
    });

    it('should reject invalid email format (400)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'not-an-email',
          password: 'ValidPass123!',
        })
        .expect(400);
    });

    it('should reject weak password (400)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'weak',
        })
        .expect(400);
    });

    it('should reject missing password (400)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
        })
        .expect(400);
    });
  });
});
