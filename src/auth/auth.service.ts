import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { BcryptService } from '@/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { RoleType } from '@prisma/client';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService
    ) { }

    async login({ role, email, password }: LoginDto) {
        const user = await this.prismaService.user.findUnique({
            select: {
                id: true,
                email: true,
                password: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                role_type: true
                            }
                        }
                    }
                }
            },
            where: {
                email: email
            }
        });

        if (!user) {
            throw new BadRequestException('Usuário não encontrado!')
        }

        if (await this.bcryptService.compare({
            password: password,
            hash: user.password
        }) == false) {
            throw new BadRequestException('Senha incorreta!')
        }

        let choosedRole;

        if (role) {
            choosedRole = user.roles.find((userRole) => {
                if (userRole.role.role_type == role) {
                    choosedRole = role;
                    return true;
                }
            })
            if (!choosedRole) {
                throw new BadRequestException('Usuário não possui permissão para acessar o sistema! 1')
            }
        } else {
            if (user.roles.length != 1) {
                throw new BadRequestException('Usuário não possui permissão para acessar o sistema!')
            }
            choosedRole = user.roles[0].role.role_type;
        }

        const access_token = this.jwtService.sign({
            sub: user.id,
            role: choosedRole,
        }, {
            secret: "teste123",
            expiresIn: '60s'
        })

        const refresh_token = await this.prismaService.refreshToken.create({
            data: {
                id: randomUUID(),
                user_id: user.id,
                choosed_role: choosedRole as RoleType,
                expires_at: new Date(new Date().getTime() + 60 * 1000),
                created_at: new Date(),
            }
        })

        return {
            access_token,
            refresh_token
        }
    }

    async refreshToken({ refresh_token }: RefreshTokenDto) {
        const token = await this.prismaService.refreshToken.findUnique({
            where: {
                id: refresh_token
            }
        })

        if (!token) {
            throw new BadRequestException('Token inválido!')
        }

        const access_token = this.jwtService.sign({
            sub: token.user_id,
            role: token.choosed_role,
        }, {
            secret: "teste123",
            expiresIn: '60s'
        })

        if (token.expires_at < new Date()) {
            await this.prismaService.refreshToken.deleteMany({
                where: {
                    user_id: token.user_id
                }
            })

            const refresh_token = await this.prismaService.refreshToken.create({
                data: {
                    id: randomUUID(),
                    user_id: token.user_id,
                    choosed_role: token.choosed_role,
                    expires_at: new Date(new Date().getTime() + 60 * 1000),
                    created_at: new Date(),
                }
            })

            return {
                access_token,
                refresh_token
            }
        }
        
        return {
            access_token
        }
    }
}
