import { User } from "../../users/interfaces/user.interface";
import { OrderItem } from "./order-item.interface";

export interface Order {
    id?: number;
    user?: User;
    userId?: number | null;
    name: string;
    lastname: string;
    document: string;
    phoneNumber: string;
    email: string;
    shippingAddress: string;
    shippingDistrict: string;
    shippingCity: string;
    shippingAditionalInfo?: string;
    createdAt?: Date | string;
    orderItems?: OrderItem[];
    totalAmount?: number;
}