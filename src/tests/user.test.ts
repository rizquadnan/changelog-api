import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import app from "../server";
import { hashPasswordSync, verifyToken } from "../modules/auth";
import prisma from "./helpers/prisma";
describe("/user", () => {
  describe("[POST] /user", () => {
    beforeEach(() => {
      // tell vitest we use mocked time
      vi.useFakeTimers();
    });

    afterEach(() => {
      // restoring date after each test run
      vi.useRealTimers();
    });
    it("should respond 200 and body with valid session token and user information", async () => {
      const { status, body } = await request(app).post("/user").send({
        username: "adnan",
        password: "admin",
      });

      expect(status).toBe(200);
      expect(body.data.token).toBeDefined();
      expect(body.data.userId).toBeDefined();
      expect(body.data.username).toBe("adnan");
    });
    it("should respond with 400 and body with errors when invalid body is sent", async () => {
      const { status, body } = await request(app).post("/user").send({
        password: "admin",
      });

      expect(status).toBe(400);
      expect(body.errors).toBeDefined();
    });
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
    });

    it("should respond 200 and body with valid session token that expires in defined time", async () => {
      const { status, body } = await request(app).post("/user").send({
        username: "adnan",
        password: "admin",
      });

      expect(status).toBe(200);
      expect(body.data.token).toBeDefined();
      expect(body.data.userId).toBeDefined();
      expect(body.data.username).toBe("adnan");

      // token valid and is not expired
      const mockProductNames = ["product1", "product2", "product3"];
      await prisma.product.createMany({
        data: mockProductNames.map((name, i) => ({
          name,
          belongsToId: body.data.userId,
        })),
      });
      const { status: getProductStatusWithValidToken } = await request(app)
        .get("/api/product")
        .set("Authorization", `Bearer ${body.data.token}`);

      expect(getProductStatusWithValidToken).toBe(200);

      // test token expired
      const decodedToken = verifyToken(body.data.token);
      const expireTimeInSeconds = decodedToken.exp - decodedToken.iat;
      vi.advanceTimersByTime(expireTimeInSeconds * 1000); // vitest advance time in ms

      const {
        status: getProductStatusWithExpiredToken,
      } = await request(app)
        .get("/api/product")
        .set("Authorization", `Bearer ${body.data.token}`);

      expect(getProductStatusWithExpiredToken).toBe(401);
    });
  });
});

describe("/sign_in", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });
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
        password: "admin",
      });

      expect(status).toBe(200);
      expect(body.data.token).toBeDefined();
      expect(body.data.userId).toBeDefined();
      expect(body.data.username).toBe("adnan");
    });
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

      console.log(status);
      console.log(body);

      expect(status).toBe(404);
      expect(body.message).toBe("Username or password not valid");
    });

    it("should respond with 400 and body with errors when invalid body is sent", async () => {
      const { status, body } = await request(app).post("/sign_in").send({
        username: "adnan",
      });

      expect(status).toBe(400);
      expect(body.errors).toBeDefined();
    });

    it("should respond 200 and body with valid session token that expires in defined time", async () => {
      await prisma.user.create({
        data: {
          username: "adnan",
          password: hashPasswordSync("admin"),
        },
      });

      const { status, body } = await request(app).post("/sign_in").send({
        username: "adnan",
        password: "admin",
      });

      expect(status).toBe(200);
      expect(body.data.token).toBeDefined();
      expect(body.data.userId).toBeDefined();
      expect(body.data.username).toBe("adnan");

      // token valid and is not expired
      const mockProductNames = ["product1", "product2", "product3"];
      await prisma.product.createMany({
        data: mockProductNames.map((name, i) => ({
          name,
          belongsToId: body.data.userId,
        })),
      });
      const { status: getProductStatusWithValidToken } = await request(app)
        .get("/api/product")
        .set("Authorization", `Bearer ${body.data.token}`);

      expect(getProductStatusWithValidToken).toBe(200);

      // test token expired
      const decodedToken = verifyToken(body.data.token);
      const expireTimeInSeconds = decodedToken.exp - decodedToken.iat;
      vi.advanceTimersByTime(expireTimeInSeconds * 1000); // vitest advance time in ms

      const {
        status: getProductStatusWithExpiredToken,
      } = await request(app)
        .get("/api/product")
        .set("Authorization", `Bearer ${body.data.token}`);

      expect(getProductStatusWithExpiredToken).toBe(401);
    });
  });
});
