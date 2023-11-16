import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { role_type: 'ADMIN' },
    update: {},
    create: {
      id: randomUUID(),
      role_type: 'ADMIN',
      created_at: new Date(),
    },
  });
  await prisma.role.upsert({
    where: { role_type: 'GUARDED' },
    update: {},
    create: {
      id: randomUUID(),
      role_type: 'GUARDED',
      created_at: new Date(),
    },
  });
  await prisma.role.upsert({
    where: { role_type: 'GUARDIAN' },
    update: {},
    create: {
      id: randomUUID(),
      role_type: 'GUARDIAN',
      created_at: new Date(),
    },
  });
  await prisma.role.upsert({
    where: { role_type: 'EMPLOYEE' },
    update: {},
    create: {
      id: randomUUID(),
      role_type: 'EMPLOYEE',
      created_at: new Date(),
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
      password: await hash('admin', 10),
      created_at: new Date(),
      roles: {
        create: {
          role: {
            connect: {
              role_type: 'ADMIN',
            },
          },
          created_at: new Date(),
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
