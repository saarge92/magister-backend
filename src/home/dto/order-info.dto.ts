import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class OrderInfoDto {
  @IsNotEmpty()
  @IsString()
  idService: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}

export interface BodyInfoDto {
  info: Array<OrderInfoDto>;
}
