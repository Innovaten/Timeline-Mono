import { Body, Controller, Get, Query, Post, Request, UseGuards, Patch } from '@nestjs/common';
import { UserService } from '../common/services/user.service';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { IUserDoc, UserModel } from '@repo/models';
import { AuthGuard } from '../common/guards/jwt.guard';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { JwtService } from '../common/services/jwt.service';
import { Roles } from '../common/enums/roles.enum';

@Controller({
    path: 'users',
    version: '1',
})

export class UsersController {

    constructor(
        private user: UserService,
        private jwt: JwtService
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    async getAllUsers(
        @Query('limit') rawLimit: string,
        @Query('offset') rawOffset: string,
        @Query('filter') rawFilter: string,
    ){

        let filter = rawFilter ? JSON.parse(rawFilter) : {}
        let limit;
        let offset;

        if(rawLimit){
            limit = parseInt(rawLimit);
        }

        if(rawOffset){
            offset = parseInt(rawOffset)
        } 

        try {
            const users = await this.user.getUsers(limit, offset, filter)
            const count = await this.user.getCount(filter);
    
            return ServerSuccessResponse<{ users: IUserDoc[], count: number}>({
                users,
                count,
            })

        } catch (err) {
            return ServerErrorResponse(
                new Error(`${err}`),
                500
            )
        }
    }

    @Post()
    async createUser(
        @Body() userData: CreateUserDto,
        @Request() req: Request
    
    ) {

        const creator = await this.jwt.validateToken(userData.authToken);

        if(!creator){
            return ServerErrorResponse(
                new Error("Unauthenticated"),
                401
            )
        }

        if(creator.role != 'SUDO'){
            return ServerErrorResponse(
                new Error("Unauthorized"),
                401
            )
        }

        try {
            const user = await this.user.createAdmin(userData, `${creator._id}`);
            return ServerSuccessResponse(user);
        } catch(err) {
            return ServerErrorResponse(
                new Error(`${err}`),
                500
            )
        }

    }

    @UseGuards(AuthGuard)
    @Get('upgrade-to-sudo')
    async upgradeToSudo(@Query('adminId') adminId: string, @Request() req: any) {
       const user = req['user']
       if(user.role !== Roles.SUDO) {
        return ServerErrorResponse(new Error('Unauthorized'), 401)
       } 
       
       try {
        const updatedUser = await this.user.upgradeToSudo(adminId)
        return ServerSuccessResponse(updatedUser)
       } catch (error) {
        return ServerErrorResponse(new Error(`${error}`), 500)
       }
    }

    @UseGuards(AuthGuard)
    @Get('downgrade-to-admin')
    async downgradeToAdmin(@Query('sudoId') sudoId: string, @Request() req: any) {
        const user = req['user']
        if(user.role !== Roles.SUDO) {
            return ServerErrorResponse(new Error('Unauthorized'), 401)
        }

        try {
            const updatedUser = await this.user.downgradeToAdmin(sudoId)
            return ServerSuccessResponse(updatedUser)
        } catch (error) {
            return ServerErrorResponse(new Error(`${error}`), 500)
        }
    }

    @UseGuards(AuthGuard)
    @Patch()
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req: any) {
        const user = req['user']
        if (user.role !== 'SUDO' && user._id !== updateUserDto._id) {
            return ServerErrorResponse(new Error("Unauthorized"), 401)
        }

        try {
            const updatedUser = await this.user.updateUser(updateUserDto)
            return ServerSuccessResponse(updatedUser)
        } catch (error) {
            return ServerErrorResponse(new Error(`${error}`), 500)
        }
    }

}
