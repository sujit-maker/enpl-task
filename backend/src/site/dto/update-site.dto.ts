import { IsOptional, IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateSiteDto {
  @IsOptional()
  @IsString()
  siteName?: string;

   @IsNotEmpty()
    @IsString()
    siteAddress: string;
  
    @IsNotEmpty()
    @IsString()
    contactName: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  emailId?: string;

  @IsOptional()
  customerId?: number; 
}
