import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtRequestUser } from '../../../common/middlewares/auth.middleware';
import { UserRole } from '../../../common/enums/user-role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest<Request & { user?: JwtRequestUser }>();

    if (!request.user) {
      throw new UnauthorizedException('请先登录');
    }

    if (!roles?.length) {
      return true;
    }

    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException('当前角色无权执行该操作');
    }

    return true;
  }
}

