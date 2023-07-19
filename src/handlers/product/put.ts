import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

/**
 * @swagger
 * /api/product/:id:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates a product of a user
 *     tags: [Product]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of product to be updated
 *     responses:
 *       200:
 *         description: Successfully updates a product of a user
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
 *       404:
 *         description: Product of the update is not found
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
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await prisma.product.update({
      where: {
        id_belongsToId: {
          id: req.params.id,
          // @ts-ignore
          belongsToId: req.user.id,
        },
      },
      data: {
        name: req.body.name,
      },
    });

    return res.json({
      data: updated,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
