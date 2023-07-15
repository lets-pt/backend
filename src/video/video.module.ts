import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from './schemas/video.schemas';

@Module({
  imports: [MongooseModule.forFeature([{name: Video.name, schema: VideoSchema}])],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService] //비디오 서비스 내보내기
})
export class VideoModule {}
