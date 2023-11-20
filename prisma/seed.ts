import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { hash } from 'bcrypt';
import admin_seed from '../config/admin_seed.json';

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
    where: { email: admin_seed.admin_login_email },
    update: {},
    create: {
      id: randomUUID(),
      active: true,
      name: admin_seed.admin_login_name,
      email: admin_seed.admin_login_email,
      fingerprint: admin_seed.admin_login_fingerprint ?? randomUUID(),
      password: await hash(admin_seed.admin_login_password, 10),
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
