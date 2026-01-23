import { prisma } from '../lib/prisma'

async function main() {}

main().then(async () => {
  await prisma.$disconnect()
})
