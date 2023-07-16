import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

type TAppError = {
  originalError?: unknown;
  message?: string;
  statusCode?: number;
};

export const DEFAULT_ERROR_MESSAGE =
  "Sorry something went wrong. Its not your fault, its ours. Please wait a bit. This error has been tracked and will be debug by our developers";

export const DEFAULT_ERROR_CODE = 500;

export class AppError extends Error {
  private statusCode: number;
  private originalError: unknown;

  constructor(args: TAppError) {
    super();

    // needed for typescript known issue: https://github.com/microsoft/TypeScript/issues/13965
    Object.setPrototypeOf(this, AppError.prototype);

    this.originalError = args.originalError;
    
    if (args.originalError instanceof Prisma.PrismaClientKnownRequestError) {
      this.statusCode = args.originalError.code === "P2025" ? 404 : 400;
      this.message = args.originalError.message;
    } else {
      this.statusCode = args.statusCode ?? DEFAULT_ERROR_CODE;
      this.message = args.message ?? DEFAULT_ERROR_MESSAGE;
    }
  }

  getMessage() {
    return this.message;
  }

  getStatusCode() {
    return this.statusCode;
  }

  getOriginalError() {
    return this.originalError;
  }
}

export const handleRuntimeError = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    console.log("[Global Error Handler] Is Instance Of AppError");
    console.log(
      "[Global Error Handler] Original Error: " + err.getOriginalError()
    );
    console.log("[Global Error Handler] App Error: " + err);

    res.status(err.getStatusCode());
    res.json({
      message: err.getMessage(),
    });
  } else {
    console.log("[Global Error Handler] Not Instance Of AppError");
    console.log("[Global Error Handler] Error: " + err);

    res.status(DEFAULT_ERROR_CODE);
    res.json({
      message: DEFAULT_ERROR_MESSAGE,
    });
  }
};
