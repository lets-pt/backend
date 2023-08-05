import { Injectable } from '@nestjs/common';
import { Presentation, PresentationDocument } from './schemas/presentation.schemas';
import { Comment } from './schemas/comment.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePresentationDTO } from './dto/create-presentation.dto';
import { ChatGptAiService } from '../chat-gpt-ai/chat-gpt-ai.service'

@Injectable()
export class PresentationService {
  constructor(@InjectModel(Presentation.name) private presentationModel: Model<PresentationDocument>, private ChatGptAiService: ChatGptAiService) { }

  //userId, title, pdf, recommendedWord, forbiddenWord, sttScript, pdfTime, settingTime, progressingTime = DTO
  async createPresentation(createPresentationDTO: CreatePresentationDTO): Promise<Presentation> {
    const qna = await this.updateQna(createPresentationDTO.sttScript); //qna 생성

    // 권장 단어 개수 업데이트
    for (let i = 0; i < createPresentationDTO.recommendedWord.length; i++) {
      const w = createPresentationDTO.recommendedWord[i];
      w.count = this.countOccurrences(createPresentationDTO.sttScript, w.word);
      createPresentationDTO.recommendedWord[i] = w;
      console.log(w);
    }

    // 금지 단어 개수 업데이트
    for (let i = 0; i < createPresentationDTO.forbiddenWord.length; i++) {
      const w = createPresentationDTO.forbiddenWord[i];
      w.count = this.countOccurrences(createPresentationDTO.sttScript, w.word);
      createPresentationDTO.forbiddenWord[i] = w;
      console.log(w);
    }
    
    const presentation = await this.presentationModel.findOne({ title: createPresentationDTO.title, userId: createPresentationDTO.userId });
    if (presentation) {
      presentation.pdfURL = createPresentationDTO.pdfURL;
      presentation.recommendedWord = createPresentationDTO.recommendedWord;
      presentation.forbiddenWord = createPresentationDTO.forbiddenWord;
      presentation.sttScript = createPresentationDTO.sttScript;
      presentation.pdfTime = createPresentationDTO.pdfTime;
      presentation.settingTime = createPresentationDTO.settingTime;
      presentation.progressingTime = createPresentationDTO.progressingTime;
      presentation.qna = qna;
      return presentation.save();
    }
    
    const createData = { ...createPresentationDTO, qna };
    return this.presentationModel.create(createData);
  }

  // title, userId로 Presentation Document 찾기
  // localhost:3001/presentation?title=수빈_test_2023.8.4_23:52&userId=수빈
  async findOneByTitle(title: string, userId: string): Promise<Presentation> {
    return this.presentationModel.findOne({ title: title, userId: userId });
  }

  //resultVideo - ffmpeg 결과물을 저장할 때 사용 - s3에 저장된 url을 저장
  async updateResultVideo(title: string, userId: string, resultVideo: string): Promise<Presentation> {
    try {
      const presentation = await this.presentationModel.findOne({ title: title, userId: userId });

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
  async updateComment(title: string, userId: string, userComment: Comment): Promise<void> {
    try {

      const presentation = await this.presentationModel.findOne({ title: title, userId: userId });

      if (!presentation) {
        await this.presentationModel.create({ title: title, userId: userId, comment: userComment });
        return;
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

  //pdf url 전달하기 - getpresentation과 동일 형식
  async getPdfUrl(title: string, userId: string): Promise<string> {
    return (await this.findOneByTitle(title, userId)).pdfURL;
  }

  async getTitle(userId: string): Promise<string[]> {
    const presentations = await this.presentationModel.find({ userId: userId });
    console.log(presentations);
    const titleList = presentations.map(presentation => presentation.title);
    return titleList;
  }

  async isTitleExist(title: string, userId: string): Promise<boolean> {
    const titleList = await this.getTitle(userId);
    return titleList.includes(title);
  }
}