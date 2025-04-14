import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Summary (e2e)', () => {
  let app: INestApplication<App>;

  let dataSource: DataSource;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);

    // Register a test user
    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'summarytest@example.com',
      password: 'Password123',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'summarytest@example.com',
        password: 'Password123',
      });

    token = loginRes.body.access_token;

    // Create test journal entries
    const entries = [
      {
        title: 'My First Entry',
        content: 'First test entry',
        category: 'Work',
        createdAt: '2025-04-13T09:00:00.000Z',
      },
      {
        title: 'My Second Entry',
        content: 'Second entry of the day',
        category: 'Work',
        createdAt: '2025-04-13T14:00:00.000Z',
      },
      {
        title: 'My Three Entry',
        content: 'Third entry early morning',
        category: 'Personal',
        createdAt: '2025-04-14T05:00:00.000Z',
      },
    ];

    for (const entry of entries) {
      await request(app.getHttpServer())
        .post('/journals')
        .set('Authorization', `Bearer ${token}`)
        .send(entry);
    }
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });

  const baseURL = '/summary';
  const query = '?start=2025-04-01&end=2025-04-20';

  it('GET /summary/entry-frequency', async () => {
    const res = await request(app.getHttpServer())
      .get(`${baseURL}/entry-frequency${query}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          count: expect.any(String),
        }),
      ]),
    );
  });

  it('GET /summary/category-distribution', async () => {
    const res = await request(app.getHttpServer())
      .get(`${baseURL}/category-distribution${query}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'Work',
          count: expect.any(String),
        }),
      ]),
    );
  });

  it('GET /summary/word-count-trends', async () => {
    const res = await request(app.getHttpServer())
      .get(`${baseURL}/word-count-trends${query}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /summary/average-entry-length', async () => {
    const res = await request(app.getHttpServer())
      .get(`${baseURL}/average-entry-length${query}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'Work',
          averageLength: expect.any(String),
        }),
      ]),
    );
  });

  it('GET /summary/time-of-day-analysis', async () => {
    const res = await request(app.getHttpServer())
      .get(`${baseURL}/time-of-day-analysis${query}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('hour');
    expect(res.body[0]).toHaveProperty('count');
  });
});
