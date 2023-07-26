import { Injectable } from '@nestjs/common';
import { Presentation, PresentationDocument } from './schemas/presentation.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePresentationDTO } from './dto/create-presentation.dto';
import { Comment } from './schemas/comment.schemas';
import { TimeData } from './schemas/time.schemas';

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

    //sttScript, comment, pdfTime 저장
    async updatePresentation(title: string, sttScript: string, comment: Comment[], pdfTime: TimeData[]): Promise<Presentation> {
        try {
            const presentation = await this.presentationModel.findOne({ title: title });

            if (!presentation) {
                throw new Error('Presentation not found');
            }

            presentation.sttScript = sttScript;
            presentation.comment = comment;
            presentation.pdfTime = pdfTime;
            return presentation.save();
        }
        catch (err) {
            throw new Error(err);
        }
    }

    //question : answer 저장
    async updateQuestion(title: string, question: string, answer: string): Promise<Presentation> {
        try {
            const presentation = await this.presentationModel.findOne({ title: title });

            if (!presentation) {
                throw new Error('Presentation not found');
            }

            presentation.question.push({ question: question, answer: answer });
            return presentation.save();
        }
        catch (err) {
            throw new Error(err);
        }
    }
}
