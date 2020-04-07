import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus, Param,
  Post,
  Req,
  Res,
  UploadedFile, UseGuards,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalGuard } from '../../guards/local.guard';
import { User } from '../../entities/user.entity';
import { MUSIC_SERVICE } from '../constans/home-constants';
import { IMusicService } from '../interfaces/i-music-service';

/**
 * Controller for serving requests for music data
 * @copyright Serdar Durdyev
 */
@Controller('api/music')
@UseGuards(LocalGuard)
export class MusicControllerController {

  constructor(@Inject(MUSIC_SERVICE) private readonly musicService: IMusicService) {
  }

  /**
   * Get stream of music by id of music
   * @param id Id music in database
   * @param response Response for client
   * @param request Request data
   */
  @Get('/:id')
  public async getMusic(@Param('id') id: string, @Res() response: Response, @Req() request: Request) {
    const musicStreamData = await this.musicService.getMusicById(id, request.headers.range);
    if (request.headers.range !== undefined) {
      response.status(HttpStatus.PARTIAL_CONTENT).header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': musicStreamData.sizeRead,
        'Content-Range': 'bytes ' + musicStreamData.start + '-' + musicStreamData.end + '/' + musicStreamData.sizeRead,
      });
    } else {
      response.header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': musicStreamData.sizeRead,
      });
    }
    musicStreamData.dataStream.pipe(response);
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
  public async postMusic(@Body() createMusicDto, @UploadedFile() file, @Req() request: Request, @Res() response: Response) {
    const createdMusic = await this.musicService.postMusic(createMusicDto, file, request.user as User);
    return response.status(HttpStatus.OK).json({
      id: createdMusic.id,
    });
  }
}