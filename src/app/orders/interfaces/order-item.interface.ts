import { Product } from "../../products/interfaces/product.interface";

export interface OrderItem {
    product: Product,
    price: number,
    quantity: number,
    subTotalAmount: number
}
