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
    private sttScript: string;

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

    //sttScript에서 단어를 카운트
    countOccurrences(text: string, word: string): number {
      const regex = new RegExp(word, 'gi');
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    } 

    async updateWordCount(word: string): Promise<void> {
      try {
        // 추천 단어 배열에서 단어 찾아서 count 업데이트
        await this.presentationModel.updateOne(
          { 'recommendedWord.word': word },
          { $inc: { 'recommendedWord.$.count': 1 } }
        ).exec();
    
        // 금지 단어 배열에서 단어 찾아서 count 업데이트
        await this.presentationModel.updateOne(
          { 'forbiddenWord.word': word },
          { $inc: { 'forbiddenWord.$.count': 1 } }
        ).exec();
    
        // 데이터베이스에서 sttScript를 불러와서 단어 발생 빈도를 세고 count 업데이트
        const presentation = await this.presentationModel.findOne({});
        if (presentation) {
          const sttScriptOccurrences = this.countOccurrences(presentation.sttScript, word);
          console.log(`sttScriptOccurrences: ${sttScriptOccurrences}`);
    
          if (sttScriptOccurrences > 0) {
            await this.presentationModel.updateOne(
              { sttScript: { $regex: `\\b${word}\\b`, $options: 'i' } },
              { $inc: { 'recommendedWord.$.count': sttScriptOccurrences } }
            ).exec();
    
            console.log(`단어 "${word}"의 발생 횟수를 업데이트했습니다.`);
            console.log(presentation.sttScript);
          } else {
            console.log(`단어 "${word}"는 스크립트에서 발견되지 않았습니다.`);
          }
        } else {
          console.error('프레젠테이션을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('updateWordCount 에러:', err);
        throw new Error(err);
      }
    }
  
  }