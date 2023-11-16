import exp from 'constants';
import { async } from 'rxjs';
import supertest from 'supertest';

describe('AppController (e2e)', () => {
  let app = supertest('http://localhost:3000');
  let user1Id;
  let user2Id;
  let guardedRole;
  let guardianRole;
  let user1register1Id;
  let earlyExitId;

  describe('Create all entities', () => {
    it('should create a new user', async () => {
      await app
        .post('/user')
        .send({
          active: false,
          name: 'John Doe',
          email: 'johndoe@mail.com',
          password: '123456',
          fingerprint: 'john doe fingerprint',
          enrollment: 'john doe enrollment',
          birth: '2005-01-01',
          shift: 'MORNING',
        })
        .expect(201)
        .expect((res) => {
          user1Id = res.body.id;
          expect(res.body).toHaveProperty('id');
        });
    });

    it('should create a new user', async () => {
      await app
        .post('/user')
        .send({
          name: 'Bob Doe',
          email: 'bobdoe@mail.com',
          fingerprint: 'bob doe fingerprint',
          password: 'iambob',
        })
        .expect(201)
        .expect((res) => {
          user2Id = res.body.id;
          expect(res.body).toHaveProperty('id');
        });
    });

    it('should create a guard relation between user1 and user2', async () => {
      await app
        .post('/guard-relation')
        .send({
          guarded_id: user1Id,
          guardian_id: user2Id,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('created_at');
        });
    });

    it('should asign user1 to a guarded role', async () => {
      await app
        .get('/role')
        .expect(200)
        .expect((res) => {
          expect(res.body[0]).toHaveProperty('id');
          guardedRole = res.body.find(
            (role) => role.role_type === 'GUARDED',
          ).id;
        });
      await app
        .post('/user-role-relation')
        .send({
          user_id: user1Id,
          role_id: guardedRole,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('created_at');
        });
    });

    it('should asign user2 to a guardian role', async () => {
      await app
        .get('/role')
        .expect(200)
        .expect((res) => {
          expect(res.body[0]).toHaveProperty('id');
          guardianRole = res.body.find(
            (role) => role.role_type === 'GUARDIAN',
          ).id;
        });
      await app
        .post('/user-role-relation')
        .send({
          user_id: user2Id,
          role_id: guardianRole,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('created_at');
        });
    });

    it('should create an early exit', async () => {
      await app
        .post('/early-exit')
        .send({
          start_at: '2021-01-01T00:00:00.000Z',
          end_at: '2024-01-01T00:00:00.000Z',
          time: '2021-01-01T13:30:00.000Z',
          guarded_id: user1Id,
          guardian_id: user2Id,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          earlyExitId = res.body.id;
        });
    });

    it('should create a register', async () => {
      await app
        .post('/register')
        .send({
          user_id: user1Id,
          regiter_type: 'IN',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          user1register1Id = res.body.id;
        });
    });
  });

  // describe('Delete all entities', () => {
  //   it('should delete the register', async () => {
  //     await app.delete(`/register/${user1register1Id}`);
  //   });

  //   it('should delete the early exit', async () => {
  //     await app
  //       .delete(`/early-exit/${earlyExitId}`)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body).toHaveProperty('id');
  //       });
  //   });

  //   it('should delete the user2-role-relation', async () => {
  //     await app.delete(
  //       `/user-role-relation?role=${guardianRole}&user=${user2Id}`,
  //     );
  //   });

  //   it('should delete the user1-role-relation', async () => {
  //     await app.delete(
  //       `/user-role-relation?role=${guardedRole}&user=${user1Id}`,
  //     );
  //   });

  //   it('should delete the guard relation between user1 and user2', async () => {
  //     await app.delete(
  //       `/guard-relation?guardian=${user2Id}&guarded=${user1Id}`,
  //     );
  //   });

  //   it('should delete a user', async () => {
  //     await app
  //       .delete(`/user/${user1Id}`)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body).toHaveProperty('id');
  //       });
  //   });

  //   it('should delete a user', async () => {
  //     await app
  //       .delete(`/user/${user2Id}`)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body).toHaveProperty('id');
  //       });
  //   });
  // });
});
