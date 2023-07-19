import { RequestHandler } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

/**
 * @swagger
 * /api/update-point/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes an update point and returns the deleted update point
 *     tags: [UpdatePoint]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the update point to be deleted
 *     responses:
 *       200:
 *         description: Successfully deleted an update point
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UpdatePoint'
 *       404:
 *         description: The update point is not found
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
export const deleteUpdatePointById: RequestHandler = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        // @ts-ignore
        belongsToId: req.user.id,
      },

      select: {
        updates: {
          select: {
            updatePoints: true,
          },
        },
      },
    });

    // if requested update point is not owned by user
    if (
      !products
        .flatMap((p) =>
          p.updates.flatMap((u) => u.updatePoints).map((v) => v.id)
        )
        .includes(req.params.id)
    ) {
      return next(
        new AppError({ statusCode: 404, message: "No UpdatePoint found" })
      );
    }
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }

  try {
    const updatePoint = await prisma.updatePoint.delete({
      where: { id: req.params.id },
    });

    res.json({
      data: updatePoint,
    });
  } catch (error) {
    next(new AppError({ originalError: error }));
  }
};
