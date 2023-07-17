import { RequestHandler } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";
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
    next(new AppError({ originalError: error }));
  }
};
