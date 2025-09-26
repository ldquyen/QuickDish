"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Snippet,
  Code,
} from "@heroui/react";
import { updateOrder, getAllOrders } from "@/libs/orderService";
import { OrderStatus } from "@/types/Order";
import { useToast } from '@/hooks/useToast';
interface CheckoutProps {
    totalAmount: number;
    orderId?: string;
    onPaymentSuccess?: () => void;
}

export default function Checkout({ totalAmount, orderId, onPaymentSuccess }: CheckoutProps) {
    //https://qr.sepay.vn/img?bank=TPBank&acc=99797398888&template=qronly&amount=200000&des=
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [amount, setAmount] = useState(0);
    const [isConfirming, setIsConfirming] = useState(false);
    const { showSuccess, showError, showWarning } = useToast();
    
    useEffect(() => {
        setAmount(totalAmount);
    }, [totalAmount]);   

    const qrImageUrl = `https://qr.sepay.vn/img?bank=TPBank&acc=99797398888&template=qronly&amount=${amount}&des=`;

    const handleConfirmPayment = async () => {
        if (!orderId) {
            showWarning('Không tìm thấy thông tin đơn hàng');
            return;
        }

        setIsConfirming(true);
        try {
            // Giả lập việc cập nhật status thành Paid
            // Trong thực tế, bạn sẽ cần fetch order hiện tại trước khi update
            const currentOrder = await getAllOrders();
            const orderToUpdate = currentOrder.find(order => order.OrderID === orderId);
            
            if (!orderToUpdate) {
                showError('Không tìm thấy đơn hàng');
                return;
            }

            const updatedOrder = {
                ...orderToUpdate,
                Status: OrderStatus.Paid,
                UpdatedAt: Math.floor(Date.now() / 1000)
            };

            await updateOrder(orderId, updatedOrder);
            
            if (onPaymentSuccess) {
                onPaymentSuccess();
            }
            
            showSuccess('Thanh toán thành công!');
            onOpenChange();
        } catch (error) {
            console.error('Error confirming payment:', error);
            showError('Có lỗi xảy ra khi xác nhận thanh toán');
        } finally {
            setIsConfirming(false);
        }
    };

    return (
    <>
      <Button color="success" variant="light" size="sm" onPress={onOpen}>Checkout</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Banking information</ModalHeader>
              <ModalBody>
                <div className="flex justify-center">
                  <div className="p-2 border-4 border-purple-500 rounded-md animate-border-glow">
                    <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center">
                      <img src={qrImageUrl} alt="QR Code" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
                <br /> 
                <Snippet color="secondary">99797398888</Snippet>
                <Code color="secondary">LE DAI QUYEN - TPBank
                    <p>
                    <strong>{amount.toLocaleString()} VND</strong>
                    </p>
                </Code>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button 
                  color="success" 
                  onPress={handleConfirmPayment}
                  isLoading={isConfirming}
                  isDisabled={!orderId}
                >
                  Xác nhận thanh toán
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <style jsx>{`
        @keyframes border-glow {
          0% {
            box-shadow: 0 0 5px #a855f7, 0 0 10px #a855f7, 0 0 20px #a855f7;
          }
          50% {
            box-shadow: 0 0 15px #9333ea, 0 0 30px #9333ea, 0 0 45px #9333ea;
          }
          100% {
            box-shadow: 0 0 5px #a855f7, 0 0 10px #a855f7, 0 0 20px #a855f7;
          }
        }

        .animate-border-glow {
          animation: border-glow 1.5s infinite;
        }
      `}</style>
    </>
  );
}