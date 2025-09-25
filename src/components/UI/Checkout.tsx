"use client";
import React, { useEffect, useRef, useState } from "react";
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
export default function Checkout({ totalAmount }: { totalAmount: number }) {
    //https://qr.sepay.vn/img?bank=TPBank&acc=99797398888&template=qronly&amount=200000&des=
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [amount, setAmount] = useState(0);
     useEffect(() => {
        setAmount(totalAmount);
    }, [totalAmount]);   

    const qrImageUrl = `https://qr.sepay.vn/img?bank=TPBank&acc=99797398888&template=qronly&amount=${amount}&des=`;

    return (
    <>
      <Button onPress={onOpen}>Thanh toán</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Thông tin chuyển khoản</ModalHeader>
              <ModalBody>
                <div className="flex justify-center">
                  <div className="p-2 border-4 border-purple-500 rounded-md animate-border-glow">
                    <img src={qrImageUrl} alt="QR Code" className="w-64 h-64 object-contain" />
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
                <Button color="success" variant="light" onPress={onClose}>
                  Xác nhận
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