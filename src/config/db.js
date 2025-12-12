
import  { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

 export const connectDB = async () => {
    try {
      await prisma.$connect();
        console.log("connected via prisma");
    } catch (error) {
        console.error(`Database Connection errors: ${error.message}`);
        process.exit(1);
    }
};

export const disconnectDb = async () => {
    await prisma.$disconnect();
};

