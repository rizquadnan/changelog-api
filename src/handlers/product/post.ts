import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

/**
 * @swagger
 * /api/product:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Creates a new product and returns the created product
 *     tags: [Product]
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Successfully created a product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid user input. Incomplete / invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Error'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Error'
 */

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        // @ts-ignore
        belongsToId: req.user.id,
      },
    });

    return res.json({
      data: product,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
