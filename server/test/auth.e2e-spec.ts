import * as dotenv from 'dotenv';
dotenv.config();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '@/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let server: any;
    let jwtService: JwtService;
    let refreshCookie: string;

    const makePayload = (overrides: Partial<any> = {}) => ({
        firstName: 'John',
        lastName: 'Doe',
        email: `john.doe+${Date.now()}@example.com`,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        ...overrides,
    });

    const user = makePayload();

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: process.env.JWT_REFRESH_TOKEN_TTL },
                }),
                AppModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        app.use(cookieParser(process.env.COOKIE_SECRET));
        await app.init();

        server = app.getHttpServer();
        jwtService = moduleFixture.get(JwtService);
    });

    afterAll(async () => {
        await app.close();
    });

    // REGISTER

    it('POST /auth/register → 201 + accessToken and refresh cookie', async () => {
        const res = await request(server)
            .post('/auth/register')
            .send(user)
            .expect(201);

        expect(res.body).toHaveProperty('accessToken');
        const raw = res.header['set-cookie'];
        expect(raw).toBeDefined();
        const cookies = Array.isArray(raw) ? raw : [raw];
        expect(cookies.some(c => c.startsWith('refreshToken='))).toBeTruthy();
    });

    it('POST /auth/register → 400 if firstName is missing', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ firstName: undefined }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('First name cannot be empty.');
            });
    });

    it('POST /auth/register → 400 if firstName not a string', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ firstName: 123 }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('First name must be a string.');
            });
    });

    it('POST /auth/register → 400 if firstName length invalid', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ firstName: 'A'.repeat(31) }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('First name must be between 2 and 30 characters long.');
            });
    });

    it('POST /auth/register → 400 if lastName missing', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ lastName: undefined }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('Last name cannot be empty.');
            });
    });

    it('POST /auth/register → 400 if lastName not a string', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ lastName: 456 }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('Last name must be a string.');
            });
    });

    it('POST /auth/register → 400 if lastName length invalid', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ lastName: 'B'.repeat(31) }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('Last name must be between 2 and 30 characters long.');
            });
    });

    it('POST /auth/register → 400 if email missing', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ email: undefined }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('Email cannot be empty.');
            });
    });

    it('POST /auth/register → 400 if email not a string', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ email: 12345 }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('Email must be a string.');
            });
    });

    it('POST /auth/register → 400 if email format invalid', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ email: 'invalid' }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('Email must be a valid email address.');
            });
    });

    it('POST /auth/register → 400 if password missing', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ password: undefined, confirmPassword: undefined }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('Password cannot be empty.');
            });
    });

    it('POST /auth/register → 400 if password not a string', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ password: 123456789, confirmPassword: 123456789 }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('Password must be a string.');
            });
    });

    it('POST /auth/register → 400 if password complexity invalid', async () => {
        await request(server)
            .post('/auth/register')
            .send(makePayload({ password: 'password', confirmPassword: 'password' }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain(
                    'Password must be 8–20 chars, with at least one uppercase, one lowercase, one digit and one special character.'
                );
            });
    });

    it('POST /auth/register → 400 if password length invalid', async () => {
        const long = 'A1!'.repeat(10) + 'A';
        await request(server)
            .post('/auth/register')
            .send(makePayload({ password: long, confirmPassword: long }))
            .expect(400)
            .expect(res => {
                expect(res.body.message).toContain('Password must be at most 20 characters.');
            });
    });

    it('POST /auth/register → 409 if user already exists', async () => {
        await request(server).post('/auth/register').send(user).expect(409)
            .expect(res => {
                expect(res.body.message).toBe('User already exists');
            });
    });

    // LOGIN

    it('POST /auth/login → 200 + sets refresh cookie', async () => {
        const loginRes = await request(server)
            .post('/auth/login')
            .send({ email: user.email, password: user.password })
            .expect(200);

        expect(loginRes.body).toHaveProperty('accessToken');
        const raw = loginRes.header['set-cookie'];
        expect(raw).toBeDefined();
        const cookies = Array.isArray(raw) ? raw : [raw];
        const pair = cookies.find(c => c.startsWith('refreshToken='));
        expect(pair).toBeDefined();
        refreshCookie = pair!.split(';')[0];
    });

    it('POST /auth/login → 400 if email missing', async () => {
        await request(server)
            .post('/auth/login')
            .send({ password: 'Password123!' })
            .expect(400)
            .expect(res => {
                expect(res.body.message).toEqual(
                    expect.arrayContaining(['Email cannot be empty'])
                );
            });
    });

    it('POST /auth/login → 400 if password missing', async () => {
        await request(server)
            .post('/auth/login')
            .send({ email: user.email })
            .expect(400)
            .expect(res => {
                expect(res.body.message).toEqual(
                    expect.arrayContaining(['Password cannot be empty'])
                );
            });
    });

    it('POST /auth/login → 404 if user not found', async () => {
        await request(server)
            .post('/auth/login')
            .send({ email: 'unknown@example.com', password: 'Password123!' })
            .expect(404)
            .expect(res => {
                expect(res.body.message).toBe('Invalid email or password');
            });
    });

    it('POST /auth/login → 404 if password incorrect', async () => {
        await request(server)
            .post('/auth/login')
            .send({ email: user.email, password: 'WrongPass123!' })
            .expect(404)
            .expect(res => {
                expect(res.body.message).toBe('Invalid email or password');
            });
    });

    // ME

    it('GET /auth/me → 200 + returns id', async () => {
        const loginRes = await request(server)
            .post('/auth/login')
            .send({ email: user.email, password: user.password })
            .expect(200);

        const token = loginRes.body.accessToken;
        const meRes = await request(server)
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(meRes.body).toHaveProperty('id');
    });

    // REFRESH

    it('POST /auth/refresh → 200 + rotates tokens', async () => {
        const res = await request(server)
            .post('/auth/refresh')
            .set('Cookie', refreshCookie)
            .expect(200);

        expect(res.body).toHaveProperty('accessToken');
        const raw = res.header['set-cookie'];
        expect(raw).toBeDefined();
        const cookies = Array.isArray(raw) ? raw : [raw];
        expect(cookies.find(c => c.startsWith('refreshToken='))).toBeDefined();
    });

    it('POST /auth/refresh → 401 if malformed token', async () => {
        await request(server)
            .post('/auth/refresh')
            .set('Cookie', 'refreshToken=invalid')
            .expect(401);
    });

    it('POST /auth/refresh → 401 if user not found', async () => {
        const fakeToken = jwtService.sign({ id: '00000000-0000-0000-0000-000000000000' }, { expiresIn: '1h' });
        await request(server)
            .post('/auth/refresh')
            .set('Cookie', `refreshToken=${fakeToken}`)
            .expect(401)
            .expect(res => {
                expect(res.body.message).toBe('User not found');
            });
    });

    it('POST /auth/refresh → 401 if no cookie', async () => {
        await request(server)
            .post('/auth/refresh')
            .expect(401)
            .expect(res => {
                expect(res.body.message).toBe('Refresh token not found');
            });
    });

    // LOGOUT

    it('POST /auth/logout → 200 + clears refresh cookie', async () => {
        const res = await request(server)
            .post('/auth/logout')
            .set('Cookie', refreshCookie)
            .expect(200);

        const raw = res.header['set-cookie'];
        expect(raw).toBeDefined();
        const cookies = Array.isArray(raw) ? raw : [raw];
        expect(cookies.some(c => c.startsWith('refreshToken=') && /Expires=Thu, 01 Jan 1970 00:00:00 GMT/.test(c))).toBeTruthy();
    });
});
