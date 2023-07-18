import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';
import { UserRequestDto } from './dto/user.request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async signUp(userRequestDTO: UserRequestDto) {
    const { id, name, password } = userRequestDTO;
    const isUserExist = await this.userModel.exists({ id });

    if (isUserExist) {
      throw new UnauthorizedException('해당하는 Id는 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      id,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }
}
