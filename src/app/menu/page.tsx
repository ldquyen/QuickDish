'use client';

import { useEffect, useState } from "react";
import { Menu } from "@/types/Menu";
import MenuCard from "@/components/UI/MenuCard";
import { getAllMenus } from "@/libs/menuService";
import { Input, Spinner } from "@heroui/react";
import PreOrderMenuDetailModal from "@/components/UI/PreOrderMenuDetailModal";

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
// MenuPage.tsx
const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
const [isOrderModalOpen, setOrderModalOpen] = useState(false);
const [orderList, setOrderList] = useState<{ menu: Menu; quantity: number }[]>([]);

// Callback khi người dùng đặt món
const handleOrder = (menu: Menu) => {
  setSelectedMenu(menu);
  setOrderModalOpen(true);
};

const handleConfirmOrder = (menu: Menu, quantity: number) => {
  setOrderList((prev) => [...prev, { menu, quantity }]);
};
  // Bộ lọc
  const [searchName, setSearchName] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

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
    const matchMinPrice = minPrice !== undefined ? menu.Price >= minPrice : true;
    const matchMaxPrice = maxPrice !== undefined ? menu.Price <= maxPrice : true;

    return matchName && matchCategory && matchMinPrice && matchMaxPrice;
  });

  if (error) return <div className="text-red-500">{error}</div>;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner color="secondary" size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Menu</h1>

      {/* Bộ lọc */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Tìm món ăn..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Tất cả danh mục</option>
          <option value="Món chính">Món chính</option>
          <option value="Món phụ">Món phụ</option>
          <option value="Đồ uống">Đồ uống</option>
        </select>
        <PreOrderMenuDetailModal />
        {/* <input
          type="number"
          placeholder="Giá từ"
          value={minPrice ?? ""}
          onChange={(e) =>
            setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)
          }
          className="border border-gray-300 rounded-lg px-3 py-2"
        />

        <input
          type="number"
          placeholder="Giá đến"
          value={maxPrice ?? ""}
          onChange={(e) =>
            setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)
          }
          className="border border-gray-300 rounded-lg px-3 py-2"
        /> */}
      </div>

      {/* Danh sách món ăn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenus.map((menu) => (
          <MenuCard key={menu.MenuID} data={menu} />
        ))}
        {filteredMenus.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            Không tìm thấy món nào phù hợp.
          </p>
        )}
      </div>
    </div>
  );
}
