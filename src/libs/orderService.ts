import { Order } from "@/types/Order";

const API_URL = "https://68d4945f214be68f8c69a2ca.mockapi.io/Order"

export async function getAllOrders() : Promise<Order[]> {
    const res = await fetch(API_URL);
    if(!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
}

export async function createOrder(data: Order) : Promise<Order> {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if(!res.ok) throw new Error("Failed to create order");
    return res.json();
}

export async function updateOrder(id: string, data: Order) : Promise<Order> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if(!res.ok) throw new Error("Failed to update order");
    return res.json();
}

export async function deleteOrder(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if(!res.ok) throw new Error("Failed to delete order");
    return;
}
