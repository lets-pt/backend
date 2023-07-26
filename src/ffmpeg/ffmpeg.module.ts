import { Module } from '@nestjs/common';
import { FfmpegController } from './ffmpeg.controller';
import { FfmpegService } from './ffmpeg.service';
import { S3Module } from 'src/s3/s3.module';
import { PresentationController } from 'src/presentation/presentation.controller';
import { PresentationModule } from 'src/presentation/presentation.module';
import { PresentationService } from 'src/presentation/presentation.service';

@Module({
  imports: [S3Module,PresentationModule],
  controllers: [FfmpegController],
  providers: [FfmpegService]
})
export class FfmpegModule {}