import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { v4 as uuidv4 } from 'uuid';
import * as tmp from 'tmp';
import * as fs from 'fs'; // 파일시스템 관련 모듈

const ffmpeg = require('fluent-ffmpeg'); // fluent-ffmpeg 라이브러리를 불러와 ffmpeg 변수에 할당

@Injectable()
export class FfmpegService {
  constructor(private s3Service: S3Service) {}

  async recieveFiles(cam: Express.Multer.File, screen: Express.Multer.File) {
    const inputCamBuffer = cam.buffer;
    const inputScreenBuffer = screen.buffer;

    if (!inputCamBuffer || !inputScreenBuffer) {
      console.error('Input video buffers are empty.');
      return;
    }

    try {
      // 임시 입력파일 생성 for 임시파일경로
      const camTempFilePath = tmp.tmpNameSync({ postfix: '.webm' });
      const screenTempFilePath = tmp.tmpNameSync({ postfix: '.webm' });

      // 파일의 버퍼를 임시 파일에 기록
      fs.writeFileSync(camTempFilePath, inputCamBuffer);
      fs.writeFileSync(screenTempFilePath, inputScreenBuffer);

      // 임시 출력파일
      const combinedVideoFilename = `${uuidv4()}.mp4`;
      const combinedVideoFilePath = tmp.tmpNameSync({ postfix: '.mp4' });

      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(camTempFilePath)
          .input(screenTempFilePath)
          .output(combinedVideoFilePath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .outputOptions('-vf', 'crop=1250:380:0:260')
          .format('mp4')
          .on('end', () => {
            resolve();
          })
          .on('error', (err) => {
            reject(err);
          })
          .run();
      });

    
      const combinedVideoBuffer = fs.readFileSync(combinedVideoFilePath);

      // 임시파일 삭제
      fs.unlinkSync(camTempFilePath);
      fs.unlinkSync(screenTempFilePath);
      fs.unlinkSync(combinedVideoFilePath);

      const modifiedCombinedVideoFilename = 'output_video.mp4'; // 파일이름

      // S3에 업로드
      await this.s3Service.uploadFile({
        fieldname: 'combinedVideo',
        originalname: combinedVideoFilename,
        encoding: '7bit',
        mimetype: 'video/mp4',
        buffer: combinedVideoBuffer,
        size: combinedVideoBuffer.length,
        stream: null,
        destination: null,
        filename: modifiedCombinedVideoFilename,
        path: null
      });

    } catch (err) {
      console.error('Error during FFmpeg processing:', err);
    }
  }
}
