import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';

export class GenerateImageDto {
  @IsString()
  @IsNotEmpty({ message: 'Le prompt est requis' })
  prompt: string;

  @IsOptional()
  @IsIn(['1024x1024', '1792x1024', '1024x1792'], {
    message: 'La taille doit être 1024x1024, 1792x1024 ou 1024x1792',
  })
  size?: string = '1024x1024';

  @IsOptional()
  @IsInt({ message: 'Le nombre d\'images doit être un entier' })
  @Min(1, { message: 'Le nombre d\'images doit être au minimum 1' })
  @Max(10, { message: 'Le nombre d\'images doit être au maximum 10' })
  n?: number = 1;

  @IsOptional()
  @IsString()
  theme?: string;
}
