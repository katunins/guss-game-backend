import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(payload: {
    username: string;
    isAdmin: boolean;
  }): Promise<string> {
    return this.jwtService.sign(payload);
  }

  getUserFromBearer(bearer?: string) {
    if (!bearer) {
      throw new UnauthorizedException();
    }
    const token = bearer.replace(/^Bearer\s*/i, '');
    try {
      const payload = this.jwtService.verify<{
        username?: string;
        isAdmin?: boolean;
      }>(token);
      if (!('username' in payload && 'isAdmin' in payload)) {
        throw new UnauthorizedException();
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
