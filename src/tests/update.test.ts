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
    it(
      "should return 404 and body with message when provided update id not found", async () => {
        const token = await getTokenViaSignUp()

        const { status, body } = await request(app)
          .put(`/api/update/not-exists-id`)
          .send({
            title: "The Update Updated",
          })
          .set("Authorization", `Bearer ${token}`);

        expect(status).toBe(404)
        expect(body.message).toBe("No Update found");
      }
    );
  });

  describe("[DELETE] /api/update/:id", () => {
    it("should return 200 and body with the deleted update", async () => {
      const { token, updates } = await setupUserProductAndUpdates()

      const targetUpdate = updates[0]
      const { status, body} = await request(app).delete(`/api/update/${targetUpdate.id}`).set("Authorization", `Bearer ${token}`)

      expect(status).toBe(200)
      expect(body.data).toBeDefined()
      expect(body.data.id).toBe(targetUpdate.id)
    })
    it("should return 404 and body with message when the provided update id not found", async () => {
      const token = await getTokenViaSignUp()

      const { status, body } = await request(app)
        .delete(`/api/update/not-exists-id`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404)
      expect(body.message).toBe("No Update found")
    })
  })
});
