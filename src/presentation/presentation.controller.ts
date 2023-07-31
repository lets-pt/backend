import { Body, Controller, Post, Put } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { CreatePresentationDTO } from './dto/create-presentation.dto';
import { Presentation } from './schemas/presentation.schemas';

@Controller('presentation')
export class PresentationController {
    constructor(private readonly presentationService: PresentationService) { }

    @Post()
    createPresentation(@Body() createPresentationDTO: CreatePresentationDTO): Promise<Presentation> {
        return this.presentationService.createPresentation(createPresentationDTO);
    }

    @Post('resultVideo')
    updatePresentationResultVideo(@Body() body: any): Promise<Presentation> {
        return this.presentationService.updateResultVideo(body.title, body.resultVideo);
    }

    @Post('update')
    updatePresentation(@Body() body: any): Promise<Presentation> {
        return this.presentationService.updatePresentation(body.title, body.sttScript, body.comment, body.pdfTime, body.settingTime, body.progressingTime);
    }

    @Post('qna')
    updateQna(@Body() body: any): Promise<Presentation> {
        return this.presentationService.updateQna(body.title, body.qna);
    }

    @Put('update-count')
    async updateWordCount(@Body('word') word: string): Promise<void> {
      await this.presentationService.updateWordCount(word);
    }

}