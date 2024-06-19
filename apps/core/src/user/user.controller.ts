import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../common/services/user.service';

@Controller({
    path: 'user',
    version: '1',
})

export class UserController {

    constructor(private user: UserService) { }

}
