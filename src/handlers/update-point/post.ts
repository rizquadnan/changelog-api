import { RequestHandler } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

/**
 * @swagger
 * /api/update-point:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Creates a new update point and returns the created update point
 *     tags: [UpdatePoint]
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePoint'
 *     responses:
 *       200:
 *         description: Successfully created an update point
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UpdatePoint'
 *       400:
 *         description: Invalid user input. Incomplete / invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Error'
 *       404:
 *         description: The update that for the update point is not found
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
export const createUpdatePoint: RequestHandler = async (req, res, next) => {
  try {
    const update = await prisma.update.findUniqueOrThrow({
      where: {
        id: req.body.updateId,
      },
    });

    await prisma.product.findUniqueOrThrow({
      where: {
        id_belongsToId: {
          // @ts-ignore
          belongsToId: req.user.id,
          id: update?.productId,
        },
      },
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }

  try {
    const updatePoint = await prisma.updatePoint.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        updateId: req.body.updateId,
        type: req.body.type,
      },
    });

    res.json({
      data: updatePoint,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
