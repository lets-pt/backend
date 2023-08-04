import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { PresentationService } from 'src/presentation/presentation.service';
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

      // 비디오 프레임의 크기를 파악합니다.
      const screenVideoInfo = await this.getVideoInfo(screenTempFilePath);

      // 비디오 프레임의 가로 크기와 세로 크기를 가져옵니다.
      const screenWidth = screenVideoInfo.width;
      const screenHeight = screenVideoInfo.height;
      console.log("프레임크기확인")
      console.log(screenWidth,screenHeight)

      // 화면의 크기
      const XSize = screenWidth*0.52
      const YSize = screenHeight*0.52
      console.log("화면사이즈확인")
      console.log(XSize,YSize)
      
      // screen 비디오의 crop 좌표 계산
      const screenCropX = screenWidth*0.08
      const screenCropY = screenHeight*0.23
      console.log("좌표확인")
      console.log(screenCropX,screenCropY)


      // 임시 출력파일
      const combinedVideoFilename = userId + cam.originalname.substring(10);
      const combinedVideoFilePath = tmp.tmpNameSync({ postfix: '.mp4' });

      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(camTempFilePath)
          .input(screenTempFilePath)
          .complexFilter(
            [
              // cam 비디오는 crop 필터 적용하지 않음
              {
                filter: 'crop',
                options: `${XSize}:${YSize}:${screenCropX}:${screenCropY}`,
                inputs: '1:v',
                outputs: 'cropped_screen',
              },
              {
                filter: 'scale',
                options: '640:360',
                inputs: '0:v',
                outputs: 'scaled_cam',
              },
              {
                filter: 'scale',
                options: '640:360',
                inputs: 'cropped_screen',
                outputs: 'scaled_screen',
              },
              {
                filter: 'vstack',
                inputs: ['scaled_screen', 'scaled_cam'],
                outputs: 'output_video',
              },
            ],
            'output_video'
          )
          .outputOptions('-map', '0:a')
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

  // 비디오 파일 정보를 가져오는 메서드
  private getVideoInfo(filePath: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err: Error, data: any) => {
        if (err) {
          reject(err);
        } else {
          const videoStream = data.streams.find((s: any) => s.codec_type === 'video');
          if (videoStream) {
            const width = videoStream.width;
            const height = videoStream.height;
            resolve({ width, height });
          } else {
            reject(new Error('Video stream not found.'));
          }
        }
      });
    });
  }
}
