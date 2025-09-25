import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Avatar, Button} from "@heroui/react";
import { Menu } from "@/types/Menu";

interface Props{
    data: Menu
}

export default function PreOrderCard({data} : Props) {
  const [isFollowed, setIsFollowed] = React.useState(false);

  return (
    <Card className="max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={data.URLImage}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{data.Name}</h4>
            <h5 className="text-small tracking-tight text-default-400">{data.Price}</h5>
            <h5 className="text-small tracking-tight text-default-400">{data.Quantity}</h5>
          </div>
        </div>
        <Button
          className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
          color="danger"
          variant="light"
          radius="full"
          size="sm"
          onPress={() => setIsFollowed(!isFollowed)}
        >
          Delete
        </Button>
      </CardHeader>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className=" text-default-400 text-small">Quantity:</p>
          <p className="font-semibold text-default-400 text-small">{data.Quantity}</p>
        </div>
        <div className="flex gap-1">
          <p className="text-default-400 text-small">Total:</p>
          <p className="font-semibold text-default-400 text-small">{(data.Quantity * data.Price).toLocaleString('vi-VN')}₫</p>
        </div>
      </CardFooter>
    </Card>
  );
}

