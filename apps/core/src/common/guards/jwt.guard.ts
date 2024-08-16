import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../services/jwt.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        return false;
      }
      try {
        const user = await this.jwtService.validateToken(token);
        if(!user) return false;
        request['user'] = user;
      } catch (err) {

        return false;
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      if(["post", "patch", "put"].includes(request.method.toLowerCase())) {
        const [type, token] = request.body.headers.authorization?.split(' ') ?? [];
        console.log(token)
        return type === 'Bearer' ? token : undefined;
      } else {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
    }
  }