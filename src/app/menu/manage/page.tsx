'use client';

import { useEffect, useState } from "react";
import { Menu } from "@/types/Menu";
import { getAllMenus, deleteMenu } from "@/libs/menuService";
import { Input, Spinner, Chip } from "@heroui/react";
import CreateMenuModal from "@/components/UI/CreateMenuModal";
import MenuManageCard from "@/components/UI/MenuManageCard";
import { useToast } from '@/hooks/useToast';

export default function MenuManagePage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    // Bộ lọc
    const [searchName, setSearchName] = useState("");
    const [category, setCategory] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const { showError } = useToast();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await getAllMenus();
                setMenus(data);
            } catch (err) {
                console.error(err);
                setError("Không thể tải danh sách món ăn.");
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    // Lọc dữ liệu
    const filteredMenus = menus.filter((menu) => {
        const matchName = menu.Name.toLowerCase().includes(searchName.toLowerCase());
        const matchCategory = category ? menu.Category === category : true;
        const matchStatus = statusFilter ? 
            (statusFilter === "active" ? menu.IsActive : !menu.IsActive) : true;
        return matchName && matchCategory && matchStatus;
    });

    const handleMenuCreate = (newMenu: Menu) => {
        setMenus(prev => [newMenu, ...prev]);
    };

    const handleMenuUpdate = (updatedMenu: Menu) => {
        setMenus(prev => prev.map(menu => 
            menu.MenuID === updatedMenu.MenuID ? updatedMenu : menu
        ));
    };

    const handleMenuDelete = async (menuId: string) => {
        try {
            await deleteMenu(menuId);
            setMenus(prev => prev.filter(menu => menu.MenuID !== menuId));
        } catch (error) {
            console.error('Error deleting menu:', error);
            showError('Có lỗi xảy ra khi xóa món ăn');
            throw error; // Re-throw để component có thể handle
        }
    };

    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner color="secondary" size="lg" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Quản lý Menu</h1>
                <div className="flex items-center gap-2">
                    <Chip color="primary" variant="flat">
                        {filteredMenus.length} món
                    </Chip>
                    <CreateMenuModal onMenuCreate={handleMenuCreate} />
                </div>
            </div>

            {/* Bộ lọc */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                {/* Input tìm kiếm */}
                <div className="col-span-1">
                    <Input
                        type="text"
                        placeholder="Tìm món ăn..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* Select danh mục */}
                <div className="col-span-1">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="">Tất cả danh mục</option>
                        <option value="Main course">Món chính</option>
                        <option value="Side dishes">Món phụ</option>
                        <option value="Drinks">Đồ uống</option>
                    </select>
                </div>

                {/* Select trạng thái */}
                <div className="col-span-1">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Tạm dừng</option>
                    </select>
                </div>

                {/* Cột trống */}
                <div className="hidden lg:block" />
            </div>

            {/* Danh sách món ăn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenus.map((menu) => (
                    <MenuManageCard 
                        key={menu.MenuID} 
                        data={menu}
                        onMenuUpdate={handleMenuUpdate}
                        onMenuDelete={handleMenuDelete}
                    />
                ))}
                {filteredMenus.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">
                            Không tìm thấy món nào phù hợp.
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Thử thay đổi bộ lọc hoặc tạo món mới.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
