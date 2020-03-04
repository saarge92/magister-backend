import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MusicDataDto } from '../dto/MusicDataDto';
import * as fs from 'fs';

/**
 * Class Service for working with files of music
 * @copyright Serdar Durdyev
 */
@Injectable()
export class MusicFileService {

  /**
   * Get stream data information about music file
   * @param filePath Path for file music
   * @param range Range of bytes for streaming
   * @retuns {Promise<MusicDataDto>} Data about stream information
   */
  async getStreamData(filePath: string, range: string): Promise<MusicDataDto> {
    const stats = fs.statSync(filePath);
    let readStream = null;
    const resultResponse = {} as MusicDataDto;
    if (range !== undefined) {
      const parts = range.replace(/bytes=/, '').split('-');
      const partialStart = parts[0];
      const partialEnd = parts[1];

      // tslint:disable-next-line:radix
      if ((isNaN(parseInt(partialStart)) && partialStart.length > 1) || (isNaN(parseInt(partialEnd)) && partialEnd.length > 1)) {
        throw new HttpException('Ошибка парсинга', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const start = parseInt(partialStart, 10);
      const end = partialEnd ? parseInt(partialEnd, 10) : stats.size - 1;
      const contentLength = (end - start) + 1;

      readStream = fs.createReadStream(filePath, { start, end });
      resultResponse.dataStream = readStream;
      resultResponse.start = start;
      resultResponse.end = end;
      resultResponse.sizeRead = stats.size;
    } else {
      readStream = fs.createReadStream(filePath);
      resultResponse.sizeRead = stats.size;
      resultResponse.dataStream = readStream;
    }
    return resultResponse;
  }
}