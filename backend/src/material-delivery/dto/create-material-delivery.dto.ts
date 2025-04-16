import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
  @IsString()
  serialNumber: string;

  @IsString()
  macAddress: string;

  @IsInt()
  productId: number;

  @IsInt()
  inventoryId: number;
}

export class CreateMaterialDeliveryDto {
  @IsString()
  deliveryType: string;

  @IsOptional()
  @IsString()
  refNumber: string;

  @IsInt()
  customerId: number;

  @IsOptional()
  @IsInt()
  vendorId?: number;

  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
