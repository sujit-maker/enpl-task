import { IsNotEmpty, IsString, IsEmail, IsInt, IsOptional } from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  vendorName: string;

  @IsNotEmpty()
  @IsString()
  registerAddress: string;

  @IsNotEmpty()
  @IsString()
  gstNo: string;

  @IsNotEmpty()
  @IsString()
  contactName: string;

  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @IsNotEmpty()
  @IsEmail()
  emailId: string;

  @IsInt()
    @IsOptional()
    hodId?: number; 
  
    @IsInt()
    @IsOptional()
    managerId?: number; 
}
