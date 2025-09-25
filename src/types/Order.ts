import { ItemDetail } from "./ItemDetail";

export interface Order {
    OrderID: string;
    Table: string;
    Items: ItemDetail[];
    TotalAmount: number;
    Status: OrderStatus;
    CreatedAt: number;
    UpdatedAt: number;
    Note?: string;
}

export enum OrderStatus {
  Processing = "Processing",
  Serving = "Serving",
  Paid = "Paid"
}