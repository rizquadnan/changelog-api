import { RequestHandler } from "express";
import prisma from "../../db";
import { AppError } from "../../modules/error";
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
