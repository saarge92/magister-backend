import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { MusicService } from '../services/MusicService';

@Controller('api/music')
export class MusicControllerController {

  constructor(private readonly musicService: MusicService) {
  }

  @Get('/')
  public async getMusic(@Req() request: Request, @Res() response: Response) {
    let readStream = null;
    const filePath = 'src/public/music/might notf.mp3';
    let stat = fs.statSync(filePath);
    let range = request.headers.range;
    if (range !== undefined) {
      let parts = range.replace(/bytes=/, '').split('-');
      let partial_start = parts[0];
      let partial_end = parts[1];

      if ((isNaN(parseInt(partial_start)) && partial_start.length > 1) || (isNaN(parseInt(partial_end)) && partial_end.length > 1)) {
        return response.sendStatus(500);
      }
      var start = parseInt(partial_start, 10);
      var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
      var content_length = (end - start) + 1;

      response.status(206).header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': content_length,
        'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size,
      });

      readStream = fs.createReadStream(filePath, { start: start, end: end });
    } else {
      response.header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
      });
      readStream = fs.createReadStream(filePath);
    }
    readStream.pipe(response);
  }

  /**
   * Create music & save in our system
   * @param createMusicDto Object
   * @param file File of music for saving
   * @param response Response of music creation status
   */
  @Post('/')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter(req: any, file: any, callback: Function) {
      if (!file.originalname.match(/\.(mp3|mpeg)$/)) {
        return callback(new HttpException('Доступны только аудиофайлы', HttpStatus.BAD_REQUEST), false);
      }
      return callback(null, true);
    },
  }))
  public async postMusic(@Body()createMusicDto, @UploadedFile()file, @Req() request: Request, @Res() response: Response) {
    const createdMusic = await this.musicService.postMusic(createMusicDto, file);
    return response.status(HttpStatus.OK).json({
      id: createdMusic.id,
    });
  }
}