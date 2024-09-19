import { Schema, model } from "mongoose";
import { Address } from "../Interfaces/address";


export const addressSchema: Schema = new Schema<Address>({
    country: {type: String, required: true},
    city: { type: String, required: true },
    street: { type: String, required: true },
    apartmentNo: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
}, { timestamps: true });

addressSchema.pre<Address>(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name image' })
    next()
})

const addressModel = model<Address>('address', addressSchema);

export default addressModel;