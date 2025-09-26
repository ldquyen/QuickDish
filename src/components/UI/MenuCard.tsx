import { Menu } from "@/types/Menu";
import {Card, CardHeader, CardFooter, Image, Button} from "@heroui/react";
import { usePreOrder } from '@/contexts/PreOrderContext';

interface Props{
    data: Menu
}

export default function MenuCard({data} : Props) {
  const { addToPreOrder } = usePreOrder();

  const handleOrder = () => {
    addToPreOrder(data, 1);
  };

  return (
      <Card isFooterBlurred className="w-[400px] h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
        </CardHeader>
        <Image
          removeWrapper
          alt="Card example background"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src= {data.URLImage}
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <p className="text-white text-tiny">{data.Name}.</p>
            <p className="text-green-500 text-300px">{data.Price.toLocaleString('vi-VN')}₫</p>
          </div>
          <Button 
            className="text-tiny" 
            color="secondary" 
            radius="full" 
            size="sm"
            onPress={handleOrder}
          >
            Order
          </Button>
        </CardFooter>
      </Card>
  );
}
