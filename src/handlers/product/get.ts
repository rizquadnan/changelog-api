import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

/**
 * @swagger
 * /api/product:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Gets all products of a user
 *     tags: [Product]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully get all products of a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Error'
 */
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        id: req.user.id,
      },
      include: {
        products: true,
      },
    });

    return res.json({
      data: user?.products,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of product to be get
 *     summary: Gets a product of a user
 *     tags: [Product]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully get a product of a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Error'
 */
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id_belongsToId: {
          id: req.params.id,
          // @ts-ignore
          belongsToId: req.user.id,
        },
      },
    });

    return res.json({
      data: product,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
