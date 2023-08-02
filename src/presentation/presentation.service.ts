import { Injectable } from '@nestjs/common';
import { Presentation, PresentationDocument } from './schemas/presentation.schemas';
import { Comment } from './schemas/comment.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePresentationDTO } from './dto/create-presentation.dto';
import { TimeData } from './schemas/time.schemas';
import { ChatGptAiService } from '../chat-gpt-ai/chat-gpt-ai.service'
import { WordData } from './schemas/word.schemas';

@Injectable()
export class PresentationService {
  constructor(@InjectModel(Presentation.name) private presentationModel: Model<PresentationDocument>, private ChatGptAiService: ChatGptAiService) { }

  //userId, title, pdf, recommendedWord, forbiddenWord 발표 시작 버튼을 누를시 document 생성
  async createPresentation(createPresentationDTO: CreatePresentationDTO): Promise<Presentation> {
    return this.presentationModel.create(createPresentationDTO);
  }

  // title로 Presentation Document 찾기
  async findOneByTitle(title: string): Promise<Presentation> {
    return this.presentationModel.findOne({ title: title });
  }

  //resultVideo - ffmpeg 결과물을 저장할 때 사용 - s3에 저장된 url을 저장
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

  //sttScript, comment, pdfTime, settingTime, progressingTime 저장
  async updatePresentation(title: string, sttScript: string, pdfTime: TimeData[], settingTime: TimeData, progressingTime: TimeData): Promise<Presentation> {
    try {
      const presentation = await this.presentationModel.findOne({ title: title });

      if (!presentation) {
        throw new Error('Presentation not found');
      }

      presentation.sttScript = sttScript;
      presentation.pdfTime = pdfTime;
      presentation.qna = await this.updateQna(sttScript);
      presentation.settingTime = settingTime;
      presentation.progressingTime = progressingTime;
      
      // 권장 단어 개수 업데이트
      for (let i = 0; i < presentation.recommendedWord.length; i++) {
        const w = presentation.recommendedWord[i];
        w.count = this.countOccurrences(sttScript, w.word);
        presentation.recommendedWord[i] = w;
        console.log(w);
      }

      // 금지 단어 개수 업데이트
      for (let i = 0; i < presentation.forbiddenWord.length; i++) {
        const w = presentation.forbiddenWord[i];
        w.count = this.countOccurrences(sttScript, w.word);
        presentation.forbiddenWord[i] = w;
        console.log(w);
      }

      return await presentation.save();
    }
    catch (err) {
      throw new Error(err);
    }
  }

  //qna 저장
  async updateQna(sttScript: string): Promise<string> {
    try {
      return await this.ChatGptAiService.getModelQna(sttScript);
    }
    catch (err) {
      throw new Error(err);
    }
  }

  // comment 업데이트
  async updateComment(title: string, userComment: Comment): Promise<void> {
    try {

      const presentation = await this.presentationModel.findOne({ title: title });

      if (!presentation) {
        throw new Error('Presentation not found');
      }
      presentation.comment.push(userComment);
      presentation.save();
    }
    catch (err) {
      throw new Error(err);
    }
  }

  //sttScript에서 단어를 카운트 - 정규표현식 사용
  countOccurrences(text: string, word: string): number {
    const regex = new RegExp(word, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  // pdf url 전달하기
  async getPdfUrl(title: string): Promise<string> {
    return (await this.findOneByTitle(title)).pdfURL;
  }

  async getTitle(userId: string): Promise<string[]> {
    const presentations = await this.presentationModel.find({ userId: userId });
    console.log(presentations);
    const titleList = presentations.map(presentation => presentation.title);
    return titleList;
  }
}