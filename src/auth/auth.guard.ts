import { BadRequestException, CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RoleType } from '@prisma/client';

export const ROLES_KEY = 'Roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles = this.reflector.get<RoleType[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException('Token não encontrado!');
    }
    const [, token] = authHeader.split(' ');
    if (!token) {
      throw new BadRequestException('Token não encontrado!');
    }
    try {
      !this.jwtService.verify(token, {
        secret: "teste123"
      })
    } catch (e) {
      throw new BadRequestException('Token inválido!');
    }
    const user = <{
      sub: string;
      email: string;
      role: RoleType;
    }>this.jwtService.decode(token);
    request.user = user;
    if (roles.includes(user.role)) {
      return true;
    }
    throw new UnauthorizedException('Usuário não autorizado!');
  }
}
