import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

// Update product
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await prisma.product.update({
      where: {
        id_belongsToId: {
          id: req.params.id,
          // @ts-ignore
          belongsToId: req.user.id,
        },
      },
      data: {
        name: req.body.name,
      },
    });

    return res.json({
      data: updated,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
