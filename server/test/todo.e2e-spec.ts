import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '@/app.module';

describe('TodoController (e2e)', () => {
    let app: INestApplication;
    let server: any;
    let accessToken: string;
    let todoListId: string;
    let todoId: string;

    // Generate a unique user for each test run
    const user = {
        firstName: 'Todo',
        lastName: 'Tester',
        email: `todo.user+${Date.now()}@example.com`,
        password: 'SecurePass123!',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({whitelist: true}));
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
            .send({email: user.email, password: user.password})
            .expect(200);

        accessToken = loginRes.body.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    /*
    *  List Section
    */

    it('POST /todo/list → create a new todo list', async () => {
        const res = await request(server)
            .post('/todo/list')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({title: 'Shopping'})
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Shopping');
        todoListId = res.body.id;
    });

    it('POST /todo/list → 409 if duplicate list title', async () => {
        await request(server)
            .post('/todo/list')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({title: 'Shopping'})
            .expect(409);
    });

    it('POST /todo/list → 400 if title too short', async () => {
        await request(server)
            .post('/todo/list')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({title: 'Sh'})
            .expect(400);
    });

    it('POST /todo/list → 400 if title too long', async () => {
        await request(server)
            .post('/todo/list')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({title: 'test'.repeat(33)})
            .expect(400);
    });

    it('POST /todo/list → 409 if duplicate list title', async () => {
        await request(server)
            .post('/todo/list')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Shopping' }) // уже существует
            .expect(409);
    });

    it('GET /todo/list → get all todo lists', async () => {
        const res = await request(server)
            .get('/todo/list')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({id: todoListId, title: 'Shopping'}),
            ]),
        );
    });

    it('GET /todo/list → 401 if no token provided', async () => {
        await request(server)
            .get('/todo/list')
            .expect(401);
    });

    it('GET /todo/list → 401 if invalid token', async () => {
        await request(server)
            .get('/todo/list')
            .set('Authorization', `Bearer invalidtoken$$`)
            .expect(401);
    });

    /**
     *  Todos section
     */


    it('GET /todo/list/:id → get todo list by id', async () => {
        const res = await request(server)
            .get(`/todo/list/${todoListId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body.id).toBe(todoListId);
        expect(res.body.title).toBe('Shopping');
    });


    it('GET /todo/list/:id → 404 if id not found', async () => {
        const res = await request(server)
            .get(`/todo/list/${todoListId}invalid`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);

        expect(res.body.message).toContain('Todo list not found');
    });


    it('POST /todo/:listId/todo → create a todo task', async () => {
        const due = new Date(Date.now() + 100000).toISOString();
        const res = await request(server)
            .post(`/todo/${todoListId}/todo`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shortDescription: 'Buy milk',
                longDescription: '2 liters of whole milk',
                dueDate: due,
                todoListId,
            })
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.shortDescription).toBe('Buy milk');
        expect(res.body.completed).toBe(false);
        todoId = res.body.id;
    });

    it('POST /todo/:listId/todo → 400 if shortDescription missing', async () => {
        const due = new Date(Date.now() + 60_000).toISOString();
        const res = await request(server)
            .post(`/todo/${todoListId}/todo`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                dueDate: due,
                todoListId,
            })
            .expect(400);

        expect(res.body.message).toContain('shortDescription must be shorter than or equal to 255 characters');
    });

    it('POST /todo/:listId/todo → 400 if shortDescription too short', async () => {
        const due = new Date(Date.now() + 60_000).toISOString();
        const res = await request(server)
            .post(`/todo/${todoListId}/todo`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shortDescription: 'a',
                dueDate: due,
                todoListId,
            })
            .expect(400);

        expect(res.body.message).toContain('shortDescription must be longer than or equal to 3 characters');
    });



    it('POST /todo/:listId/todo → 400 if shortDescription too long', async () => {
        const due = new Date(Date.now() + 60_000).toISOString();
        const res = await request(server)
            .post(`/todo/${todoListId}/todo`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shortDescription: 'test'.repeat(65),
                dueDate: due,
                todoListId,
            })
            .expect(400);

        expect(res.body.message).toContain('shortDescription must be shorter than or equal to 255 characters');
    });

    it('POST /todo/:listId/todo → 400 if dueDate is in the past', async () => {
        const due = new Date(Date.now() - 60_000).toISOString();
        const res = await request(server)
            .post(`/todo/${todoListId}/todo`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shortDescription: 'Buy bread',
                dueDate: due,
                todoListId,
            })
            .expect(400);

        expect(res.body.message).toContain('Due date must be in the future');
    });


    it('POST /todo/:listId/todo → 401 if no token', async () => {
        const due = new Date(Date.now() + 60_000).toISOString();
        await request(server)
            .post(`/todo/${todoListId}/todo`)
            .send({
                shortDescription: 'Buy bread',
                dueDate: due,
                todoListId,
            })
            .expect(401);
    });


    it('GET /todo/list/:listId/todos → get tasks in list', async () => {
        const res = await request(server)
            .get(`/todo/list/${todoListId}/todos`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({id: todoId, shortDescription: 'Buy milk'}),
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
