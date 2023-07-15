import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video, VideoDocument } from './schemas/video.schemas';
import { Model } from 'mongoose';
import { CreateVideoDTO } from './dto/create-video.dto';

@Injectable()
export class VideoService {
    constructor(@InjectModel(Video.name) private videoModel: Model<VideoDocument>) { }
    
    async createVideo(createVideoDTO: CreateVideoDTO): Promise<Video> {
        return this.videoModel.create(createVideoDTO);
    }

    async findAllVideo(): Promise<Video[]> {
        return this.videoModel.find().exec();
    }
}
