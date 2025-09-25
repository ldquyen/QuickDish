import { Menu } from "@/types/Menu";


const API_URL = "https://68d4945f214be68f8c69a2ca.mockapi.io/Menu"

export async function getAllMenus() : Promise<Menu[]> {
    const res = await fetch(API_URL);
    if(!res.ok) throw new Error("Failed to fetch menus");
    return res.json();
}

export async function getMenuDetails(id: string) : Promise<Menu> {
    const res = await fetch(`${API_URL}/${id}`);
    if(!res.ok) throw new Error("Failed to fetch menu details");
    return res.json();
}

export async function createMenu(data: Partial<Menu>) : Promise<Menu> {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if(!res.ok) throw new Error("Failed to create menu");
    return res.json();
}

export async function updateMenu(id: string, data: Partial<Menu>) : Promise<Menu> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if(!res.ok) throw new Error("Failed to update menu");
    return res.json();
}

export async function deleteMenu(id: string) : Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if(!res.ok) throw new Error("Failed to delete menu");
    return;
}
