import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server";
import { getTokenViaSignIn, getTokenViaSignUp } from "./helpers/auth";
import prisma from "./helpers/prisma";
import { hashPasswordSync, verifyToken } from "../modules/auth";
describe("/api/product", () => {
  describe("[POST] /api/product", () => {
    it("should return 200 and body with data", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .post("/api/product")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "The Product",
        });

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.name).toBe("The Product");
    });
    it("should return 400 and body with errors when invalid request comes", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .post("/api/product")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(status).toBe(400);
      expect(body.errors).toBeDefined();
    });
  });

  describe("[GET] /api/product", () => {
    it("should return 200 and body with data that is an array of products", async () => {
      const user = await prisma.user.create({
        data: {
          username: "adnan",
          password: hashPasswordSync("admin"),
        },
      });
      const mockProductNames = ["product1", "product2", "product3"];
      await prisma.product.createMany({
        data: mockProductNames.map((name, i) => ({
          name,
          belongsToId: user.id,
        })),
      });

      const token = await getTokenViaSignIn({
        username: "adnan",
        password: "admin",
      });

      const { status, body } = await request(app)
        .get("/api/product")
        .set("Authorization", `Bearer ${token}`);

      const data = body.data as Array<{ name: string }>;

      expect(status).toBe(200);
      expect(data).toBeDefined();
      expect(data).toHaveLength(mockProductNames.length);
      expect(data.map((v) => v.name)).toEqual(mockProductNames);
    });
    it("should return 200 and an empty array when no products exists", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .get("/api/product")
        .set("Authorization", `Bearer ${token}`);

      const data = body.data as Array<{ name: string }>;

      expect(status).toBe(200);
      expect(data).toBeDefined();
      expect(data).toHaveLength(0);
    });
  });

  describe("[PUT] /api/product/:id", () => {
    const setup = async () => {
      const token = await getTokenViaSignUp();
      const { id } = verifyToken(token);

      const product = await prisma.product.create({
        data: { name: "The Product", belongsToId: id },
      });

      return { token, product };
    };
    it("should return 200 and body with data", async () => {
      const { product, token } = await setup();

      const { status, body } = await request(app)
        .put(`/api/product/${product.id}`)
        .send({ name: "The Product Edited" })
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe(product.id);
      expect(body.data.name).toBe("The Product Edited");
    });
    it("should return 400 and body with errors when invalid request comes", async () => {
      const { token, product } = await setup();

      const { status, body } = await request(app)
        .put(`/api/product/${product.id}`)
        .send({})
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(400);
      expect(body.errors).toBeDefined();
    });

    it("should return 404 and body with message when provided product id not found", async () => {
      const { token } = await setup();

      const { status, body } = await request(app)
        .get(`/api/product/not-exists-id`)
        .send()
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404);
      expect(body).toBeDefined();
      expect(body.message).toBe("No Product found");
    });
  });
  describe("[DELETE] /api/product/:id", () => {
    it("should return 200 and body with deleted product. The deleted product should exists anymore", async () => {
      const token = await getTokenViaSignUp();
      const { id: userId } = verifyToken(token);

      const product = await prisma.product.create({
        data: {
          name: "The Product",
          belongsToId: userId,
        },
      });

      const { status, body } = await request(app)
        .delete(`/api/product/${product.id}`)
        .send()
        .set("Authorization", `Bearer ${token}`);

      const res = await prisma.product.findUnique({
        where: { id: product.id },
      });

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe(product.id);
      expect(res).toBeNull();
    });
  });
});

describe("/api/product/:id", () => {
  describe("[GET] /api/product/:id", () => {
    it("should return 200 and body with product", async () => {
      const token = await getTokenViaSignUp();
      const { id: userId } = verifyToken(token);

      const product = await prisma.product.create({
        data: {
          name: "The Product",
          belongsToId: userId,
        },
      });

      const { status, body } = await request(app)
        .get(`/api/product/${product.id}`)
        .send()
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body).toBeDefined();
      expect(body.data.id).toBe(product.id);
    });
    it("should return 404 when provided product id is not found", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .get(`/api/product/not-exists-id`)
        .send()
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404)
      expect(body).toBeDefined()
      expect(body.message).toBe("No Product found")
    });
  });
});
