

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';


const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockUsers = [
  { id: 1, email: 'user1@test.com', name: 'User One' },
  { id: 2, email: 'user2@test.com', name: 'User Two' },
];

describe('UserService', () => {
  let service: UserService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, 
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('debería crear un usuario exitosamente', async () => {
      const createUserDto = { email: 'new@test.com', name: 'New User' };
      const expectedUser = { id: 3, ...createUserDto };

      
      prisma.user.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: createUserDto });
    });
  });

  describe('findAll()', () => {
    it('debería devolver un array de usuarios', async () => {
      prisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('debería devolver un usuario si se encuentra', async () => {
      const user = mockUsers[0];
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(user.id);

      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: user.id } });
    });

    it('debería lanzar un NotFoundException si el usuario no se encuentra', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('debería eliminar un usuario exitosamente', async () => {
      const user = mockUsers[0];
      prisma.user.delete.mockResolvedValue(user);

      const result = await service.remove(user.id);

      expect(result).toEqual(user);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: user.id } });
    });
  });
});