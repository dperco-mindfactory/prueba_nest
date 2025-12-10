
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El formato del email no es válido.' })
  @IsNotEmpty({ message: 'El email no puede estar vacío.' })
  email: string;

  @IsString()
  @IsOptional()
  name?: string;
}