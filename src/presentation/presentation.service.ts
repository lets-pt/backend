import { Injectable } from '@nestjs/common';
import { Presentation, PresentationDocument} from './schemas/presentation.schemas';
import {Comment} from './schemas/comment.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePresentationDTO } from './dto/create-presentation.dto';
import { TimeData } from './schemas/time.schemas';
import { ChatGptAiService } from '../chat-gpt-ai/chat-gpt-ai.service'
import { WordData } from './schemas/word.schemas';

@Injectable()
export class PresentationService {
  constructor(@InjectModel(Presentation.name) private presentationModel: Model<PresentationDocument>, private ChatGptAiService: ChatGptAiService) { }
  private sttScript: string;

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
      //update - count 최종 함수 작성
      
      await presentation.save();

      presentation.recommendedWord.forEach((wordData) => {
        this.updateWordCount(wordData.word);
      })

      presentation.forbiddenWord.forEach((WordData) => {
        this.updateWordCount(WordData.word);
      })

      return presentation;
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

  // coment 업데이트
  async updateComment(title:string, userComment:Comment,) :Promise<void>{
    try{
      
      const presentation = await this.presentationModel.findOne({ title: title });

      if (!presentation) {
        throw new Error('Presentation not found');
      }
      presentation.comment.push(userComment);
    
    }
    catch(err){
      throw new Error(err);
    }
  }

  //sttScript에서 단어를 카운트
  countOccurrences(text: string, word: string): number {
    const regex = new RegExp(word, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  // 단어 발생 횟수 업데이트
  async updateWordCount(word: string): Promise<void> {
    try {
      const presentation = await this.presentationModel.findOne({});
      if (presentation) {
        const sttScriptOccurrences = this.countOccurrences(
          presentation.sttScript,
          word,
        );
        console.log(`sttScriptOccurrences: ${sttScriptOccurrences}`);

        // 추천 단어 배열에서 단어 찾아서 count 업데이트
        await this.presentationModel.updateOne(
          { 'recommendedWord.word': word },
          { $set: { 'recommendedWord.$.count': sttScriptOccurrences } },
        ).exec();

        // 금지 단어 배열에서 단어 찾아서 count 업데이트
        await this.presentationModel.updateOne(
          { 'forbiddenWord.word': word },
          { $set: { 'forbiddenWord.$.count': sttScriptOccurrences } },
        ).exec();

        console.log(`단어 "${word}"의 발생 횟수를 업데이트했습니다.`);
        console.log(presentation.sttScript);
      } else {
        console.error('프레젠테이션을 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('updateWordCount 에러:', err);
      throw new Error(err);
    }
  }

  // pdf url 전달하기
  async getPdfUrl(title: string): Promise<string> {
    return (await this.findOneByTitle(title)).pdfURL;
  }
}