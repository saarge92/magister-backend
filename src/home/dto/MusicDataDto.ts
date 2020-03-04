import { ReadStream } from 'fs';

/**
 * Interface for recieveing information
 * about stream of file music
 */
export interface MusicDataDto {
  dataStream: ReadStream;
  sizeRead: number;
  start?: number;
  end?: number;
}