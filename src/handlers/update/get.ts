import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

// Get all
export const getUpdates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetProductId = req.query["product_id"];
    if (Array.isArray(targetProductId)) {
      return next(
        new AppError({ statusCode: 400, message: "Query param not supported" })
      );
    }

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
        updates: true,
      },
    });

    return res.json({
      data: products.flatMap((v) => v.updates),
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};

// Get one update
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
