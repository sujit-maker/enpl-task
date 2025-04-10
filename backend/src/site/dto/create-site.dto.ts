import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateSiteDto {
  @IsNotEmpty()
  @IsString()
  siteId: string;

  @IsNotEmpty()
  @IsString()
  siteName: string;

  @IsNotEmpty()
  @IsString()
  siteAddress: string;

  @IsNotEmpty()
  @IsString()
  contactName: string;

  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @IsNotEmpty()
  @IsEmail()
  emailId: string;

  @IsNotEmpty()
  customerId: number; 
}
