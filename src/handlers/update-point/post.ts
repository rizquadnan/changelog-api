import { RequestHandler } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";
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
