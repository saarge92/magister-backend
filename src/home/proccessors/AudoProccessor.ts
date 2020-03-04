import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FileService } from '../../shared/services/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Music } from '../../entities/music.entity';
import { Repository } from 'typeorm';

@Processor('audio')
export class AudioConsumer {
  constructor(private readonly fileService: FileService, @InjectRepository(Music) private readonly musicRepository: Repository<Music>) {
  }

  @Process('audio-create')
  async saveAudio(job: Job<any>): Promise<void> {
    const data = job.data;
    const pathForSave = 'public/music/' +
      this.fileService.generateFileName(data.fileSave.originalname);
    await this.fileService.saveFile(pathForSave, data.fileSave);
    job.data.music.fileName = pathForSave;
    await this.musicRepository.save(job.data.music);
  }

  @OnQueueFailed()
  async handler(job: Job, err: Error) {
    console.log(err);
  }
}

