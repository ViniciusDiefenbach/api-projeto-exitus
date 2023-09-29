import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RoleType } from '@prisma/client';

export const ROLES_KEY = 'Roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const roles = this.reflector.get<RoleType[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }
    const [, token] = authHeader.split(' ');
    if (!token) {
      return false;
    }
    const user = await this.jwtService.verifyAsync(token);
    request.user = user;
    if (roles.includes(user.role)) {
      return true;
    }
    return true;
  }
}
