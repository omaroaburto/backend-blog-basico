import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UploadProjectDto {
  @IsUUID('all',{each:true})
  @IsOptional()
  @IsArray()
  images?: string[];
}
