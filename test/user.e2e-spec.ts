import supertest from "supertest";

describe("UserController (e2e)", () => {
    let app = supertest("http://localhost:3000");
    let userId: string;

    it("/user (POST)", async () => {
        const result = await app.post("/user")
            .send({
                "active": false,
                "name": "John Doe",
                "email": "johndoe@mail.com",
                "password": "123456",
                "fingerprint": "john doe fingerprint",
                "enrollment": "john doe enrollment",
                "birth": "2005-01-01",
                "shift": "MORNING",
            })

        userId = result.body.id;

        expect(result.status).toBe(201);
        expect(result.body.id).toBeDefined();
        expect(result.body.active).toBe(false);
        expect(result.body.name).toBe("John Doe");
        expect(result.body.password != "123456").toBeTruthy();
    });

    it("/user (DELETE)", async () => {
        const result = await app.delete(`/user/${userId}`);

        expect(result.status).toBe(200);
        expect(result.body.id).toBe(userId);
    });
})