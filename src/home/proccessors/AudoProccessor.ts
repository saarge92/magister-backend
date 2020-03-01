import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FileService } from '../../shared/services/file.service';

@Processor('audio')
export class AudioConsumer {
  constructor(private readonly fileService: FileService) {
  }

  @Process('audio-create')
  async saveAudio(job: Job<any>) {
    const data = job.data;
    const pathForSave = 'public/music/' + Date.now() + '.mp3';
    await this.fileService.saveFile(pathForSave, data.fileSave);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log(err);
  }
}

