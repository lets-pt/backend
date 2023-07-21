import { Module } from '@nestjs/common';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { VideoModule } from 'src/video/video.module';

@Module({
  imports: [VideoModule],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service] //S3 서비스 다른 모듈에서 사용할 수 있도록!
})
export class S3Module {}
