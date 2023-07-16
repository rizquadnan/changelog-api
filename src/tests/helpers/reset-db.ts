import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export default async () => {
  await prisma.$transaction([
    prisma.updatePoint.deleteMany(),
    prisma.update.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ])
}