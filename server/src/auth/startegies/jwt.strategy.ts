import {PassportStrategy} from '@nestjs/passport'
import {AuthService} from '@/auth/auth.service'
import {ConfigService} from '@nestjs/config'
import {ExtractJwt, Strategy} from "passport-jwt";
import type {JwtPayload} from "@/auth/interfaces/jwt.interface";
import {Injectable} from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
            algorithms: ['HS256']
        })
    }

   async validate(payload: JwtPayload) {
        return await this.authService.validate(payload.id)
    }
}