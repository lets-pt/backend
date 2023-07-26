import { Module } from '@nestjs/common';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Presentation, PresentationSchema } from './schemas/presentation.schemas';

@Module({
  imports: [MongooseModule.forFeature([{name: Presentation.name, schema: PresentationSchema}])],
  controllers: [PresentationController],
  providers: [PresentationService],
  exports: [PresentationService] //프레젠테이션 서비스 내보내기
})
export class PresentationModule {}
