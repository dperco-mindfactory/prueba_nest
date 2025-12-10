
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
   
    return this.prisma.task.create({ data: createTaskDto });
  }

  findAll() {
    return this.prisma.task.findMany();
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada.`);
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number) {
   
    await this.findOne(id);
    return this.prisma.task.delete({ where: { id } });
  }
}