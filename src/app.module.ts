import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(), //git에 중요정보를 올리지 않기 위해 .env 사용
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}