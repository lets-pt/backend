import { Controller, Post, UploadedFiles, UseInterceptors,Body } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { FfmpegService } from './ffmpeg.service';

@Controller('ffmpeg')
export class FfmpegController {
    constructor(private readonly ffmpegService: FfmpegService) { }
    
    @ApiOperation({ summary: '2개의 영상 , 1개 스트링 처리' })
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
        ]))

        recieveFiles(
            @UploadedFiles() files: { cam?: Express.Multer.File, screen?: Express.Multer.File },
            @Body('title') title: string,
            @Body('userId') userId: string,
          ) {
            console.log(files.cam[0]);
            console.log(files.screen[0]);
            console.log(title);
            return this.ffmpegService.recieveFiles(files.cam[0], files.screen[0], title, userId);
          }}
