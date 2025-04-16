import {
    IsOptional,
    IsString,
    IsDateString,
    IsInt,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class UpdateContractInventoryDto {
    @IsString()
    inventoryType: string;
  
    @IsString()
    inventoryName: string;

    @IsString()
    productName: string;
  
    @IsString()
    serialno: string;
  
    @IsString()
    macAddress: string;
  
    @IsDateString()
    dateOfPurchase: string;
  
    @IsString()
    remark: string;
  }
  
  export class UpdateServiceContractDto {
    @IsOptional()
    @IsInt()
    customerId?: number;

    @IsOptional()
    @IsString()
    contractNo?: string;
  
    @IsOptional()
    @IsInt()
    siteId?: number;
  
    @IsOptional()
    @IsString()
    relmanager?: string;
  
    @IsOptional()
    @IsString()
    serviceCategory?: string;
  
    @IsOptional()
    @IsDateString()
    startDate?: string;
  
    @IsOptional()
    @IsDateString()
    endDate?: string;
  
    @IsOptional()
    @IsString()
    visitSite?: string;
  
    @IsOptional()
    @IsString()
    maintenanceVisit?: string;
  
    @IsOptional()
    @IsString()
    contractDescription?: string;
  
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateContractInventoryDto)
    contractInventories?: UpdateContractInventoryDto[];
  }
  