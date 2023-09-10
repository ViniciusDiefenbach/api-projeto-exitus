import supertest from 'supertest';

describe('AppController (e2e)', () => {
  let app = supertest('http://localhost:3000');

  it('/ (GET)', async () => {
    await app.get('/').expect(200).expect('Hello World!');
  });
});
