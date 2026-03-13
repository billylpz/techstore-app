export interface BaseEntity{
    id:number | null,
    name:string,
    active:boolean,
    createdAt?:Date | null,
}