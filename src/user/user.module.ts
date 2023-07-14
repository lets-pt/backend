import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])], //User모델과 관련된 기능을 수행하는 모듈
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
