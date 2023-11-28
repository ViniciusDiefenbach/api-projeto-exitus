import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { hash, hashSync } from 'bcrypt';
import admin_seed from '../config/admin_seed.json';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { role_type: 'ADMIN' },
    update: {},
    create: {
      role_type: 'ADMIN',
    },
  });
  await prisma.role.upsert({
    where: { role_type: 'GUARDED' },
    update: {},
    create: {
      role_type: 'GUARDED',
    },
  });
  await prisma.role.upsert({
    where: { role_type: 'GUARDIAN' },
    update: {},
    create: {
      role_type: 'GUARDIAN',
    },
  });
  await prisma.role.upsert({
    where: { role_type: 'EMPLOYEE' },
    update: {},
    create: {
      role_type: 'EMPLOYEE',
    },
  });
  console.log('The roles were created successfully!');
  await prisma.user.upsert({
    where: { email: admin_seed.admin_login_email },
    update: {},
    create: {
      active: true,
      name: admin_seed.admin_login_name,
      email: admin_seed.admin_login_email,
      fingerprint: admin_seed.admin_login_fingerprint ?? randomUUID(),
      password: await hash(admin_seed.admin_login_password, 10),
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
  await prisma.user.upsert({
    where: { email: 'viniciusdiefenbach@gmail.com' },
    create: {
      active: true,
      name: 'Vinicius Diefenbach',
      email: 'viniciusdiefenbach@gmail.com',
      fingerprint: randomUUID(),
      password: hashSync('123456', 10),
      roles: {
        create: {
          role: {
            connect: {
              role_type: 'EMPLOYEE',
            },
          },
          created_at: new Date(),
        },
      },
    },
    update: {},
  });
  console.log('The employee was created successfully!');
  const student_alone = await prisma.user.upsert({
    where: { email: 'kauesoares@gmail.com' },
    create: {
      active: true,
      name: 'Kauê Soares',
      email: 'kauesoares@gmail.com',
      fingerprint: randomUUID(),
      enrollment: '20231sg.inf_i0007',
      birth: new Date('2003-12-17'),
      shift: 'AFTERNOON',
      password: hashSync('123456', 10),
      roles: {
        create: {
          role: {
            connect: {
              role_type: 'GUARDED',
            },
          },
        },
      },
    },
    update: {},
  });
  let _1 = randomUUID();
  let _2 = randomUUID();
  let _3 = randomUUID();
  let _4 = randomUUID();
  await prisma.register.upsert({
    create: {
      id: _1,
      register_type: 'IN',
      user_id: student_alone.id,
    },
    where: {
      id: _1,
    },
    update: {},
  });
  await prisma.register.upsert({
    create: {
      id: _2,
      register_type: 'OUT',
      user_id: student_alone.id,
    },
    where: {
      id: _2,
    },
    update: {},
  });
  await prisma.register.upsert({
    create: {
      id: _3,
      register_type: 'IN',
      user_id: student_alone.id,
    },
    where: {
      id: _3,
    },
    update: {},
  });
  await prisma.register.upsert({
    create: {
      id: _4,
      register_type: 'OUT',
      user_id: student_alone.id,
    },
    where: {
      id: _4,
    },
    update: {},
  });
  console.log('The first student (alone) was created successfully!');
  const student_1 = await prisma.user.upsert({
    where: { email: 'pauloantonio@gmail.com' },
    create: {
      active: true,
      name: 'Paulo Antônio',
      email: 'pauloantonio@gmail.com',
      fingerprint: randomUUID(),
      enrollment: '20201sg.inf_i0069',
      birth: new Date('2002-12-25'),
      shift: 'AFTERNOON',
      password: hashSync('123456', 10),
      roles: {
        create: {
          role: {
            connect: {
              role_type: 'GUARDED',
            },
          },
        },
      },
    },
    update: {},
  });

  _1 = randomUUID();
  _2 = randomUUID();
  _3 = randomUUID();
  _4 = randomUUID();
  await prisma.register.upsert({
    create: {
      id: _1,
      register_type: 'IN',
      user_id: student_1.id,
    },
    where: {
      id: _1,
    },
    update: {},
  });
  await prisma.register.upsert({
    create: {
      id: _2,
      register_type: 'OUT',
      user_id: student_1.id,
    },
    where: {
      id: _2,
    },
    update: {},
  });
  await prisma.register.upsert({
    create: {
      id: _3,
      register_type: 'IN',
      user_id: student_1.id,
    },
    where: {
      id: _3,
    },
    update: {},
  });
  await prisma.register.upsert({
    create: {
      id: _4,
      register_type: 'OUT',
      user_id: student_1.id,
    },
    where: {
      id: _4,
    },
    update: {},
  });

  const student_2 = await prisma.user.upsert({
    where: { email: 'nairasouza@gmail.com' },
    create: {
      active: true,
      name: 'Naira Souza',
      email: 'nairasouza@gmail.com',
      fingerprint: randomUUID(),
      enrollment: '20231sg.inf_i0095',
      birth: new Date('2010-06-12'),
      shift: 'MORNING',
      password: hashSync('123456', 10),
      roles: {
        create: {
          role: {
            connect: {
              role_type: 'GUARDED',
            },
          },
        },
      },
    },
    update: {},
  });

  _1 = randomUUID();
  _2 = randomUUID();
  _3 = randomUUID();
  _4 = randomUUID();
  await prisma.register.upsert({
    create: {
      id: _1,
      register_type: 'IN',
      user_id: student_2.id,
    },
    where: {
      id: _1,
    },
    update: {},
  });
  await prisma.register.upsert({
    create: {
      id: _2,
      register_type: 'OUT',
      user_id: student_2.id,
    },
    where: {
      id: _2,
    },
    update: {},
  });
  await prisma.register.upsert({
    create: {
      id: _3,
      register_type: 'IN',
      user_id: student_2.id,
    },
    where: {
      id: _3,
    },
    update: {},
  });
  await prisma.register.upsert({
    create: {
      id: _4,
      register_type: 'OUT',
      user_id: student_2.id,
    },
    where: {
      id: _4,
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { email: 'augustopereira@gmail.com' },
    create: {
      active: true,
      name: 'Augusto Pereira',
      email: 'augustopereira@gmail.com',
      fingerprint: randomUUID(),
      password: hashSync('123456', 10),
      roles: {
        create: {
          role: {
            connect: {
              role_type: 'GUARDIAN',
            },
          },
        },
      },
      guardeds: {
        createMany: {
          data: [
            {
              guarded_id: student_1.id,
            },
            {
              guarded_id: student_2.id,
            },
          ],
        },
      },
    },
    update: {},
  });
  console.log('The guardian with 2 guardeds were created successfully!');
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
