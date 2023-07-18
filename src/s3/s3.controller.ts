import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('s3')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) { }
    
    @ApiOperation({summary : 'S3 영상 업로드'})
    @Post()
    @UseInterceptors(FileInterceptor('video'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        return this.s3Service.uploadFile(file);
    }
}
