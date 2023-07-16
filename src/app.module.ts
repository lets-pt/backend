import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Module } from './s3/s3.module';
import { VideoModule } from './video/video.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}), //git에 중요정보를 올리지 않기 위해 .env 사용 - 다른 모듈에서도 사용가능
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    S3Module,
    VideoModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}