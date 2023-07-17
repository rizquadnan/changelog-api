import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

// Create product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        // @ts-ignore
        belongsToId: req.user.id,
      },
    });

    return res.json({
      data: product,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
