import { BaseEntity } from "../../shared/interfaces/base-entity.interface";

export interface User extends BaseEntity{
    lastname:string,
    username:string,
    email:string,
    createdAt:Date,
    active:boolean,
    
}