import { Module } from '@nestjs/common';
import { FfmpegController } from './ffmpeg.controller';
import { FfmpegService } from './ffmpeg.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [FfmpegController],
  providers: [FfmpegService]
})
export class FfmpegModule {}
