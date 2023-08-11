import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "./error";
import config from "../config"

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5)
}

export const hashPasswordSync = (password: string) => {
  return bcrypt.hashSync(password, 5);
};

type TCreateJWTArg = {
  username: string;
  userId: string;
  options?: SignOptions
};
export const createJWT = ({ userId, username, options = { expiresIn: "8h" } }: TCreateJWTArg) => {
  const token = jwt.sign(
    {
      username,
      id: userId,
    },
    config.secrets.jwt as string,
    options
  );

  return token;
};

type TJWT = {
  username: string;
  id: string;
  iat: number;
  exp: number;
}; 
export const verifyToken = (token: string) => {
  return jwt.verify(token, config.secrets.jwt as string) as TJWT;
};

export const protectRoutes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return next(new AppError({ statusCode: 401, message: "Not authorized"}))
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    return next(new AppError({ statusCode: 401, message: "Not authorized"}))
  }

  try {
    const res = verifyToken(token);

    // @ts-ignore
    req.user = res;
    return next();
  } catch (err) {
    console.error(err);

    next(new AppError({ statusCode: 401, message: "Not authorized" }));
  }
};
