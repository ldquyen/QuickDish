'use client';

import { useEffect, useState } from "react";
import { Menu } from "@/types/Menu";
import MenuCard from "@/components/UI/MenuCard";
import { getAllMenus } from "@/libs/menuService";
import { Input, Spinner } from "@heroui/react";
import PreOrderMenuDetailModal from "@/components/UI/PreOrderMenuDetailModal";
import { ItemDetail } from "@/types/ItemDetail";

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [listPreOrder, setListPreOrder] = useState<ItemDetail[]>([]);     //set danh sách món ăn cbi đặt
  // Bộ lọc
  const [searchName, setSearchName] = useState("");
  const [category, setCategory] = useState("");

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
    return matchName && matchCategory;
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
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* Input tìm kiếm - cột 1 */}
        <div className="col-span-1">
          <Input
            type="text"
            placeholder="Tìm món ăn..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Select danh mục - cột 2 */}
        <div className="col-span-1">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Tất cả danh mục</option>
            <option value="Món chính">Món chính</option>
            <option value="Món phụ">Món phụ</option>
            <option value="Đồ uống">Đồ uống</option>
          </select>
        </div>

        {/* Cột trống (có thể dùng col-span-1 nếu cần căn giữa) */}
        <div className="hidden lg:block" />

        {/* Modal button - cột 4, đẩy sang phải */}
        <div className="col-span-1 justify-self-end">
          <PreOrderMenuDetailModal />
        </div>
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
