import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { AppError } from "../modules/error";

// Get all
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
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
    return next(new AppError({ originalError: error }))
  }
}

// Get product
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
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
    return next(new AppError({ originalError: error }))
  }
}

// Create product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
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
    return next(new AppError({ originalError: error }))
  }
} 

// Update product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
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
}

// Delete product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await prisma.product.delete({
      where: {
        id_belongsToId: {
          id: req.params.id,
          // @ts-ignore
          belongsToId: req.user.id,
        },
      },
    });

    return res.json({
      data: deleted,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
}