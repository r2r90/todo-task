import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from "@nestjs/config";
import * as cookieParser from 'cookie-parser';
import {ValidationPipe} from "@nestjs/common";
import { setupSwagger } from '@/lib/utils/swagger.util'


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService)

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true
        })
    )



    app.enableCors({
        origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
        credentials: true,
        exposeHeaders: ['set-cookie']
    })

	setupSwagger(app)

    await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}

bootstrap();
