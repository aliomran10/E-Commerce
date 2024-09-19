import { Router } from "express";
import { createAddress, deleteAddress, getAddress, getAddresses, updateAddress } from "../controllers/address";
import { allowedTo, checkActive, protectRoutes } from "../controllers/authorization";
import { createAddressValidator, deleteAddressValidator, getAddressValidator, updateAddressValidator } from "../utils/validator/addressValidator";

const addressRoute: Router = Router({ mergeParams: true });

addressRoute.route('/')
.get(getAddresses)
.post(createAddressValidator, protectRoutes, checkActive, allowedTo('user'), createAddress);

addressRoute.route('/:id')
.get(getAddressValidator, getAddress)
.put(updateAddressValidator, protectRoutes, checkActive, allowedTo('user'), updateAddress)
.delete(deleteAddressValidator, protectRoutes, checkActive, allowedTo('manager', 'admin', 'user'), deleteAddress);

export default addressRoute;