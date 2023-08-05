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
    async getPresentationData(@Query('title') title: string, @Query('userId') userId: string): Promise<string> {
        const result = await this.presentationService.findOneByTitle(title, userId);
        return JSON.stringify(result);
    }

    @Post('resultVideo')
    updatePresentationResultVideo(@Body() body: any): Promise<Presentation> {
        return this.presentationService.updateResultVideo(body.title, body.userId, body.resultVideo);
    }

    @Put('update-comment')
    async updateComment(@Body() data: any) {
        await this.presentationService.updateComment(data.title, data.userId, data.userComment);
    }

    @Get('pdf-url')
    getPdfUrl(@Query('title') title: string, @Query('userId') userId: string): Promise<string> {
        return this.presentationService.getPdfUrl(title, userId);
    }

    @Get('get-title')
    getTitle(@Query('userId') userId: string): Promise<string[]> {
        return this.presentationService.getTitle(userId);
    }

    @Get('is-title-exist')
    handleIsTitleExist(@Query('title') title: string, @Query('userId') userId: string): Promise<boolean> {
        return this.presentationService.isTitleExist(title, userId);
    }
}
