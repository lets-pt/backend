import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { PresentationService } from 'src/presentation/presentation.service';
import { v4 as uuidv4 } from 'uuid';
import * as tmp from 'tmp';
import * as fs from 'fs';

const ffmpeg = require('fluent-ffmpeg');

@Injectable()
export class FfmpegService {
  constructor(private s3Service: S3Service, private presentationService: PresentationService) { }

  async recieveFiles(cam: Express.Multer.File, screen: Express.Multer.File, title: string, userId: string) {
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
      const combinedVideoFilename = userId + cam.originalname.substring(10);
      const combinedVideoFilePath = tmp.tmpNameSync({ postfix: '.mp4' });

      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(camTempFilePath)
          .input(screenTempFilePath)
          .complexFilter(
            [
              {
                filter: 'crop',
                // options: '650:280:30:260', //gram
                // options: '840:470:60:310', //mac
                options: '820:470:90:345',
                inputs: '1:v', // screen 영상에 crop 필터를 적용하기 위해 인덱스 1을 사용합니다.
                outputs: 'cropped_screen',
              },
              {
                filter: 'scale',
                options: '640:360', // 수정: cam 영상의 크기를 640x360으로 조정
                inputs: '0:v', // cam 영상
                outputs: 'scaled_cam',
              },
              {
                filter: 'scale',
                options: '640:280', // 수정: screen 영상의 크기를 640x280으로 조정
                inputs: 'cropped_screen', // screen 영상
                outputs: 'scaled_screen',
              },
              {
                filter: 'vstack',
                inputs: ['scaled_screen', 'scaled_cam'], // scaled_screen과 scaled_cam을 vstack으로 세로로 합칩니다.
                outputs: 'output_video', // 수정: complexFilter 결과로 새로운 스트림을 생성합니다.
              },
            ],
            'output_video' // 수정: complexFilter의 두 번째 인자와 매칭되어야 합니다.
          )
          .outputOptions('-map', '0:a') // cam 영상의 오디오 스트림을 선택
          .output(combinedVideoFilePath)
          .videoCodec('libx264')
          .audioCodec('aac')
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

      // S3에 업로드
      const result = await this.s3Service.uploadFile({
        fieldname: 'combinedVideo',
        originalname: combinedVideoFilename,
        encoding: '7bit',
        mimetype: 'video/mp4',
        buffer: combinedVideoBuffer,
        size: combinedVideoBuffer.length,
        stream: null,
        destination: null,
        filename: null,
        path: null,
      });

      await this.presentationService.updateResultVideo(title, result.fileurl);
      console.log("ffmpeg성공!")

    } catch (err) {
      console.error('Error during FFmpeg processing:', err);
    }
  }
}
