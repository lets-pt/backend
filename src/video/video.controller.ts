import { Body, Controller, Get, Post } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDTO } from './dto/create-video.dto';
import { Video } from './schemas/video.schemas';

@Controller('video')
export class VideoController {
    constructor(private readonly videoService: VideoService) { }
    
    @Post()
    createVideo(@Body() createVideoDTO: CreateVideoDTO): Promise<Video> {
        return this.videoService.createVideo(createVideoDTO);
    }

    @Get()
    findAllVideo(): Promise<Video[]> {
        return this.videoService.findAllVideo();
    }
}
