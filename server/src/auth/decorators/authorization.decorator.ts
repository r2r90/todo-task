import {applyDecorators, UseGuards} from "@nestjs/common";
import {JwtGuard} from "@/auth/guards/auth.guard";

export function Authorization() {
    return applyDecorators(UseGuards(JwtGuard))
}