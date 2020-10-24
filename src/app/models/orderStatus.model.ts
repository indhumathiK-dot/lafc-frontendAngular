export interface OrdersStatus {
    success: number;
    error: any[];
    data: OrderStatus[];
}

export interface OrderStatus {
    order_status_id: string;
    name: string;
}