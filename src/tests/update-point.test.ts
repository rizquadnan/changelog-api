import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server";
import { getTokenViaSignUp } from "./helpers/auth";
import prisma from "./helpers/prisma";
import { verifyToken } from "../modules/auth";
import { UPDATE_POINT_TYPE } from "@prisma/client";

const setupUserProductAndUpdate = async () => {
  const token = await getTokenViaSignUp();
  const { id: userId } = verifyToken(token);

  const product = await prisma.product.create({
    data: {
      name: "The Product",
      belongsToId: userId,
    },
  });

  const update = await prisma.update.create({
    data: {
      title: "The Release 1",
      body: "Lorem ipsum doler amet",
      productId: product.id,
    },
  });

  return {
    token,
    product,
    update,
  };
};

describe("/api/update_point", () => {
  describe("[POST] /api/update_point", () => {
    it("should return 200 and body with created update point", async () => {
      const { token, update } = await setupUserProductAndUpdate();

      const { status, body } = await request(app)
        .post("/api/update_point")
        .send({
          title: "Feature 1",
          description: "Lorem ipsum doler amet",
          type: "FEATURE",
          updateId: update.id,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.updateId).toBe(update.id);
    });
    it("should return 404 when provided update is not found", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .post("/api/update_point")
        .send({
          title: "Feature 1",
          description: "Lorem ipsum doler amet",
          type: "FEATURE",
          updateId: "not-exists-id",
        })
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404);
      expect(body.message).toBe("No Update found");
    });
    it("should return 400 when and body with errors when invalid request comes", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .post("/api/update_point")
        .send()
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(400);
      expect(body.errors).toBeDefined();
    });
  });

  describe("[GET] /api/update_point", () => {
    it("should return 200 and all update points of a user", async () => {
      const { token, update } = await setupUserProductAndUpdate();
      const mockSeedUpdatePoint: UPDATE_POINT_TYPE[] = [
        "FEATURE",
        "FEATURE",
        "IMPROVEMENT",
        "IMPROVEMENT",
        "BUG",
        "BUG",
      ];

      await prisma.updatePoint.createMany({
        data: mockSeedUpdatePoint.map((seed, i) => ({
          title: `${seed} ${i + 1}`,
          description: `Lorem ipsum doler amet ${seed} ${i + 1}`,
          type: seed,
          updateId: update.id,
        })),
      });

      const { status, body } = await request(app)
        .get("/api/update_point")
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data).toHaveLength(mockSeedUpdatePoint.length);
    });

    it("should return 200 and empty array when no update point found", async () => {
      const { token } = await setupUserProductAndUpdate();

      const { status, body } = await request(app)
        .get("/api/update_point")
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data).toHaveLength(0);
    });

    it("should return 200 and all updates points of an update when given update_id query param", async () => {
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

      const updatePointsData: any[] = [];
      updates.forEach((u) => {
        updatePointsData.push(
          ...[
            {
              title: `${u.title} - FEATURE 1`,
              description: `Lorem ipsum doler amet`,
              type: "FEATURE",
              updateId: u.id,
            },
            {
              title: `${u.title} - IMPROVEMENT 1`,
              description: `Lorem ipsum doler amet`,
              type: "IMPROVEMENT",
              updateId: u.id,
            },
            {
              title: `${u.title} - BUG 1`,
              description: `Lorem ipsum doler amet`,
              type: "BUG",
              updateId: u.id,
            },
          ]
        );
      });
      await prisma.updatePoint.createMany({
        data: updatePointsData,
      });

      const targetUpdate = updates[1];
      const { status, body } = await request(app)
        .get(`/api/update_point?update_id=${targetUpdate.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toHaveLength(3);
      // @ts-ignore
      expect(body.data.every((v) => v.updateId === targetUpdate.id)).toBe(true);
    });

    it("should return 200 and paginated update points when given pagination query param", async () => {
      const { token, update } = await setupUserProductAndUpdate();

      // create many update points
      const mockUpdatePointNames = [...Array(15)].map((_, i) => `Update Point ${i + 1}`);
      await prisma.updatePoint.createMany({
        data: mockUpdatePointNames.map((name) => ({
          title: name,
          description: 'Lorem ipsum doler amet',
          type: "FEATURE",
          updateId: update.id,
        })),
      });

      // request with query param
      const {status, body} = await request(app).get("/api/update_point?page=2&page_size=5").set("Authorization", `Bearer ${token}`)

      // assert pagination
      const data = body.data as Array<{ title: string}>
      expect(status).toBe(200)
      expect(data).toHaveLength(5)
      expect(data.map(v => v.title)).toEqual(mockUpdatePointNames.slice(5).slice(0, 5))
      expect(body.pagination).toBeDefined()
      expect(body.pagination.total).toBe(mockUpdatePointNames.length)
    });

    it(
      "should return 200 and paginated update points of an update when given pagination query param and update_id query param", async () => {
        // create user
        const token = await getTokenViaSignUp()
        const { id: userId } = verifyToken(token);
        
        // create product
        const product = await prisma.product.create({
          data: {
            name: "The Product",
            belongsToId: userId 
          }
        })

        // create 2 updates
        const update1 = await prisma.update.create({
          data: {
            title: "Update 1",
            body: "Lorem ipsum dolor amat",
            productId: product.id
          }
        })
        const update2 = await prisma.update.create({
          data: {
            title: "Update 2",
            body: "Lorem ipsum dolor amat",
            productId: product.id,
          },
        });

        // create many update points
        const mockUpdate1UpdatePointNames = [...Array(15)].map(
          (_, i) => `${update1.title} - Update Point ${i + 1}`
        );
        await prisma.updatePoint.createMany({
          data: mockUpdate1UpdatePointNames.map((name) => ({
            title: name,
            description: "Lorem ipsum doler amet",
            type: "FEATURE",
            updateId: update1.id,
          })),
        });
        const mockUpdate2UpdatePointNames = [...Array(15)].map(
          (_, i) => `${update2.title} - Update Point ${i + 1}`
        );
        await prisma.updatePoint.createMany({
          data: mockUpdate2UpdatePointNames.map((name) => ({
            title: name,
            description: "Lorem ipsum doler amet",
            type: "FEATURE",
            updateId: update2.id,
          })),
        });

        // request with query param
        const { status, body } = await request(app).get(`/api/update_point?page=2&page_size=5&update_id=${update2.id}`).set("Authorization", `Bearer ${token}`)

        // assert pagination
        const data = body.data as Array<{ title: string }>;
        expect(status).toBe(200);
        expect(data).toHaveLength(5);
        expect(data.map((v) => v.title)).toEqual(
          mockUpdate2UpdatePointNames.slice(5).slice(0, 5)
        );
        expect(body.pagination).toBeDefined()
        expect(body.pagination.total).toBe(mockUpdate2UpdatePointNames.length)
      }
    );
  });
});

describe("/api/update_point/:id", () => {
  describe("[GET] /api/update_point/:id", () => {
    it("should return 200 and the requested updatePoint", async () => {
      const { token, update } = await setupUserProductAndUpdate();

      const updatePoint = await prisma.updatePoint.create({
        data: {
          title: "FEATURE 1",
          description: "Lorem ipsum dolor amet",
          type: "FEATURE",
          updateId: update.id,
        },
      });

      const { status, body } = await request(app)
        .get(`/api/update_point/${updatePoint.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data.id).toBe(updatePoint.id);
    });

    it("should return 404 when the requested updatePoint not exists", async () => {
      const token = await getTokenViaSignUp();
      const { status, body } = await request(app)
        .get(`/api/update_point/not-exists-id`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404);
      expect(body.message).toBe("No UpdatePoint found");
    });
  });

  describe("[PUT] /api/update_point/:id", () => {
    it("should return 200 and body with the updated product", async () => {
      const { token, update } = await setupUserProductAndUpdate();

      const updatePoint = await prisma.updatePoint.create({
        data: {
          title: "FEATURE 1",
          description: "Lorem ipsum dolor amet",
          type: "FEATURE",
          updateId: update.id,
        },
      });

      const { status, body } = await request(app)
        .put(`/api/update_point/${updatePoint.id}`)
        .send({ title: "FEATURE 1 - Updated" })
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe(updatePoint.id);
      expect(body.data.title).toBe("FEATURE 1 - Updated");
    });

    it("should return 404 when requested updatePoint not exists", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .put(`/api/update_point/not-exists`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404);
      expect(body.message).toBeDefined();
    });
  });

  describe("[DELETE /api/update_point/:id", () => {
    it("should return 200 and body with the deleted update point", async () => {
      const { token, update } = await setupUserProductAndUpdate();

      const updatePoint = await prisma.updatePoint.create({
        data: {
          title: "FEATURE 1",
          description: "Lorem ipsum dolor amet",
          type: "FEATURE",
          updateId: update.id,
        },
      });

      const { status, body } = await request(app)
        .delete(`/api/update_point/${updatePoint.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe(updatePoint.id);
    });
    it("should return 404 and body with message when the requested update point is not found", async () => {
      const token = await getTokenViaSignUp();

      const { status, body } = await request(app)
        .delete(`/api/update_point/not-exists-id`)
        .set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404);
      expect(body.message).toBe("No UpdatePoint found");
    });
    it("should return 404 and body with message when it is requested to delete an update point of another user", async () => {
      // setups user 1 and user 2
      // creates product, update and updatePoint for each user
      const user1Token = await getTokenViaSignUp({
        username: "adnan",
        password: "admin",
      });
      const user2Token = await getTokenViaSignUp({
        username: "john",
        password: "admin",
      });

      const { id: user1Id } = verifyToken(user1Token);
      const { id: user2Id } = verifyToken(user2Token);

      const user1Product = await prisma.product.create({
        data: {
          name: "User 1 - The Product 1",
          belongsToId: user1Id,
        },
      });
      const user2Product = await prisma.product.create({
        data: {
          name: "User 2 - The Product",
          belongsToId: user2Id,
        },
      });

      const user1Update = await prisma.update.create({
        data: {
          title: "User 1 - The Release 1",
          body: "Lorem ipsum doler amet",
          productId: user1Product.id,
        },
      });

      const user2Update = await prisma.update.create({
        data: {
          title: "User 2 - The Release 1",
          body: "Lorem ipsum doler amet",
          productId: user2Product.id,
        },
      });

      await prisma.updatePoint.create({
        data: {
          title: "User 1 - FEATURE 1",
          description: "Lorem ipsum dolor amet",
          type: "FEATURE",
          updateId: user1Update.id,
        },
      });

      const user2UpdatePoint = await prisma.updatePoint.create({
        data: {
          title: "User 2 - FEATURE 1",
          description: "Lorem ipsum dolor amet",
          type: "FEATURE",
          updateId: user2Update.id,
        },
      });

      // user 1 tries to delete user 2's updatePoint
      const { status, body } = await request(app)
        .delete(`/api/update_point/${user2UpdatePoint.id}`)
        .set("Authorization", `Bearer ${user1Token}`);

      expect(status).toBe(404);
      expect(body.message).toBe("No UpdatePoint found");
    });
  });
});
