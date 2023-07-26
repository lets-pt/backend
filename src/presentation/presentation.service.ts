import { Injectable } from '@nestjs/common';
import { Presentation, PresentationDocument } from './schemas/presentation.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePresentationDTO } from './dto/create-presentation.dto';

@Injectable()
export class PresentationService {
    constructor(@InjectModel(Presentation.name) private presentationModel: Model<PresentationDocument>) { }

    //userId, title, pdf 3개만 발표 시작 버튼을 누를시 document 생성
    async createPresentation(createPresentationDTO: CreatePresentationDTO): Promise<Presentation> {
        return this.presentationModel.create(createPresentationDTO);
    }

    // title로 Presentation 찾기
    async findOneByTitle(title: string): Promise<Presentation> {
        return this.presentationModel.findOne({ title: title });
    }

    //resultVideo - ffmpeg 결과물을 저장할 때 사용
    async updateResultVideo(title: string, resultVideo: string): Promise<Presentation> {
        try {
            const presentation = await this.presentationModel.findOne({ title: title });

            if (!presentation) {
                throw new Error('Presentation not found');
            }

            presentation.resultVideo = resultVideo;
            return presentation.save();
        }
        catch (err) {
            throw new Error(err);
        }
    }
}
