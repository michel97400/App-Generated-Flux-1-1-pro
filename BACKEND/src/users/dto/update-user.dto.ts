import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../dto/create-user.dto';
import { IsEmail, IsString, IsDateString, MinLength, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()  // ← Optionnel au lieu de IsNotEmpty
    userName?: string;
  
    @IsString()
    @IsOptional()
    userLastname?: string;
  
    @IsEmail()
    @IsOptional()
    userEmail?: string;
  
    @IsString()
    @MinLength(8)
    @IsOptional()
    usersPassword?: string;
  
    @IsDateString()
    @IsOptional()
    userBirthdate?: string;

    @IsDateString()
    @IsOptional()
    userAcceptedPolicy?: string;
    
    @IsBoolean()
    @IsOptional()
    userIsadult?: boolean;

    @IsString()
    @IsOptional()
    userContentFilter?: string;
}