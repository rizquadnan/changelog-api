import { NextFunction, Request, Response } from "express";
import prisma from "../../db";

import { AppError } from "../../modules/error";
// Update update
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
