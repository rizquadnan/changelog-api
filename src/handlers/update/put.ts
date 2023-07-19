import { NextFunction, Request, Response } from "express";
import prisma from "../../db";

import { AppError } from "../../modules/error";

/**
 * @swagger
 * /api/update/:id:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates an update and returns the updated update
 *     tags: [Update]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of update to be updated
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Update'
 *     responses:
 *       200:
 *         description: Successfully updated an update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
export const updateUpdate = async (
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
    const updatedUpdate = await prisma.update.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        body: req.body.body,
        asset: req.body.asset,
        version: req.body.version,
        status: req.body.status,
      },
    });

    return res.json({
      data: updatedUpdate,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
