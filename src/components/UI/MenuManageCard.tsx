import { Menu } from "@/types/Menu";
import { Card, CardBody, CardHeader, Image, Button, Chip } from "@heroui/react";
import { useState } from "react";
import ViewMenuModal from "./ViewMenuModal";
import EditMenuModal from "./EditMenuModal";
import { useToast } from '@/hooks/useToast';

interface Props {
    data: Menu;
    onMenuUpdate: (updatedMenu: Menu) => void;
    onMenuDelete: (menuId: string) => void;
}

export default function MenuManageCard({ data, onMenuUpdate, onMenuDelete }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { showSuccess, showError } = useToast();

    const handleDelete = async () => {
        if (confirm(`Bạn có chắc muốn xóa món "${data.Name}"?`)) {
            setIsDeleting(true);
            try {
                await onMenuDelete(data.MenuID);
                showSuccess('Xóa món ăn thành công!');
            } catch (error) {
                console.error('Error deleting menu:', error);
                showError('Có lỗi xảy ra khi xóa món ăn');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <div className="flex items-center justify-between w-full mb-2">
                    <h4 className="font-bold text-large">{data.Name}</h4>
                    <Chip 
                        color={data.IsActive ? "success" : "danger"} 
                        variant="flat" 
                        size="sm"
                    >
                        {data.IsActive ? "Hoạt động" : "Tạm dừng"}
                    </Chip>
                </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <Image
                    alt={data.Name}
                    className="object-cover rounded-xl w-full"
                    src={data.URLImage}
                    width="100%"
                    height={200}
                />
                <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                            {data.Price.toLocaleString('vi-VN')}₫
                        </span>
                        <span className="text-sm text-gray-500">
                            SL: {data.Quantity}
                        </span>
                    </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                    <ViewMenuModal menu={data} />
                    <EditMenuModal 
                        menu={data} 
                        onMenuUpdate={onMenuUpdate}
                    />
                    <Button
                        color="danger"
                        variant="light"
                        size="sm"
                        onPress={handleDelete}
                        isLoading={isDeleting}
                        className="flex-1"
                    >
                        Xóa
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
