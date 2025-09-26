'use client';

import { useEffect, useState } from "react";
import { Menu } from "@/types/Menu";
import MenuCard from "@/components/UI/MenuCard";
import { getAllMenus } from "@/libs/menuService";
import { Input, Spinner } from "@heroui/react";
import PreOrderMenuDetailModal from "@/components/UI/PreOrderMenuDetailModal";
import { motion } from "framer-motion";
// import { ItemDetail } from "@/types/ItemDetail";

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSlide, setShowSlide] = useState(true);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
    // const [listPreOrder, setListPreOrder] = useState<ItemDetail[]>([]);     //set danh sách món ăn cbi đặt
  // Bộ lọc
  const [searchName, setSearchName] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getAllMenus();
        setMenus(data);
        setApiLoaded(true);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách món ăn.");
        setApiLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    // Start API call immediately
    fetchMenus();

    // Minimum 2 seconds timer
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 3000);

    return () => clearTimeout(minTimer);
  }, []);

  // Hide slide when both API is loaded and minimum time has elapsed
  useEffect(() => {
    if (apiLoaded && minTimeElapsed) {
      setShowSlide(false);
    }
  }, [apiLoaded, minTimeElapsed]);

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
      {/* Slide Overlay */}
      {showSlide && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            {/* <motion.img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=800&fit=crop"
              alt="BAMI Restaurant"
              className="w-full max-w-md h-64 object-cover rounded-lg shadow-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            /> */}
            
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              BAMI Restaurant
            </motion.h1>
            
            <motion.h2
              className="text-2xl md:text-3xl mb-6 opacity-90"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Khám phá hương vị Hamster
            </motion.h2>
            
            <motion.p
              className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Những món ăn truyền thống đậm đà
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Spinner color="white" size="lg" />
            </motion.div>
          </div>
        </motion.div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center">Menu</h1>

      {/* Bộ lọc */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* Input tìm kiếm - cột 1 */}
        <div className="col-span-1">
          <Input
            type="text"
            placeholder="Find name..."
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
            <option value="">All category</option>
            <option value="Main course">Main course</option>
            <option value="Side dishes">Side dishes</option>
            <option value="Drinks">Drinks</option>
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
