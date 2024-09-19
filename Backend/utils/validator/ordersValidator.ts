import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middleware/validatorMiddleware";

export const createOrderValidator: RequestHandler[] = [
  check('address').optional(),
  validatorMiddleware
]

export const getOrderValidator: RequestHandler[] = [
  check('id').isMongoId().withMessage('Invalid Mongo Id'),
  validatorMiddleware
]