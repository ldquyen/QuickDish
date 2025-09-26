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
  Card,
  CardBody,
  Divider,
  Chip,
} from "@heroui/react";
import { usePreOrder } from '@/contexts/PreOrderContext';
import { useState } from 'react';
import { createOrder } from '@/libs/orderService';
import { Order, OrderStatus } from '@/types/Order';
import { useToast } from '@/hooks/useToast';

export default function PreOrderMenuDetailModal() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { preOrderItems, removeFromPreOrder, updateQuantity, clearPreOrder, getTotalAmount } = usePreOrder();
  const [tableNumber, setTableNumber] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const handleOrder = async () => {
    if (!tableNumber.trim()) {
      showWarning('Vui lòng nhập số bàn');
      return;
    }

    if (preOrderItems.length === 0) {
      showWarning('Giỏ hàng trống');
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder: Order = {
        OrderID: '', // API sẽ tự tạo
        Table: tableNumber,
        Items: preOrderItems,
        TotalAmount: getTotalAmount(),
        Status: OrderStatus.Processing,
        CreatedAt: Math.floor(Date.now() / 1000),
        UpdatedAt: Math.floor(Date.now() / 1000),
        Note: note.trim() || undefined
      };

      await createOrder(newOrder);
      
      // Reset form và clear pre-order
      setTableNumber('');
      setNote('');
      clearPreOrder();
      
      showSuccess('Đặt hàng thành công!');
      onOpenChange();
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAll = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả món đã chọn?')) {
      clearPreOrder();
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Pre order ({preOrderItems.length})
      </Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        size="4xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between w-full">
                  <span>Pre order</span>
                  <Chip color="primary" variant="flat">
                    {preOrderItems.length} món
                  </Chip>
                </div>
              </ModalHeader>
              <ModalBody className="max-h-[60vh] overflow-y-auto">
                {/* Form thông tin đặt hàng */}
                  <Input 
                    label="Số bàn" 
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    isRequired
                  />
                  <Textarea 
                    label="Ghi chú" 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />

                <Divider className="my-4" />

                {/* Danh sách món đã chọn */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Danh sách món đã chọn:</h3>
                  
                  {preOrderItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Chưa có món nào được chọn</p>
                  ) : (
                    preOrderItems.map((item) => (
                      <Card key={item.MenuID} className="p-3">
                        <CardBody className="p-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.Name}</h4>
                              <p className="text-sm text-gray-600">
                                {item.Price.toLocaleString('vi-VN')}₫ × {item.Quantity} = {item.TotalPrice.toLocaleString('vi-VN')}₫
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {/* Nút giảm số lượng */}
                              <Button
                                size="sm"
                                variant="flat"
                                color="default"
                                onPress={() => updateQuantity(item.MenuID, item.Quantity - 1)}
                                isDisabled={item.Quantity <= 1}
                              >
                                -
                              </Button>
                              
                              <span className="min-w-[2rem] text-center font-medium">
                                {item.Quantity}
                              </span>
                              
                              {/* Nút tăng số lượng */}
                              <Button
                                size="sm"
                                variant="flat"
                                color="default"
                                onPress={() => updateQuantity(item.MenuID, item.Quantity + 1)}
                              >
                                +
                              </Button>
                              
                              {/* Nút xóa */}
                              <Button
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => removeFromPreOrder(item.MenuID)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))
                  )}
                </div>

                {/* Tổng tiền */}
                {preOrderItems.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Tổng cộng:</span>
                      <span className="text-xl font-bold text-green-600">
                        {getTotalAmount().toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={handleDeleteAll}
                  isDisabled={preOrderItems.length === 0}
                >
                  Xóa tất cả
                </Button>
                <Button 
                  color="success" 
                  onPress={handleOrder}
                  isLoading={isSubmitting}
                  isDisabled={preOrderItems.length === 0 || !tableNumber.trim()}
                >
                  Đặt hàng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
