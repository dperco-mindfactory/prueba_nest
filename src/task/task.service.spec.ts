import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service'; 


const mockPrismaService = {
  task: {
   
  },
};

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
      
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

 
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});