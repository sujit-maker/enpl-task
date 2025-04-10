import { IsOptional, IsString, IsEmail, IsInt } from 'class-validator';

export class UpdateCustomerDto {

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

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
      hodId: number;
    
      @IsInt()
      managerId?: number;
    
      @IsInt()
      executiveId?: number;
}
