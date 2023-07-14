import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    
    @Post()
    create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        return this.userService.create(createUserDTO);
    }

    @Get()
    findAllUser(): Promise<User[]> {
        return this.userService.findAllUser();
    }
}
