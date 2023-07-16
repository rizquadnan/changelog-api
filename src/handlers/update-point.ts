import { RequestHandler } from "express";
import prisma from "../db";
import { AppError } from "../modules/error";

export const createUpdatePoint: RequestHandler = async (req, res, next) => {
  try {
    const update = await prisma.update.findUniqueOrThrow({
      where: {
        id: req.body.updateId,
      },
    });

    await prisma.product.findUniqueOrThrow({
      where: {
        id_belongsToId: {
          // @ts-ignore
          belongsToId: req.user.id,
          id: update?.productId,
        },
      },
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }

  try {
    const updatePoint = await prisma.updatePoint.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        updateId: req.body.updateId,
        type: req.body.type,
      },
    });

    res.json({
      data: updatePoint,
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};

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

export const updateUpdatePointById: RequestHandler = async (req, res, next) => {
  try {
    const updatePoint = await prisma.updatePoint.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
      },
    });

    res.json({ data: updatePoint });
  } catch (error) {
    next(new AppError({ originalError: error }));
  }
};

export const deleteUpdatePointById: RequestHandler = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        // @ts-ignore
        belongsToId: req.user.id,
      },

      select: {
        updates: {
          select: {
            updatePoints: true,
          },
        },
      },
    });

    // if requested update point is not owned by user
    if (
      !products
        .flatMap((p) =>
          p.updates.flatMap((u) => u.updatePoints).map((v) => v.id)
        )
        .includes(req.params.id)
    ) {
      return next(
        new AppError({ statusCode: 404, message: "No UpdatePoint found" })
      );
    }
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }

  try {
    const updatePoint = await prisma.updatePoint.delete({
      where: { id: req.params.id },
    });

    res.json({
      data: updatePoint,
    });
  } catch (error) {
    next(new AppError({ originalError: error }))
  }
};
