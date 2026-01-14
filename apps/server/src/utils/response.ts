import { Response } from "express";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500,
  message?: string
) => {
  const response: ApiResponse = {
    success: false,
    error,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message?: string) => {
  return sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res: Response) => {
  return res.status(204).send();
};
