export interface Menu {
    MenuID: string;
    Name: string;
    Description: string;
    Category: string;                // Món chính | Món phụ | Đồ uống
    Price: number;
    Quantity: number;
    URLImage: string;
    Ingredients: string;             // nguyên liệu chi tiết
    IsActive: boolean;
}

export interface CreateMenuRequest {
    Name: string;
    Description: string;
    Category: string;               
    Price: number;
    Quantity: number;
    URLImage: string;
    Ingredients: string;             
    IsActive: boolean;
}

// export interface UpdateMenuRequest {
    
// }

// export interface DeleteMenuRequest {

// }