import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Card,
  CardBody,
  Divider,
  Chip,
  Checkbox,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types/Order";
import { updateOrder } from "@/libs/orderService";
import { useToast } from '@/hooks/useToast';

interface EditOrderDrawerProps {
  order: Order;
  onOrderUpdate?: (updatedOrder: Order) => void;
}

export default function EditOrderDrawer({ order, onOrderUpdate }: EditOrderDrawerProps) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [editedOrder, setEditedOrder] = useState<Order>(order);
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    setEditedOrder(order);
  }, [order]);

  const handleItemServedChange = (menuId: string, isServed: boolean) => {
    setEditedOrder(prev => ({
      ...prev,
      Items: prev.Items.map(item =>
        item.MenuID === menuId ? { ...item, IsServed: isServed } : item
      )
    }));
  };

  const checkAndUpdateStatus = (items: typeof editedOrder.Items) => {
    const allServed = items.every(item => item.IsServed);
    // const hasServedItems = items.some(item => item.IsServed);
    
    if (allServed && editedOrder.Status === OrderStatus.Processing) {
      return OrderStatus.Serving;
    }
    return editedOrder.Status;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newStatus = checkAndUpdateStatus(editedOrder.Items);
      const updatedOrder = {
        ...editedOrder,
        Status: newStatus,
        UpdatedAt: Math.floor(Date.now() / 1000)
      };

      await updateOrder(order.OrderID, updatedOrder);
      
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }
      
      showSuccess('Cập nhật đơn hàng thành công!');
      onOpenChange();
    } catch (error) {
      console.error('Error updating order:', error);
      showError('Có lỗi xảy ra khi cập nhật đơn hàng');
    } finally {
      setIsSaving(false);
    }
  };

  const isReadOnly = order.Status === OrderStatus.Paid;
  const allItemsServed = editedOrder.Items.every(item => item.IsServed);
  // const hasServedItems = editedOrder.Items.some(item => item.IsServed);

  return (
    <>
      <Button 
        onPress={onOpen} 
        color="primary" 
        variant="light" 
        size="sm"
      >
        {isReadOnly ? 'View' : 'Edit'}
      </Button>
      <Drawer isOpen={isOpen} size="3xl" onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between w-full">
                  <span>{isReadOnly ? 'View Order' : 'Edit Order'}</span>
                  <div className="flex items-center gap-2">
                    <Chip 
                      color={
                        editedOrder.Status === OrderStatus.Processing ? "warning" :
                        editedOrder.Status === OrderStatus.Serving ? "primary" :
                        "success"
                      }
                      variant="flat"
                    >
                      {editedOrder.Status}
                    </Chip>
                    {allItemsServed && editedOrder.Status === OrderStatus.Processing && (
                      <Chip color="success" variant="flat" size="sm">
                        Ready to Serve
                      </Chip>
                    )}
                  </div>
                </div>
              </DrawerHeader>
              <DrawerBody className="max-h-[70vh] overflow-y-auto">
                {/* Thông tin đơn hàng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card className="p-4">
                    <CardBody className="p-0">
                      <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">{editedOrder.OrderID}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bàn:</span>
                          <span className="font-medium">{editedOrder.Table}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tổng tiền:</span>
                          <span className="font-medium text-green-600">
                            {editedOrder.TotalAmount.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày tạo:</span>
                          <span className="font-medium">
                            {new Date(editedOrder.CreatedAt * 1000).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        {editedOrder.Note && (
                          <div className="mt-2">
                            <span className="text-gray-600">Ghi chú:</span>
                            <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                              {editedOrder.Note}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="p-4">
                    <CardBody className="p-0">
                      <h3 className="font-semibold mb-2">Trạng thái phục vụ</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tổng món:</span>
                          <span className="font-medium">{editedOrder.Items.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Đã phục vụ:</span>
                          <span className="font-medium text-green-600">
                            {editedOrder.Items.filter(item => item.IsServed).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Chưa phục vụ:</span>
                          <span className="font-medium text-orange-600">
                            {editedOrder.Items.filter(item => !item.IsServed).length}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <Divider className="my-4" />

                {/* Danh sách món ăn */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Danh sách món ăn:</h3>
                  
                        {editedOrder.Items.map((item) => (
                    <Card key={item.MenuID} className="p-4">
                      <CardBody className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <Checkbox
                              isSelected={item.IsServed}
                              onValueChange={(checked) => handleItemServedChange(item.MenuID, checked)}
                              isDisabled={isReadOnly}
                              color="success"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.Name}</h4>
                              <p className="text-sm text-gray-600">
                                Số lượng: {item.Quantity} × {item.Price.toLocaleString('vi-VN')}₫ = {item.TotalPrice.toLocaleString('vi-VN')}₫
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.IsServed ? (
                              <Chip color="success" variant="flat" size="sm">
                                Đã phục vụ
                              </Chip>
                            ) : (
                              <Chip color="warning" variant="flat" size="sm">
                                Chưa phục vụ
                              </Chip>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>

                {/* Thông báo trạng thái */}
                {allItemsServed && editedOrder.Status === OrderStatus.Processing && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      ✅ Tất cả món đã được phục vụ! Trạng thái sẽ tự động chuyển sang &quot;Serving&quot;.
                    </p>
                  </div>
                )}
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                {!isReadOnly && (
                  <Button 
                    color="success" 
                    onPress={handleSave}
                    isLoading={isSaving}
                  >
                    Lưu thay đổi
                </Button>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
