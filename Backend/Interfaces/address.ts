import { Document } from "mongoose";
import { Users } from "./users";

export interface Address extends Document{
    country: string;
    city: string;
    street: string;
    apartmentNo: number;
    user: Users;
}