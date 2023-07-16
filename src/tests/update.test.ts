import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server";
import { getTokenViaSignUp } from "./helpers/auth";
import prisma from "./helpers/prisma";
import { verifyToken } from "../modules/auth";

describe("/api/update", () => {
  describe("[GET /api/update", () => {
    it('should return 200 and all updates of a product', async () => {
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

      const targetProduct = products[1]
      const {status, body} = await request(app).get(`/api/update?product_id=${targetProduct.id}`).set("Authorization", `Bearer ${token}`)

      expect(status).toBe(200)
      expect(body.data).toHaveLength(2)
      // @ts-ignore
      expect(body.data.every(v => v.productId === targetProduct.id)).toBe(true)
    })
  })
})
