import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // 컨트롤러의 특정 경로에만 JWT 인증을 적용하기 위해 오버라이드합니다.
    return super.canActivate(context);
  }
}
