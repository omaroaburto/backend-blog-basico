import {
  IsString,
  IsUrl,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @MinLength(3)
  fullName: string;
  @IsString()
  @MinLength(1)
  description: string;
  @IsString()
  @MinLength(1)
  profession: string;
  @IsUrl()
  @IsOptional()
  image?: string;
}
