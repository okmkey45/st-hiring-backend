import { paginationMiddleware, buildPaginatedResponse } from './pagination';
import { mockRequest, mockResponse, mockNext } from '../test-utils/express.mock';

describe('paginationMiddleware', () => {
  it('should use default page and size', async () => {
    const middleware = paginationMiddleware();
    const req = mockRequest({ query: {} });
    const res = mockResponse();
    res.locals = {};
    const next = mockNext();

    await middleware(req, res, next);

    expect(res.locals.pagination).toEqual({
      limit: 50,
      skip: 0,
      fields: [],
    });
    expect(next).toHaveBeenCalled();
  });

  it('should parse valid page and size', async () => {
    const middleware = paginationMiddleware();
    const req = mockRequest({ query: { page: '2', size: '20' } });
    const res = mockResponse();
    res.locals = {};
    const next = mockNext();

    await middleware(req, res, next);

    expect(res.locals.pagination).toEqual({
      limit: 20,
      skip: 20,
      fields: [],
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if size is too large', async () => {
    const middleware = paginationMiddleware();
    const req = mockRequest({ query: { size: '150' } });
    const res = mockResponse();
    res.locals = {};
    const next = mockNext();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'The given data was invalid.',
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if page is invalid', async () => {
    const middleware = paginationMiddleware();
    const req = mockRequest({ query: { page: 'invalid' } });
    const res = mockResponse();
    res.locals = {};
    const next = mockNext();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'The given data was invalid.',
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should parse comma-separated fields', async () => {
    const middleware = paginationMiddleware();
    const req = mockRequest({ query: { fields: 'id, name,date ' } });
    const res = mockResponse();
    res.locals = {};
    const next = mockNext();

    await middleware(req, res, next);

    expect(res.locals.pagination?.fields).toEqual(['id', 'name', 'date']);
    expect(next).toHaveBeenCalled();
  });

  it('should parse array fields', async () => {
    const middleware = paginationMiddleware();
    const req = mockRequest({ query: { fields: ['id', 'name'] } });
    const res = mockResponse();
    res.locals = {};
    const next = mockNext();

    await middleware(req, res, next);

    expect(res.locals.pagination?.fields).toEqual(['id', 'name']);
    expect(next).toHaveBeenCalled();
  });

  it('should filter fields based on allowedFields', async () => {
    const middleware = paginationMiddleware({ allowedFields: ['id', 'name'] });
    const req = mockRequest({ query: { fields: 'id, name, invalidField' } });
    const res = mockResponse();
    res.locals = {};
    const next = mockNext();

    await middleware(req, res, next);

    expect(res.locals.pagination?.fields).toEqual(['id', 'name']);
    expect(next).toHaveBeenCalled();
  });

  it('should set fields to empty array if all fields are filtered out', async () => {
    const middleware = paginationMiddleware({ allowedFields: ['id', 'name'] });
    const req = mockRequest({ query: { fields: 'invalid1, invalid2' } });
    const res = mockResponse();
    res.locals = {};
    const next = mockNext();

    await middleware(req, res, next);

    expect(res.locals.pagination?.fields).toEqual([]);
    expect(next).toHaveBeenCalled();
  });
});

describe('buildPaginatedResponse', () => {
  it('should return correct metadata for the first page', () => {
    const data = [1, 2, 3];
    const response = buildPaginatedResponse(data, 10, 3, 0);

    expect(response).toEqual({
      data,
      meta: {
        totalItems: 10,
        totalPages: 4,
        currentPage: 1,
        nextPage: 2,
        prevPage: null,
      },
    });
  });

  it('should return correct metadata for a middle page', () => {
    const data = [4, 5, 6];
    const response = buildPaginatedResponse(data, 10, 3, 3);

    expect(response).toEqual({
      data,
      meta: {
        totalItems: 10,
        totalPages: 4,
        currentPage: 2,
        nextPage: 3,
        prevPage: 1,
      },
    });
  });

  it('should return correct metadata for the last page', () => {
    const data = [10];
    const response = buildPaginatedResponse(data, 10, 3, 9);

    expect(response).toEqual({
      data,
      meta: {
        totalItems: 10,
        totalPages: 4,
        currentPage: 4,
        nextPage: null,
        prevPage: 3,
      },
    });
  });

  it('should return correct metadata for an empty dataset', () => {
    const data: number[] = [];
    const response = buildPaginatedResponse(data, 0, 10, 0);

    expect(response).toEqual({
      data,
      meta: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        nextPage: null,
        prevPage: null,
      },
    });
  });
});
