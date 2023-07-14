import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
    
    //유저 생성
    async create(createUserDTO: CreateUserDTO): Promise<User> {
        return this.userModel.create(createUserDTO);
    }

    //전체 유저 불러오기
    async findAllUser(): Promise<User[]> {
        return this.userModel.find().exec();
    }
}
