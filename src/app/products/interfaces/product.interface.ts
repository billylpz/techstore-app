import { Brand } from "../../brands/interfaces/brand.interface";
import { Category } from "../../categories/interfaces/category.interface";
import { BaseEntity } from "../../shared/interfaces/base-entity.interface";
import { ProductImage } from "./product-image.interface";

export interface Product extends BaseEntity{
    description:string,
    price:number,
    stock:number,
    category:Category|null,
    brand:Brand|null,
    images:ProductImage[]
}