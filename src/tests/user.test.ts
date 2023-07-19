import { describe, expect, it } from "vitest";
import request from "supertest"
import app from "../server"
import { hashPasswordSync, verifyToken } from "../modules/auth";
import prisma from "./helpers/prisma";
describe("/user", () => {
  describe("[POST] /user", () => {
    it("should respond 200 and body with valid session token and user information", async () => {
      const { status, body } = await request(app).post("/user").send({
        username: "adnan",
        password: "admin"
      });

      expect(status).toBe(200)
      expect(body.data.token).toBeDefined()
      expect(body.data.userId).toBeDefined();
      expect(body.data.username).toBe("adnan");
    });
    it("should respond with 400 and body with errors when invalid body is sent", async () => {
      const { status, body } = await request(app).post("/user").send({
        password: "admin",
      });

      expect(status).toBe(400)
      expect(body.errors).toBeDefined()
    })
    it("should respond 400 and body with message if user exists with provided username", async () => {
      await prisma.user.create({
        data: {
          username: "adnan",
          password: hashPasswordSync("admin"),
        },
      });

      const { status, body } = await request(app).post("/user").send({
        username: "adnan",
        password: "admin",
      });


      expect(status).toBe(400);
      expect(body.message).toBeDefined();
    })
  })
});

describe("/sign_in", () => {
  describe("[POST /sign_in", () => {
    it("should respond 200 and body with valid session token and user information", async () => {
      await prisma.user.create({
        data: {
          username: "adnan",
          password: hashPasswordSync("admin"),
        },
      });

      const { status, body } = await request(app).post("/sign_in").send({
        username: "adnan",
        password: "admin"
      })

      expect(status).toBe(200);
      expect(body.data.token).toBeDefined();
      expect(body.data.userId).toBeDefined();
      expect(body.data.username).toBe("adnan");
    })
    it("should return 404 and body with valid message if user with provided username not exists", async () => {
      const { status, body } = await request(app).post("/sign_in").send({
        username: "adnan",
        password: "admin",
      });

      expect(status).toBe(404);
      expect(body.message).toBe("Username or password not valid");
    });

    it("should return 404 and body with valid message if provided password not match user with provided username", async () => {
      await prisma.user.create({
        data: {
          username: "adnan",
          password: hashPasswordSync("admin"),
        },
      });

      const { status, body } = await request(app).post("/sign_in").send({
        username: "adnan",
        password: "wrongPassword",
      });

      console.log(status)
      console.log(body)

      expect(status).toBe(404);
      expect(body.message).toBe("Username or password not valid");
    });

    it(
      "should respond with 400 and body with errors when invalid body is sent", async () => {
        const { status, body } = await request(app).post("/sign_in").send({
          username: "adnan",
        });

        expect(status).toBe(400)
        expect(body.errors).toBeDefined()
      }
    );

  })
})
