export interface OrderInfoDto {
  idService: number;
  quantity: number;
}

export interface BodyInfoDto {
  info: Array<OrderInfoDto>;
}
