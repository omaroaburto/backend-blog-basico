import {
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  IsDate,
} from 'class-validator';
import {Type} from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  title: string;
  @IsString()
  @MinLength(1)
  @IsOptional()
  slug?: string;
  @IsString()
  @MinLength(1)
  description: string;
  @IsDate()
  @Type(() => Date)
  date: Date;
  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  images?: string[];
}
