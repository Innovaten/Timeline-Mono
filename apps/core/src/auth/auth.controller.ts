import { Controller, Post, Body, Get, Headers, Request } from '@nestjs/common';
import type { Request as ERequest } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '../common/services/jwt.service';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { IUserDoc } from '@repo/models';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Get('verify-token')
  async getUserDocFromToken(
    @Headers('authorization') authToken: string
  ) {

    if (authToken.startsWith('Bearer')){
      authToken = authToken.split(" ")[1];
    }

    try{
      const user = await this.jwtService.validateToken(authToken)
      if(!user){
        return ServerErrorResponse(
          new Error("Specified user not found."),
          403
        )
      }
      return ServerSuccessResponse<IUserDoc>(user);
    
    } catch(err) {
      console.log(err);
      return ServerErrorResponse(
        new Error(`${err}`),
        500
      )
    }
  }

  @Post('login')
  async login(
    @Body() loginBody: LoginDto,
    @Request() req: ERequest,
  ) {
    try {
      return this.authService.login(loginBody.email, loginBody.password, req.headers.origin ?? "" );
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500)
    }
  }
}
