import { IsEmail, IsString, IsDateString, MinLength, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  userLastname: string;

  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  usersPassword: string;

  @IsDateString()
  @IsNotEmpty()
  userBirthdate: string;

  @IsBoolean()
  @IsOptional()
  userIsadult?: boolean;

  @IsString()
  @IsOptional()
  userContentFilter?: string;

  @IsDateString()
  @IsNotEmpty()
  userAcceptedPolicy: string;
}
