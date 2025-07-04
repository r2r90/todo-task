import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {IS_DEV_ENV} from "./lib/utils/is-dev.util";
import {AuthModule} from './auth/auth.module';
import {PrismaModule} from './prisma/prisma.module';
import { TodoModule } from './todo/todo.module';

@Module({
    imports: [ConfigModule.forRoot({
        ignoreEnvFile: !IS_DEV_ENV,
        isGlobal: true
    }), PrismaModule, AuthModule, TodoModule],
    controllers: [],
    providers: [],
})
export class AppModule {
}
