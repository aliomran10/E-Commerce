import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middleware/validatorMiddleware";

export const addProductToCartValidator: RequestHandler[] = [
  check('product')
    .notEmpty().withMessage('Product required')
    .isMongoId().withMessage('Invalid Mongo id'),
  validatorMiddleware
]

export const removeProductFromCartValidator: RequestHandler[] = [
  check('itemId').isMongoId().withMessage('Invalid Mongo id'),
  validatorMiddleware
]

export const updateProductQuantityValidator: RequestHandler[] = [
  check('itemId').isMongoId().withMessage('Invalid Mongo id'),
  check('quantity')
    .notEmpty().withMessage('Quantity required')
    .isNumeric().withMessage('Quantity must be a number').toInt()
    .custom((val: number) => {
      if (val <= 0) {
        throw new Error('Invalid quantity')
      }
      return true;
    }),
  validatorMiddleware
]