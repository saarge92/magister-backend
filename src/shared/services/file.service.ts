import { Injectable } from '@nestjs/common';
import * as fileSystem from 'fs';

/**
 * File service for saving file on server
 * @author Serdar Durdyev
 */
@Injectable()
export class FileService {
  public async saveFile(directory: string, file: any): Promise<void> {
    const pathForSave = 'src/' + directory;
    const filestream = fileSystem.createWriteStream(pathForSave);
    filestream.write(file.buffer);
    filestream.end();
  }
}