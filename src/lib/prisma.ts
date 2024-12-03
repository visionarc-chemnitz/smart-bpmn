import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from "@neondatabase/serverless";

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter: new PrismaNeon(new Pool()) });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
