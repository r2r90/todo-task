import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AuthController (e2e)', () => {
    let app: INestApplication
    let server: any
    let refreshCookie: string

    // NOTE: we now include confirmPassword, same as password
    const user = {
        firstName: 'Test',
        lastName: 'User',
        email: `test.user+${Date.now()}@example.com`,
        password: 'Password123!',
        confirmPassword: 'Password123!',
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        // enable class-validator DTO validation (whitelist strips unknown props)
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
        app.use(require('cookie-parser')())
        await app.init()
        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    it('POST /auth/register → 201 + accessToken', async () => {
        const res = await request(server)
            .post('/auth/register')
            .send(user)
            .expect(201)

        expect(res.body).toHaveProperty('accessToken')
    })

    it('POST /auth/login → 200 + sets refresh cookie', async () => {
        const res = await request(server)
            .post('/auth/login')
            .send({ email: user.email, password: user.password })
            .expect(200)

        expect(res.body).toHaveProperty('accessToken')

        const raw = res.header['set-cookie']
        expect(raw).toBeDefined()
        const cookies = Array.isArray(raw) ? raw : [raw]
        const pair = cookies.find((c) => c.startsWith('refreshToken='))
        expect(pair).toBeDefined()
        refreshCookie = pair!.split(';')[0]
    })

    it('GET /auth/me → 200 + returns { id }', async () => {
        const loginRes = await request(server)
            .post('/auth/login')
            .send({ email: user.email, password: user.password })
            .expect(200)

        const token = loginRes.body.accessToken
        const meRes = await request(server)
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        expect(meRes.body).toHaveProperty('id')
    })

    it('POST /auth/refresh → 200 + new accessToken', async () => {
        const res = await request(server)
            .post('/auth/refresh')
            .set('Cookie', refreshCookie)
            .expect(200)

        expect(res.body).toHaveProperty('accessToken')
    })

    it('POST /auth/logout → 200 + clears refresh cookie', async () => {
        const res = await request(server)
            .post('/auth/logout')
            .set('Cookie', refreshCookie)
            .expect(200)

        const raw = res.header['set-cookie']
        expect(raw).toBeDefined()
        const cookies = Array.isArray(raw) ? raw : [raw]
        expect(
            cookies.some(
                (c) =>
                    c.startsWith('refreshToken=') &&
                    /Expires=Thu, 01 Jan 1970 00:00:00 GMT/.test(c),
            ),
        ).toBeTruthy()
    })
})
