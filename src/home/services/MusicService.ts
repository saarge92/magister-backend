import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from '../dto/create-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Music } from '../../entities/music.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

/**
 * Service for working with music
 * @copyright Picasso
 */
@Injectable()
export class MusicService {
  constructor(@InjectRepository(Music) private readonly musicRepository: Repository<Music>,
              @InjectQueue('audio') private readonly audioQueue: Queue) {
  }

  /**
   * Create music in database
   * @param musicDto Data about music creation
   * @param file Created file
   */
  public async postMusic(musicDto: CreateMusicDto, file: any): Promise<Music> {
    const createdMusic = this.musicRepository.create();
    createdMusic.name = musicDto.name;
    await this.musicRepository.save(createdMusic);
    await this.audioQueue.add('audio-create', {
      fileSave: file,
      music: createdMusic,
    }, {
      attempts: 1,
    });
    return createdMusic;
  }
}