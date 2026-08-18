import { Request, Response, NextFunction } from 'express';

export const mockRequest = (overrides?: Partial<Request>): Request => {
  return {
    body: {},
    query: {},
    params: {},
    headers: {},
    ...overrides,
  } as unknown as Request;
};

export const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

export const mockNext = (): NextFunction => {
  return jest.fn() as unknown as NextFunction;
};
