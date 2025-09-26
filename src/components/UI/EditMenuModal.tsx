import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { Menu, CreateMenuRequest } from "@/types/Menu";
import { updateMenu } from "@/libs/menuService";
import { useToast } from '@/hooks/useToast';

interface EditMenuModalProps {
  menu: Menu;
  onMenuUpdate: (updatedMenu: Menu) => void;
}

const categories = [
  { key: "Main course", label: "Món chính" },
  { key: "Side dishes", label: "Món phụ" },
  { key: "Drinks", label: "Đồ uống" },
];

export default function EditMenuModal({ menu, onMenuUpdate }: EditMenuModalProps) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [formData, setFormData] = useState<CreateMenuRequest>({
    Name: "",
    Description: "",
    Category: "",
    Price: 0,
    Quantity: 0,
    URLImage: "",
    Ingredients: "",
    IsActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  useEffect(() => {
    if (menu) {
      setFormData({
        Name: menu.Name,
        Description: menu.Description,
        Category: menu.Category,
        Price: menu.Price,
        Quantity: menu.Quantity,
        URLImage: menu.URLImage,
        Ingredients: menu.Ingredients,
        IsActive: menu.IsActive,
      });
    }
  }, [menu]);

  const handleInputChange = (field: keyof CreateMenuRequest, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.Name.trim() || !formData.Category || formData.Price <= 0) {
      showWarning('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSaving(true);
    try {
      const updatedMenu = await updateMenu(menu.MenuID, formData);
      onMenuUpdate(updatedMenu);
      showSuccess('Cập nhật món ăn thành công!');
      onOpenChange();
    } catch (error) {
      console.error('Error updating menu:', error);
      showError('Có lỗi xảy ra khi cập nhật món ăn');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="secondary" variant="light" size="sm">
        Sửa
      </Button>
      <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chỉnh sửa món ăn
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Tên món ăn"
                    placeholder="Nhập tên món ăn..."
                    value={formData.Name}
                    onChange={(e) => handleInputChange('Name', e.target.value)}
                    isRequired
                  />
                  
                  <Select
                    label="Danh mục"
                    placeholder="Chọn danh mục"
                    selectedKeys={[formData.Category]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      handleInputChange('Category', selectedKey);
                    }}
                    isRequired
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.key}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Giá (VND)"
                    type="number"
                    placeholder="Nhập giá..."
                    value={formData.Price.toString()}
                    onChange={(e) => handleInputChange('Price', parseInt(e.target.value) || 0)}
                    isRequired
                  />

                  <Input
                    label="Số lượng"
                    type="number"
                    placeholder="Nhập số lượng..."
                    value={formData.Quantity.toString()}
                    onChange={(e) => handleInputChange('Quantity', parseInt(e.target.value) || 0)}
                    isRequired
                  />

                  <Input
                    label="URL hình ảnh"
                    placeholder="Nhập URL hình ảnh..."
                    value={formData.URLImage}
                    onChange={(e) => handleInputChange('URLImage', e.target.value)}
                    className="md:col-span-2"
                  />

                  <Textarea
                    label="Mô tả"
                    placeholder="Nhập mô tả món ăn..."
                    value={formData.Description}
                    onChange={(e) => handleInputChange('Description', e.target.value)}
                    className="md:col-span-2"
                    minRows={3}
                  />

                  <Textarea
                    label="Nguyên liệu"
                    placeholder="Nhập nguyên liệu..."
                    value={formData.Ingredients}
                    onChange={(e) => handleInputChange('Ingredients', e.target.value)}
                    className="md:col-span-2"
                    minRows={3}
                  />

                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.IsActive}
                      onChange={(e) => handleInputChange('IsActive', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="isActive" className="text-sm">
                      Món ăn đang hoạt động
                    </label>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Hủy
                </Button>
                <Button 
                  color="success" 
                  onPress={handleSave}
                  isLoading={isSaving}
                >
                  Lưu thay đổi
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
