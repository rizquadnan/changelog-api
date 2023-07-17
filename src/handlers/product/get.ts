import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";

// Get all
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        id: req.user.id,
      },
      include: {
        products: true,
      },
    });

    return res.json({
      data: user?.products,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};

// Get product
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id_belongsToId: {
          id: req.params.id,
          // @ts-ignore
          belongsToId: req.user.id,
        },
      },
    });

    return res.json({
      data: product,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
