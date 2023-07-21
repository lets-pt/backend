import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRequestDto } from './dto/user.request.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  //중복된 아이디 확인
  async isUserExistId(id: string) {
    return await this.userRepository.existsById(id);
  }

  //중복된 닉네임 확인
  async isUserExistName(name: string) {
    return await this.userRepository.existsByName(name);
  }

  //회원가입
  async signUp(body: UserRequestDto) {
    const { id, password, name, email } = body;
    const isUserExist = await this.userRepository.existsById(id);
    if (isUserExist) {
      throw new UnauthorizedException('해당하는 Id는 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      id,
      name,
      password: hashedPassword,
      email,
    });

    return user.readOnlyData;
  }
}
