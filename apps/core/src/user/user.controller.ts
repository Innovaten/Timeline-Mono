import { Body, Controller, Post } from '@nestjs/common';
import { UserRegistrationDTO } from './user.dto';
import { UserService } from '../common/services/user.service';

@Controller({
    path: 'user',
    version: '1',
})

export class UserController {

    constructor(private user: UserService) { }

    @Post('/register-student')
    async createNewStudent(@Body() regData: UserRegistrationDTO){
        return await this.user.createNewRegistration(regData);
    }

}
