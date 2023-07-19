import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

/**
 * @swagger
 * /api/update/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes an update and returns the deleted update
 *     tags: [Update]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of update to be deleted
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully deleted an update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Update'
 *       404:
 *         description: Cannot found update
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
export const deleteUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        // @ts-ignore
        belongsToId: req.user.id,
      },
      include: {
        updates: true,
      },
    });

    if (
      !products
        .flatMap((p) => p.updates.flatMap((u) => u.id))
        .includes(req.params.id)
    ) {
      return next(
        new AppError({ statusCode: 404, message: "No Update found" })
      );
    }
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }

  try {
    const update = await prisma.update.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.json({
      data: update,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
