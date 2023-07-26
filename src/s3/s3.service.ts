import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { CreateVideoDTO } from 'src/video/dto/create-video.dto';
import { VideoService } from 'src/video/video.service';

@Injectable()
export class S3Service {
    private s3: AWS.S3;
    
    //videoService를 이용하기 위해 추가
    constructor(private videoService: VideoService) {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_BUCKET_REGION,
        });  
    }

    async uploadFile(file: Express.Multer.File) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: String(file.originalname),
            Body: file.buffer,
        };

        try {
            const result = await this.s3.upload(params).promise();

            // createVideoDTO 생성
            const videoData: CreateVideoDTO = new CreateVideoDTO();
            videoData.id = "test";
            videoData.filename = String(file.originalname);
            videoData.fileurl = result.Location;

            // video 데이터베이스에 삽입
            return this.videoService.createVideo(videoData);
        } catch (e) {
            throw new Error('Failed to upload file.');
        }
    }

    async uploadPdf(file: Express.Multer.File) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: String(file.originalname),
            Body: file.buffer,
        };

        try {
            const result = await this.s3.upload(params).promise();
            return result.Location;
        } catch (e) {
            throw new Error('Failed to upload file.');
        }
    }
}
