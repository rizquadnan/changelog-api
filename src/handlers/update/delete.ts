import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

// Delete update
export const deleteUpdate = async (
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
    const update = await prisma.update.delete({
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
