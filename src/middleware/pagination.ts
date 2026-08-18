import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 50;
const API_MAX_SIZE = 100; // API-level limit, independent of the DAL

const parseFields = (value: unknown): string[] => {
  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === 'string') {
    return value.split(',').map((field) => field.trim()).filter(Boolean);
  }

  return [];
};

const parseQueryNumber = (fieldName: string) =>
  yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === undefined || originalValue === null
        ? undefined
        : value,
    )
    .typeError(`The ${fieldName} field must be a number.`);

const paginationQuerySchema = yup.object({
  page: parseQueryNumber('page')
    .integer('The page field must be an integer.')
    .min(1, 'The page field must be at least 1.')
    .default(DEFAULT_PAGE),
  size: parseQueryNumber('size')
    .integer('The size field must be an integer.')
    .min(1, 'The size field must be at least 1.')
    .max(API_MAX_SIZE, `The size field cannot be greater than ${API_MAX_SIZE}.`)
    .default(DEFAULT_SIZE),
  fields: yup
    .array()
    .of(yup.string().required())
    .transform((_value, originalValue) => parseFields(originalValue))
    .optional()
    .default([]),
});

export interface PaginationOptions {
  allowedFields?: string[];
}

export const paginationMiddleware = (options?: PaginationOptions) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, size, fields } = await paginationQuerySchema.validate(
        req.query, 
        { stripUnknown: true, abortEarly: false }
      );
      
      let validFields: string[] = fields as string[] || [];
      
      if (validFields && options?.allowedFields) {
        validFields = validFields.filter(field => options.allowedFields!.includes(field));
        if (validFields.length === 0) {
          validFields = [];
        }
      }

      res.locals.pagination = {
        limit: size,
        skip: (page - 1) * size,
        fields: validFields,
      };
      
      return next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const formattedErrors: Record<string, string> = {};
        
        error.inner.forEach(e => {
          if (e.path && !formattedErrors[e.path]) {
            formattedErrors[e.path] = e.message;
          }
        });

        if (error.inner.length === 0 && error.path) {
          formattedErrors[error.path] = error.message;
        }

        res.status(400).json({
          message: 'The given data was invalid.',
          errors: formattedErrors
        });
        return;
      }
      return next(error);
    }
  };
