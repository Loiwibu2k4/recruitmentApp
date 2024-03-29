import mongoose from "mongoose";
import { Roles } from "src/role/role.enum";

export interface IUser {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    role: Roles;
}