import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { AppError } from "../modules/error";

// Get all
export const getUpdates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetProductId = req.query['product_id']
    if (Array.isArray(targetProductId)) {
      return next(new AppError({ statusCode: 400, message: "Query param not supported"}))  
    }

    const products = await prisma.product.findMany({
      where: {
        // @ts-ignore
        belongsToId: req.user.id,
        ...(targetProductId ? {
          id: targetProductId
        } : {})
      },
      include: {
        updates: true,
      },
    });

    return res.json({
      data: products.flatMap((v) => v.updates),
    });
  } catch (error) {
    return next(new AppError({ originalError: error }))
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
        new AppError({ statusCode: 404, message: "Product not found" })
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
        new AppError({ statusCode: 404, message: "Update not found" })
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
      return next(new AppError({ statusCode: 404, message: "Update not found" }));
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
