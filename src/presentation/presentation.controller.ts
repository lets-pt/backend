import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
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

    @Get()
    async getPresentationData(@Query('title') title: string): Promise<string> {
        const result = await this.presentationService.findOneByTitle(title);
        return JSON.stringify(result);
    }

    @Post('resultVideo')
    updatePresentationResultVideo(@Body() body: any): Promise<Presentation> {
        return this.presentationService.updateResultVideo(body.title, body.resultVideo);
    }

    @Post('update')
    updatePresentation(@Body() body: any): Promise<Presentation> {
        return this.presentationService.updatePresentation(body.title, body.sttScript, body.pdfTime, body.settingTime, body.progressingTime);
    }

    @Put('update-count')
    async updateWordCount(@Body('word') word: string): Promise<void> {
        await this.presentationService.updateWordCount(word);
    }

    @Put('update-comment')
    async updateComment(@Body() data: any) {
        await this.presentationService.updateComment(data.title, data.userComment);
    }

    @Get('pdf-url')
    getPdfUrl(@Query('title') title: string): Promise<string> {
        return this.presentationService.getPdfUrl(title);
    }
}
