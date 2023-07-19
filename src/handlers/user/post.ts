import { NextFunction, Request, Response } from "express";
import prisma from "../../db";
import { comparePassword, createJWT, hashPassword } from "../../modules/auth";
import { AppError } from "../../modules/error";

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The API for managing users
 * /user:
 *   post:
 *     summary: Creates a new user and generates a jwt user session token. Used for signing up
 *     tags: [User]
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of user
 *               password:
 *                 type: string
 *                 description: Password of user
 *     responses:
 *       200:
 *         description: Successfully sign up a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: The jwt generated string
 *                     userId:
 *                       type: string
 *                       description: The id of the user
 *                     username:
 *                       type: string
 *                       description: The username of the user
 *       400:
 *         description: Invalid user input. Either incomplete / invalid request body. Or user with provided username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Error'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Error'
 */
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
      data: {
        token: createJWT({ userId: user.id, username: user.username }),
        userId: user.id,
        username: user.username
      },
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The API for managing users
 * /sign_in:
 *   post:
 *     summary: Generates a jwt user session token. Used for signing in
 *     tags: [User]
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of user
 *               password:
 *                 type: string
 *                 description: Password of user
 *     responses:
 *       200:
 *         description: Successfully sign in a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: The jwt generated string
 *                     userId:
 *                       type: string
 *                       description: The id of the user
 *                     username:
 *                       type: string
 *                       description: The username of the user
 *       400:
 *         description: Invalid user input. Either incomplete / invalid request body. Or user with provided username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Error'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Error'
 */
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
      data: {
        token: createJWT({ userId: user.id, username: user.username }),
        userId: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    return next(new AppError({ originalError: error }));
  }
};
