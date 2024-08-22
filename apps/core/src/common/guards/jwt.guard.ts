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
      const isPostPutORPatchRequest = ["post", "patch", "put"].includes(request.method.toLowerCase())
      if(isPostPutORPatchRequest) {
        const [type, token] = request.body?.headers?.authorization?.split(' ') ?? [];
        if(type === 'Bearer') return token;

        // Backup
        const [backupType, backupToken] = request.headers.authorization?.split(' ') ?? [];
        return backupType === 'Bearer' ? backupToken : undefined;

      } else {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
    }
  }