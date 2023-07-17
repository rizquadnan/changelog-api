import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";
// Create update
export const createUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id_belongsToId: {
          
          id: req.body.productId,
          // @ts-ignore
          belongsToId: req.user.id,
        },
      },
    });

    if (!product) {
      return next(
        new AppError({ statusCode: 404, message: "No Product found" })
      );
    }
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }

  try {
    const update = await prisma.update.create({
      data: {
        title: req.body.title,
        body: req.body.body,
        productId: req.body.productId,
        asset: req.body.asset,
        version: req.body.version,
        status: req.body.status,
      },
    });

    return res.json({
      data: update,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
