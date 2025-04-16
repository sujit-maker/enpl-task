import { IsInt, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateMaterialDeliveryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deliveryType?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deliveryChallan?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
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
