import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
    private s3: AWS.S3;
    
    constructor() {
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
            return result.Location;
        } catch (e) {
            throw new Error('Failed to upload file.');
        }
    }
}
