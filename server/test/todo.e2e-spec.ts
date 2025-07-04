import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TodoController (e2e)', () => {
    let app: INestApplication;
    let server: any;
    let accessToken: string;
    let todoListId: string;
    let todoId: string;

    // Generate a unique user for each test run
    const user = {
        firstName: 'Todo',
        lastName:  'Tester',
        email:     `todo.user+${Date.now()}@example.com`,
        password:  'SecurePass123!',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        app.use(require('cookie-parser')());
        await app.init();
        server = app.getHttpServer();

        // Register user
        await request(server)
            .post('/auth/register')
            .send(user)
            .expect(201);

        // Login user and store access token
        const loginRes = await request(server)
            .post('/auth/login')
            .send({ email: user.email, password: user.password })
            .expect(200);

        accessToken = loginRes.body.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /todo/list → create a new todo list', async () => {
        const res = await request(server)
            .post('/todo/list')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Shopping' })
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Shopping');
        todoListId = res.body.id;
    });

    it('GET /todo/list → get all todo lists', async () => {
        const res = await request(server)
            .get('/todo/list')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: todoListId, title: 'Shopping' }),
            ]),
        );
    });

    it('GET /todo/list/:id → get todo list by id', async () => {
        const res = await request(server)
            .get(`/todo/list/${todoListId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body.id).toBe(todoListId);
        expect(res.body.title).toBe('Shopping');
    });

    it('POST /todo → create a todo task', async () => {
        const now = new Date().toISOString();
        const res = await request(server)
            .post('/todo')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shortDescription: 'Buy milk',
                longDescription:  '2 liters of whole milk',
                dueDate:          now,
                todoListId,
            })
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.shortDescription).toBe('Buy milk');
        expect(res.body.completed).toBe(false);
        todoId = res.body.id;
    });

    it('GET /todo/list/:listId/todos → get tasks in list', async () => {
        const res = await request(server)
            .get(`/todo/list/${todoListId}/todos`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: todoId, shortDescription: 'Buy milk' }),
            ]),
        );
    });

    it('PATCH /todo/:id → mark task as completed', async () => {
        const res = await request(server)
            .patch(`/todo/${todoId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body.completed).toBe(true);
    });

    it('DELETE /todo/:id → delete a task', async () => {
        await request(server)
            .delete(`/todo/${todoId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });

    it('DELETE /todo/list/:id → delete a todo list', async () => {
        await request(server)
            .delete(`/todo/list/${todoListId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });
});
