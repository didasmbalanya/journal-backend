import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/user/user.entity';
import { JournalEntry } from '../../src/journal/journal.entity';

describe('Journal Endpoints (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();

    // Create test user and get token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@journal2.com', password: 'TestPass123!' });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@journal2.com', password: 'TestPass123!' });

    authToken = loginRes.body.access_token;
  });

  beforeEach(async () => {
    // Clear journals before each test
    await dataSource.createQueryBuilder().delete().from(JournalEntry).execute();
  });

  afterAll(async () => {
    await dataSource.createQueryBuilder().delete().from(User).execute();
    await app.close();
  });

  describe('Journal CRUD Operations', () => {
    it('should create a journal entry (POST /journals)', async () => {
      const res = await request(app.getHttpServer())
        .post('/journals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'My First Entry',
          content: 'This is a test content',
          category: 'personal',
        })
        .expect(201);

      expect(res.body).toMatchObject({
        title: 'My First Entry',
        content: 'This is a test content',
        category: 'personal',
      });
    });

    it('should get all journals (GET /journals)', async () => {
      // First create an entry
      await request(app.getHttpServer())
        .post('/journals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Entry',
          content: 'Test content',
        });

      const res = await request(app.getHttpServer())
        .get('/journals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0].title).toBe('Test Entry');
    });

    it('should get a single journal (GET /journals/:id)', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/journals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Single Entry',
          content: 'Content for a single entry',
        });

      const res = await request(app.getHttpServer())
        .get(`/journals/${createRes.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.title).toBe('Single Entry');
    });

    it('should update a journal (PATCH /journals/:id)', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/journals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          content: 'Original Content',
        });

      const res = await request(app.getHttpServer())
        .patch(`/journals/${createRes.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
        })
        .expect(200);

      expect(res.body.title).toBe('Updated Title');
      expect(res.body.content).toBe('Original Content');
    });

    it('should delete a journal (DELETE /journals/:id)', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/journals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'To be deleted',
          content: 'Content to be deleted',
        });

      await request(app.getHttpServer())
        .delete(`/journals/${createRes.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/journals/${createRes.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Journal Security', () => {
    let otherUserToken: string;

    beforeAll(async () => {
      // Create second test user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'other@user.com', password: 'OtherPass123!' });

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'other@user.com', password: 'OtherPass123!' });

      otherUserToken = loginRes.body.access_token;
    });

    it('should prevent accessing other users journals', async () => {
      // Create journal as main user
      const createRes = await request(app.getHttpServer())
        .post('/journals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Private Entry',
          content: 'Secret content',
        });

      // Try accessing as other user
      await request(app.getHttpServer())
        .get(`/journals/${createRes.body.id}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(404);
    });

    it('should reject unauthenticated requests', async () => {
      await request(app.getHttpServer()).get('/journals').expect(401);
    });
  });

  describe('Journal Validation', () => {
    it('should reject empty titles', async () => {
      await request(app.getHttpServer())
        .post('/journals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '',
          content: 'Valid content',
        })
        .expect(400);
    });

    it('should reject short content', async () => {
      await request(app.getHttpServer())
        .post('/journals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Valid title',
          content: 'Short',
        })
        .expect(400);
    });
  });
});
