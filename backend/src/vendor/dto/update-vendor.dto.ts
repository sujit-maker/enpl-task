import { IsOptional, IsString, IsEmail, IsInt } from 'class-validator';

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  vendorName?: string;

  @IsOptional()
  @IsString()
  registerAddress?: string;

  @IsOptional()
  @IsString()
  gstNo?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  emailId?: string;

  @IsInt()
    @IsOptional()
    hodId?: number; 
  
    @IsInt()
    @IsOptional()
    managerId?: number; 
}
