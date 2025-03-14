import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

const onPrismaConnect = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
};

export { prisma, onPrismaConnect };
