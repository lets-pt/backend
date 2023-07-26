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
}
