import { Address } from "cluster"
import addressModel from "../models/addressModel"
import { createOne, deleteOne, getAll, getOne, updateOne } from "./refactorHandler"


export const createAddress = createOne<Address>(addressModel)
export const getAddresses = getAll<Address>(addressModel, 'address')
export const getAddress = getOne<Address>(addressModel)
export const updateAddress = updateOne<Address>(addressModel)
export const deleteAddress = deleteOne<Address>(addressModel)
