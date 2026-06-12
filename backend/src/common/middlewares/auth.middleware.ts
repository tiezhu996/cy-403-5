import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../enums/user-role.enum';

export interface JwtRequestUser {
  id: number;
  phone: string;
  name: string;
  role: UserRole;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request & { user?: JwtRequestUser }, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as unknown as {
          sub: number;
          phone: string;
          name: string;
          role: UserRole;
        };
        req.user = {
          id: Number(payload.sub),
          phone: payload.phone,
          name: payload.name,
          role: payload.role,
        };
      } catch {
        req.user = undefined;
      }
    }

    next();
  }
}
