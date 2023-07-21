import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class FfmpegService {
    constructor(private s3Service: S3Service) { }
    
    async recieveFiles(cam: Express.Multer.File, screen: Express.Multer.File) {
        //cam 영상 S3에 저장하기
        return this.s3Service.uploadFile(cam);

        //Todo: screen 영상 가공
        //Todo: cam 영상과 가공한 영상 합치기
        //Todo: 합친 영상 S3 업로드
    }
}
