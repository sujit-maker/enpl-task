import { IsInt, IsString } from 'class-validator';

export class CreateMaterialDeliveryDto {
  @IsString()
  deliveryType: string;

  @IsString()
  deliveryChallan: string;

  @IsString()
  refNumber: string;

  @IsInt()
  customerId: number;

  @IsInt()
  vendorId: number;

  @IsInt()
  inventoryId: number;

  @IsInt()
  productId: number;
}
