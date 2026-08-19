import { globalErrorHandler } from './global-error-handler';
import { mockRequest, mockResponse, mockNext } from '../test-utils/express.mock';

describe('globalErrorHandler', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should respond with the error statusCode and message', () => {
    const err = Object.assign(new Error('Something went wrong'), { statusCode: 400 });
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    globalErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 400,
      message: 'Something went wrong',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should fall back to 500 when no statusCode is provided', () => {
    const err = new Error('Something went wrong');
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    globalErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: 'Something went wrong',
    });
  });

  it('should fall back to a default message when none is provided', () => {
    const err = new Error();
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    globalErrorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: 'Internal Server Error',
    });
  });

  it('should include the stack trace in development', () => {
    process.env.NODE_ENV = 'development';
    const err = new Error('Something went wrong');
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    globalErrorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: 'Something went wrong',
      stack: err.stack,
    });
  });

  it('should not include the stack trace outside of development', () => {
    process.env.NODE_ENV = 'production';
    const err = new Error('Something went wrong');
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    globalErrorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: 'Something went wrong',
    });
    expect(res.json).not.toHaveBeenCalledWith(expect.objectContaining({ stack: expect.any(String) }));
  });

  it('should log the error details to the console', () => {
    const err = Object.assign(new Error('Something went wrong'), { statusCode: 400 });
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    globalErrorHandler(err, req, res, next);

    expect(consoleErrorSpy).toHaveBeenCalledWith('[Error] 400 - Something went wrong');
    expect(consoleErrorSpy).toHaveBeenCalledWith(err.stack);
  });
});
