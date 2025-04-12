import { IsNotEmpty, IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

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

  @IsArray()
  @IsString({ each: true }) // Validate each contact name as a string
  @IsOptional() // Optional because you may pass an empty array or not pass anything
  contactName: string[];

  @IsArray()
  @IsString({ each: true }) // Validate each contact number as a string
  @IsOptional()
  contactNumber: string[];

  @IsArray()
  @IsEmail({}, { each: true }) // Validate each email as an email
  @IsOptional()
  emailId: string[];

  @IsNotEmpty()
  customerId: number; 
}
