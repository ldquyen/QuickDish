import { ItemDetail } from "./ItemDetail";

export interface Order {
    OrderID: string;
    Table: string;
    Items: ItemDetail[];
    TotalAmount: number;
    Status: OrderStatus;
    CreatedAt: Date;
    UpdatedAt: Date;
    Note?: string;
}

export enum OrderStatus {
    Processing = 'Đang xử lý',
    Serving = 'Đang phục vụ',
    Paid = 'Đã thanh toán'
}