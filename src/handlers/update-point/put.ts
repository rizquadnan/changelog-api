import { RequestHandler } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

/**
 * @swagger
 * /api/update-point/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates an update point and returns the updated update point
 *     tags: [UpdatePoint]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the update point to be updated
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePoint'
 *     responses:
 *       200:
 *         description: Successfully updated an update point
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
export const updateUpdatePointById: RequestHandler = async (req, res, next) => {
  try {
    const updatePoint = await prisma.updatePoint.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
      },
    });

    res.json({ data: updatePoint });
  } catch (error) {
    next(new AppError({ originalError: error }));
  }
};
