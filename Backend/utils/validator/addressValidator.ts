import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middleware/validatorMiddleware";
import addressModel from "../../models/addressModel";


export const createAddressValidator: RequestHandler[] = [
    check('country').notEmpty().withMessage('Country is Required'),
    check('city').notEmpty().withMessage('City is Required'),
    check('street').notEmpty().withMessage('Street is required'),
    check('apartmentNo').notEmpty().withMessage('Apartment number is required'),
    validatorMiddleware
]

export const updateAddressValidator: RequestHandler[] = [
    check('id').isMongoId().withMessage('Invalid Mongo Id')
        .custom(async (val, { req }) => {
        const address = await addressModel.findById(val);
        if (!address) { throw new Error('Address not found') }
        if (address.user._id!.toString() !== req.user._id.toString()) {
            throw new Error('You are not allowed to perform this action')
        }
        return true;
        }),
    validatorMiddleware
]

export const getAddressValidator: RequestHandler[] = [
    check('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware
]

export const deleteAddressValidator: RequestHandler[] = [
    check('id').isMongoId().withMessage('Invalid Mongo Id')
        .custom(async (val, { req }) => {
        if (req.user.role === 'user') {
            const address = await addressModel.findById(val);
            if (!address) { throw new Error('Address not found') }
            if (address.user._id!.toString() !== req.user._id.toString()) {
            throw new Error('You are not allowed to perform this action')
            }
        }
        return true;
        }),
    validatorMiddleware
]