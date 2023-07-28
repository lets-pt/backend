import { Module } from '@nestjs/common';
import { FfmpegController } from './ffmpeg.controller';
import { FfmpegService } from './ffmpeg.service';
import { S3Module } from 'src/s3/s3.module';
import { PresentationModule } from 'src/presentation/presentation.module';


@Module({
  imports: [S3Module,PresentationModule],
  controllers: [FfmpegController],
  providers: [FfmpegService]
})
export class FfmpegModule {}