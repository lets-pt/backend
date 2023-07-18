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

  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    const isUserExist = await this.userModel.exists({ email });

    if (isUserExist) {
      throw new UnauthorizedException('해당하는 이메일는 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }
}
