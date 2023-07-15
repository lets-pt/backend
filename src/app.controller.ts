import { Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as childProcess from 'child_process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('video/merge')
  @UseInterceptors(FilesInterceptor('videos'))
  async mergeVideos(@UploadedFiles() videos) {
    // `videos`는 동영상 파일들의 배열이라고 가정합니다.

    // 고유한 출력 파일 이름 생성
    const outputFilename = `output_${Date.now()}.mp4`;

    // 동영상을 병합하기 위한 FFmpeg 명령어
    const command = `ffmpeg -i ${videos[0].path} -i ${videos[1].path} -filter_complex "[0:v]scale=iw/2:ih/2[pip];[1:v]scale=iw/2:ih/2[main];[main][pip]hstack=inputs=2" ${outputFilename}`;

    // FFmpeg 명령어 실행
    childProcess.execSync(command);

    // 출력 파일 이름 또는 경로를 응답으로 반환합니다.
    return { outputFile: outputFilename };
  }
}
