import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schemas';
import { UserRequestDto } from './dto/user.request.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    const isUserExist = await this.userRepository.existsByEmail(email);
    if (isUserExist) {
      throw new UnauthorizedException('해당하는 유저는 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }
}
