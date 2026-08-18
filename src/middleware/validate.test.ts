import { validate } from './validate';
import * as yup from 'yup';
import { mockRequest, mockResponse, mockNext } from '../test-utils/express.mock';

describe('validate middleware', () => {
  it('should fail and return formatted validation errors on invalid data', async () => {
    const dummySchema = yup.object({ 
      body: yup.object({ 
        name: yup.string().required('name is a required field') 
      }) 
    });
    const middleware = validate(dummySchema);
    
    const req = mockRequest({ body: {} });
    const res = mockResponse();
    const next = mockNext();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The given data was invalid.',
      errors: { name: 'name is a required field' } // Notice 'body.' prefix is stripped by the middleware
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should succeed and continue when validation passes', async () => {
    const dummySchema = yup.object({ 
      body: yup.object({ 
        name: yup.string().required('name is a required field') 
      }) 
    });
    const middleware = validate(dummySchema);
    
    const req = mockRequest({ body: { name: 'Test' } });
    const res = mockResponse();
    const next = mockNext();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should pass unexpected errors to the global error handler', async () => {
    // Create a schema that intentionally throws a generic error (not a Yup ValidationError)
    const brokenSchema = {
      validate: jest.fn().mockRejectedValue(new Error('Something went terribly wrong!'))
    } as unknown as yup.AnySchema;

    const middleware = validate(brokenSchema);
    
    const req = mockRequest({ body: {} });
    const res = mockResponse();
    const next = mockNext();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Something went terribly wrong!' }));
    expect(res.status).not.toHaveBeenCalled();
  });
});
