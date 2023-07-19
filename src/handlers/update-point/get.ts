import { RequestHandler } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

/**
 * @swagger
 * /api/update-point:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Gets all update point of a user. Optionally pass in update_id to filter by update
 *     tags: [UpdatePoint]
 *     parameters:
 *       - in: query
 *         name: update_id
 *         schema:
 *           type: string
 *         description: Filter by update. The id of update you want to get the update points
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully get all updates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UpdatePoint'
 *       404:
 *         description: Cannot found update you want to filter with
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
export const getUpdatePoint: RequestHandler = async (req, res, next) => {
  const targetUpdateId = req.query["update_id"];

  if (Array.isArray(targetUpdateId)) {
    return next(
      new AppError({ statusCode: 400, message: "Query param not supported" })
    );
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        // @ts-ignore
        belongsToId: req.user.id,
      },

      select: {
        updates: {
          where: {
            ...(targetUpdateId ? { id: targetUpdateId } : {}),
          },
          select: {
            updatePoints: true,
          },
        },
      },
    });

    res.json({
      data: products.flatMap((p) => p.updates.flatMap((u) => u.updatePoints)),
    });
  } catch (error) {
    next(new AppError({ originalError: error }));
  }
};

/**
 * @swagger
 * /api/update-point/:id:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Gets an update point
 *     tags: [UpdatePoint]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the update point to be get
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePoint'
 *     responses:
 *       200:
 *         description: Successfully get an update point
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdatePoint'
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
export const getUpdatePointById: RequestHandler = async (req, res, next) => {
  try {
    const updatePoint = await prisma.updatePoint.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      data: updatePoint,
    });
  } catch (error) {
    next(new AppError({ originalError: error }));
  }
};
