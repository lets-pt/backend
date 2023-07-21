import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { FfmpegService } from './ffmpeg.service';

@Controller('ffmpeg')
export class FfmpegController {
    constructor(private readonly ffmpegService: FfmpegService) { }
    
    @ApiOperation({ summary: '2개의 영상 처리' })
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {
            name: 'cam',
            maxCount: 1,
        },
        {
            name: 'screen',
            maxCount: 1
        },
    ]),)
    recieveFiles(@UploadedFiles() files: {cam?: Express.Multer.File, screen?: Express.Multer.File}) {
        console.log(files.cam[0]);
        console.log(files.screen[0]);
        return this.ffmpegService.recieveFiles(files.cam[0], files.screen[0]);
    }
}
