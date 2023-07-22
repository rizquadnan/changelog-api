import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";
import {
  hasPagination,
  paginationToSkipAndTake,
} from "../../modules/pagination";

/**
 * @swagger
 * /api/update:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Gets all update of a user. Optionally pass in product_id to filter by product
 *     tags: [Update]
 *     parameters:
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *         description: Filter by product. The id of product you want to get the updates
 *       - $ref: '#/parameters/page'
 *       - $ref: '#/parameters/page_size'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully get all updates
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedData'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Update'
 *       404:
 *         description: Cannot found product you want to filter with
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
export const getUpdates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetProductId = req.query["product_id"];
    if (Array.isArray(targetProductId)) {
      return next(
        new AppError({
          statusCode: 400,
          message: "Product id query param invalid",
        })
      );
    }

    const page = req.query.page as string | undefined;
    const pageSize = req.query["page_size"] as string | undefined;
    const includePagination = hasPagination(page, pageSize);

    const products = await prisma.product.findMany({
      where: {
        // @ts-ignore
        belongsToId: req.user.id,
        ...(targetProductId
          ? {
              id: targetProductId,
            }
          : {}),
      },
      include: {
        updates: includePagination
          ? {
              ...paginationToSkipAndTake(page as string, pageSize as string),
              orderBy: {
                createdAt: "asc",
              },
            }
          : true,
        ...(includePagination ? { _count: { select: { updates: true } } } : {}),
      },
    });

    return res.json({
      data: products.flatMap((v) => v.updates),
      ...(includePagination
        ? { pagination: { total: products[0]._count?.updates ?? 0 } }
        : {}),
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};

/**
 * @swagger
 * /api/update/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Gets an update and returns the get update
 *     tags: [Update]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of update to be get
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
 *         description: Successfully get an update
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
export const getUpdateById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = await prisma.update.findUniqueOrThrow({
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
