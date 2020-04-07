import { CreateMusicDto } from '../dto/create-music.dto';
import { User } from '../../entities/user.entity';
import { Music } from '../../entities/music.entity';
import { MusicDataDto } from '../dto/MusicDataDto';

/**
 * Interface-contract for music service
 * which contains business logic with music
 * @copyright Serdar Durdyev
 */
export interface IMusicService {
  postMusic(musicDto: CreateMusicDto, file: any, currentUser: User): Promise<Music>;

  getMusicById(id: string, range?: string): Promise<MusicDataDto>;
}