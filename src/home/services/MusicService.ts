import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMusicDto } from '../dto/create-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Music } from '../../entities/music.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { FileService } from '../../shared/services/file.service';
import * as fs from 'fs';
import { MusicDataDto } from '../dto/MusicDataDto';
import { MusicFileService } from './MusicFileService';
import { User } from '../../entities/user.entity';
import { IMusicService } from '../interfaces/i-music-service';

/**
 * Service for working with music
 * @copyright Serdar Durdyev
 */
@Injectable()
export class MusicService implements IMusicService {
  constructor(@InjectRepository(Music) private readonly musicRepository: Repository<Music>,
    @InjectQueue('audio') private readonly audioQueue: Queue, private readonly fileService: FileService,
    private readonly musicFileService: MusicFileService) {
  }

  /**
   * Create music in database
   * @param musicDto Data about music creation
   * @param file Created file
   */
  public async postMusic(musicDto: CreateMusicDto, file: any, currentUser: User): Promise<Music> {
    const createdMusic = this.musicRepository.create();
    createdMusic.name = musicDto.name;
    createdMusic.user_id = currentUser.id;
    await this.musicRepository.save(createdMusic);

    await this.audioQueue.add('audio-create', {
      fileSave: file,
      music: createdMusic,
    }, {
      attempts: 1,
      delay: 1000,
    });
    return createdMusic;
  }

  /**
   * Get music stream by id of music
   * @param id Id of music
   * @param range Range of bytes for streaming
   */
  public async getMusicById(id: string, range?: string): Promise<MusicDataDto> {

    const music = await this.musicRepository.findOne(id);
    if (!music) throw new HttpException('Аудио файл не найден', HttpStatus.BAD_REQUEST);
    if (!music.fileName) throw new HttpException('Путь к файлу не задан', HttpStatus.BAD_REQUEST);

    const filePath = 'src/' + music.fileName;
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) throw new HttpException('Файл отсутсвует', HttpStatus.BAD_REQUEST);

    const resultResponse = await this.musicFileService.getStreamData(filePath, range);

    return resultResponse;
  }
}
