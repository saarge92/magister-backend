import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}