
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  title: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean; 

  @IsNumber()
  @IsNotEmpty({ message: 'La tarea debe estar asignada a un usuario (authorId).' })
  authorId: number; 
}