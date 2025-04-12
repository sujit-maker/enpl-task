import { IsInt, IsString, IsOptional } from 'class-validator';

export class UpdateMaterialDeliveryDto {
  @IsOptional()
  @IsString()
  deliveryType?: string;

  @IsOptional()
  @IsString()
  deliveryChallan?: string;

  @IsOptional()
  @IsString()
  refNumber?: string;

  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  @IsInt()
  vendorId?: number;

  @IsOptional()
  @IsInt()
  inventoryId?: number;

  @IsOptional()
  @IsInt()
  productId?: number;
}
