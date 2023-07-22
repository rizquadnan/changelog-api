import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server";
import { getTokenViaSignUp } from "./helpers/auth";
import prisma from "./helpers/prisma";
import { verifyToken } from "../modules/auth";

const setupUserProductAndUpdates = async () => {
  const token = await getTokenViaSignUp();
  const { id: userId } = verifyToken(token);

  const mockProductNames = ["Product 1", "Product 2", "Product 3"];
  await prisma.product.createMany({
    data: mockProductNames.map((p) => ({
      name: p,
      belongsToId: userId,
    })),
  });
  const products = await prisma.product.findMany();

  const updatesData: any[] = [];
  products.forEach((p) => {
    updatesData.push(
      ...[
        {
          title: `${p.name} - The Release 1`,
          body: "Lorem ipsum doler amet",
          productId: p.id,
        },
        {
          title: `${p.name} - The Release 2`,
          body: "Lorem ipsum doler amet",
          productId: p.id,
        },
      ]
    );
  });
  await prisma.update.createMany({
    data: updatesData,
  });
  const updates = await prisma.update.findMany();

  return {
    token,
    userId,
    products,
    updates,
  };
};
describe("/api/update", () => {
  describe("[GET /api/update", () => {
    it("should return 200 and all updates of a product when given product_id query param", async () => {
      const { products, token } = await setupUserProductAndUpdates();

      const targetProduct = products[1];
      const { status, body } = await request(app)
        .get(`/api/update?product_id=${targetProduct.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toHaveLength(2);
      // @ts-ignore
      expect(body.data.every((v) => v.productId === targetProduct.id)).toBe(
        true
      );
    });

    it("should return 200 and body with paginated update when given pagination query param", async () => {
      // create user
      const token = await getTokenViaSignUp();
      const { id: userId } = verifyToken(token);

      // create product
      const product = await prisma.product.create({
        data: {
          name: "The Product",
          belongsToId: userId,
        },
      });

      // create many updates
      const mockUpdateNames = [...Array(15)].map((_, i) => `Update ${i + 1}`);
      await prisma.update.createMany({
        data: mockUpdateNames.map((name) => ({
          title: name,
          body: "Lorem ipsum doler amet",
          productId: product.id,
        })),
      });

      // request with query params
      const { status, body } = await request(app)
        .get("/api/update?page=2&page_size=5")
        .set("Authorization", `Bearer ${token}`);

      // force type just to help assert name
      const data = body.data as Array<{ title: string }>;

      // assert pagination
      expect(status).toBe(200);
      expect(data).toHaveLength(5);
      expect(data.map((v) => v.title)).toEqual(
        mockUpdateNames.slice(5).slice(0, 5)
      );
      expect(body.pagination).toBeDefined()
      expect(body.pagination.total).toBe(mockUpdateNames.length)
    });

    it("should return 200 and body with paginated update and of a given product when given pagination query param and product_id query param", async () => {
      // create user
      const token = await getTokenViaSignUp();
      const { id: userId } = verifyToken(token);

      // create products
      const product1 = await prisma.product.create({
        data: {
          name: "The Product 1",
          belongsToId: userId,
        },
      });
      const product2 = await prisma.product.create({
        data: {
          name: "The Product 2",
          belongsToId: userId,
        },
      });

      // create many updates
      const mockProduct1UpdateNames = [...Array(15)].map((_, i) => `${product1.name} Update ${i + 1}`);
      await prisma.update.createMany({
        data: mockProduct1UpdateNames.map((name) => ({
          title: name,
          body: "Lorem ipsum doler amet",
          productId: product1.id,
        })),
      });
      const mockProduct2UpdateNames = [...Array(15)].map(
        (_, i) => `${product2.name} Update ${i + 1}`
      );
      await prisma.update.createMany({
        data: mockProduct2UpdateNames.map((name) => ({
          title: name,
          body: "Lorem ipsum doler amet",
          productId: product2.id,
        })),
      });

      // request with query params
      const { status, body } = await request(app)
        .get(`/api/update?page=2&page_size=5&product_id=${product2.id}`)
        .set("Authorization", `Bearer ${token}`);

      // force type just to help assert name
      const data = body.data as Array<{ title: string }>;

      // assert pagination
      expect(status).toBe(200);
      expect(data).toHaveLength(5);
      expect(data.map((v) => v.title)).toEqual(
        mockProduct2UpdateNames.slice(5).slice(0, 5)
      );
      expect(body.pagination).toBeDefined()
      expect(body.pagination.total).toBe(mockProduct2UpdateNames.length);
    })

    it("should return 200 and all updates of a user", async () => {
      const { token } = await setupUserProductAndUpdates();

      const { status, body } = await request(app)
        .get(`/api/update`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toHaveLength(6);
    });
  });

  describe("[POST] /api/update", () => {
    it("should return 200 and body with update", async () => {
      const { token, products } = await setupUserProductAndUpdates();

      const targetProduct = products[0];
      const { status, body } = await request(app)
        .post("/api/update")
        .send({
          title: "The Update",
          body: "Lorem ipsum dolor amet",
          productId: targetProduct.id,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.title).toBe("The Update");
      expect(body.data.productId).toBe(targetProduct.id);
    });
    it("should return 404 when trying to update a not found product", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .post("/api/update")
        .send({
          title: "The Update",
          body: "Lorem ipsum dolor amet",
          productId: "not-exists-id",
        })
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404);
      expect(body.message).toBe("No Product found");
    });
  });
});

describe("/api/update/:id", () => {
  describe("[GET] /api/update/:id", () => {
    it("should return 200 and body with the update", async () => {
      const { token, updates } = await setupUserProductAndUpdates();

      const targetUpdate = updates[0];
      const { status, body } = await request(app)
        .get(`/api/update/${targetUpdate.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe(targetUpdate.id);
    });
    it("should return 404 when provided update id not found", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .get("/api/update/not-exists-id")
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404);
      expect(body.message).toBe("No Update found");
    });
  });

  describe("[PUT] /api/update/:id", () => {
    it("should return 200 and body with the updated update", async () => {
      const { token, updates } = await setupUserProductAndUpdates();

      const targetUpdate = updates[0];
      const { status, body } = await request(app)
        .put(`/api/update/${targetUpdate.id}`)
        .send({
          title: "The Update Updated",
        })
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.title).toBe("The Update Updated");
    });
    it("should return 404 and body with message when provided update id not found", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .put(`/api/update/not-exists-id`)
        .send({
          title: "The Update Updated",
        })
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404);
      expect(body.message).toBe("No Update found");
    });
  });

  describe("[DELETE] /api/update/:id", () => {
    it("should return 200 and body with the deleted update", async () => {
      const { token, updates } = await setupUserProductAndUpdates();

      const targetUpdate = updates[0];
      const { status, body } = await request(app)
        .delete(`/api/update/${targetUpdate.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe(targetUpdate.id);
    });
    it("should return 404 and body with message when the provided update id not found", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .delete(`/api/update/not-exists-id`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404);
      expect(body.message).toBe("No Update found");
    });
  });
});
