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
  NumberInput,
} from "@heroui/react";

export default function CreateMenuModal() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Create new</Button>
      <Modal isOpen={isOpen} size="lg" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create new in menu</ModalHeader>
              <ModalBody>
                <Input label="Name" type="text" />
                <Textarea className="max-h-xs" label="Description" />
                <Textarea className="max-h-xs" label="Ingredients" />
                <Input label="Image URL" type="text" />
                <NumberInput placeholder="Enter the amount" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" onPress={onClose}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

/*
 MenuID: string;
    Name: string;
    Description: string;
    Category: string;                // Món chính | Món phụ | Đồ uống
    Price: number;
    Quantity: number;
    URLImage: string;
    Ingredients: string;             // nguyên liệu chi tiết
    IsActive: boolean;
*/