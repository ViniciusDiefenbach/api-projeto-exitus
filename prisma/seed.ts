import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { role_type: 'ADMIN' },
    update: {},
    create: {
      id: randomUUID(),
      role_type: 'ADMIN',
    },
  });
  await prisma.role.upsert({
    where: { role_type: 'GUARDED' },
    update: {},
    create: {
      id: randomUUID(),
      role_type: 'GUARDED',
    },
  });
  await prisma.role.upsert({
    where: { role_type: 'GUARDIAN' },
    update: {},
    create: {
      id: randomUUID(),
      role_type: 'GUARDIAN',
    },
  });
  await prisma.role.upsert({
    where: { role_type: 'EMPLOYEE' },
    update: {},
    create: {
      id: randomUUID(),
      role_type: 'EMPLOYEE',
    },
  });
  console.log('The roles were created successfully!');
  await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      id: randomUUID(),
      active: true,
      name: 'Admin',
      email: 'admin@mail.com',
      fingerprint: 'admin',
      password: 'admin',
      roles: {
        create: {
          role: {
            connect: {
              role_type: 'ADMIN',
            },
          },
        },
      },
    },
  });
  console.log('The admin was created successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
