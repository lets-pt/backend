import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserRequestDto } from './dto/user.request.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findUserByIdWithoutPassword(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    const users = await this.userModel.findOne({ id });
    return users;
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.userModel.exists({ id });
    if (result) return true;
    else return false;
  }

  async create(user: UserRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }
}
