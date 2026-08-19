import { Request, Response, NextFunction } from 'express';
import { AnySchema, ValidationError } from 'yup';

export const validate = (schema: AnySchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      }, { abortEarly: false, stripUnknown: true });
      
      res.locals.validated = validated;

      return next();
    } catch (error) {
      if (error instanceof ValidationError) {
        const formattedErrors: Record<string, string> = {};
        
        error.inner.forEach(e => {
          if (e.path) {
            // Strip the 'body.', 'query.', or 'params.' prefix for a cleaner response
            const cleanPath = e.path.replace(/^(body|query|params)\./, '');
            // Only keep the first error message for a given field
            if (!formattedErrors[cleanPath]) {
              formattedErrors[cleanPath] = e.message;
            }
          }
        });

        res.status(400).json({
          message: 'The given data was invalid.',
          errors: formattedErrors
        });
        return;
      }
      return next(error);
    }
  };
