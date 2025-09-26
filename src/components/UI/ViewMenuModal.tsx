import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
  Chip,
  Divider,
} from "@heroui/react";
import { Menu } from "@/types/Menu";

interface ViewMenuModalProps {
  menu: Menu;
}

export default function ViewMenuModal({ menu }: ViewMenuModalProps) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="primary" variant="light" size="sm">
        Xem
      </Button>
      <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between w-full">
                  <span>Chi tiết món ăn</span>
                  <Chip 
                    color={menu.IsActive ? "success" : "danger"} 
                    variant="flat"
                  >
                    {menu.IsActive ? "Hoạt động" : "Tạm dừng"}
                  </Chip>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hình ảnh */}
                  <div>
                    <Image
                      alt={menu.Name}
                      className="object-cover rounded-xl w-full"
                      src={menu.URLImage}
                      width={300}
                      height={200}
                    />
                  </div>

                  {/* Thông tin chi tiết */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{menu.Name}</h3>
                      <Chip color="primary" variant="flat" size="sm">
                        {menu.Category}
                      </Chip>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Mô tả:</h4>
                      <p className="text-gray-600">{menu.Description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Nguyên liệu:</h4>
                      <p className="text-gray-600">{menu.Ingredients}</p>
                    </div>

                    <Divider />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600">Giá:</h4>
                        <p className="text-lg font-bold text-green-600">
                          {menu.Price.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600">Số lượng:</h4>
                        <p className="text-lg font-bold">{menu.Quantity}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Menu ID:</h4>
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                        {menu.MenuID}
                      </p>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
