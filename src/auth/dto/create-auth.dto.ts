import { IsEmail, IsString, MinLength, Matches, MaxLength } from 'class-validator'; 
export class CreateAuthDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
