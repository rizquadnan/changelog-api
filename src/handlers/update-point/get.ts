import { RequestHandler } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";
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
