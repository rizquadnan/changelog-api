import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { comparePassword, createJWT, hashPassword } from "../../modules/auth";
import { AppError } from "../../modules/error";
export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });

    return res.json({
      token: createJWT({ userId: user.id, username: user.username }),
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return next(
        new AppError({
          statusCode: 404,
          message: "Username or password not valid",
        })
      );
    }

    const isValid = await comparePassword(
      req.body.password,
      user?.password as string
    );

    if (!isValid) {
      return next(
        new AppError({
          statusCode: 404,
          message: "Username or password not valid",
        })
      );
    }

    return res.json({
      token: createJWT({ userId: user.id, username: user.username }),
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
