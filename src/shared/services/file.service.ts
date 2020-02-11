import { Injectable } from '@nestjs/common';
import * as fileSystem from 'fs';

/**
 * File service for saving file on server
 * @author Serdar Durdyev
 */
@Injectable()
export class FileService {

  /**
   * Save file
   * @param directory Direrctory for save
   * @param file File for save
   */
  public async saveFile(directory: string, file: any): Promise<void> {
    const pathForSave = 'src/' + directory;
    const filestream = fileSystem.createWriteStream(pathForSave);
    filestream.write(file.buffer);
    filestream.end();
  }

  public async deleteFile(path: string) {
    const pathForDelete = 'src/' + path;
    await fileSystem.unlink(pathForDelete, (error) => {
    });
  }
}
