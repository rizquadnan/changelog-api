import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

/**
 * @swagger
 * /api/product/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a product of a user
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of product to be delete
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully deletes a product of a user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Error'
 */
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await prisma.product.delete({
      where: {
        id_belongsToId: {
          id: req.params.id,
          // @ts-ignore
          belongsToId: req.user.id,
        },
      },
    });

    return res.json({
      data: deleted,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
