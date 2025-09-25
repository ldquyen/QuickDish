"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    Button,
    Chip,
    Input,
    Pagination,
} from "@heroui/react";
import { Order } from "@/types/Order";
import { getAllOrders } from "@/libs/orderService";
import Checkout from "@/components/UI/Checkout";
import EditOrderDrawer from "@/components/UI/EditOrderDrawer";

export default function CheckoutPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTable, setSearchTable] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;
    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await getAllOrders();
                setOrders(data);
            } catch (error) {
                console.error("Lỗi load users:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    // Lọc dữ liệu theo table và status
    const filteredOrders = orders.filter((order) => {
        const matchTable = order.Table.toLowerCase().includes(searchTable.toLowerCase());
        const matchStatus = filterStatus ? order.Status === filterStatus : true;
        return matchTable && matchStatus;
    });
     // Sắp xếp giảm dần theo CreatedAt
    const sortedOrders = [...filteredOrders].sort((a, b) => b.CreatedAt - a.CreatedAt);

    // Pagination tính toán
    const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

        // Cắt dữ liệu theo trang hiện tại
    const paginatedOrders = sortedOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset trang về 1 khi filter thay đổi (để tránh lỗi trang vượt quá tổng trang)
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTable, filterStatus]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner color="secondary" size="lg" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Checkout</h1>

                {/* Bộ lọc nằm bên phải */}
                <div className="flex items-center gap-4">
                    <Input
                        type="text"
                        placeholder="Table..."
                        value={searchTable}
                        onChange={(e) => setSearchTable(e.target.value)}
                        size="sm"
                    />
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All status</option>
                        <option value="Processing">Processing</option>
                        <option value="Serving">Serving</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>
            </div>

            <Table aria-label="Orders table">
                <TableHeader>
                    <TableColumn className="text-center">ID</TableColumn>
                    <TableColumn className="text-center">Table</TableColumn>
                    <TableColumn className="text-center">Total</TableColumn>
                    <TableColumn className="text-center">Status</TableColumn>
                    <TableColumn className="text-center">Created at</TableColumn>
                    <TableColumn className="text-center">Checkout at</TableColumn>
                    <TableColumn className="text-center">Action</TableColumn>
                </TableHeader>
                <TableBody>
                    {paginatedOrders.map((u) => (
                        <TableRow key={u.OrderID}>
                            <TableCell className="text-center">{u.OrderID}</TableCell>
                            <TableCell className="text-center">{u.Table}</TableCell>
                            <TableCell className="text-center text-green-600">{u.TotalAmount}</TableCell>
                            <TableCell className="text-center">
                                <Chip
                                    size="sm"
                                    color={
                                        u.Status === "Processing"
                                            ? "warning"
                                            : u.Status === "Serving"
                                            ? "primary"
                                            : u.Status === "Paid"
                                            ? "success"
                                            : "default"
                                    }
                                    variant="bordered"
                                >
                                    {u.Status}
                                </Chip>
                            </TableCell>
                            <TableCell className="text-center">{new Date(u.CreatedAt * 1000).toLocaleString()}</TableCell>
                            <TableCell className="text-center">{new Date(u.UpdatedAt * 1000).toLocaleString()}</TableCell>
                            <TableCell className="text-center flex gap-2 justify-center">
                                <EditOrderDrawer />
                                {u.Status !== "Paid" && ( <Checkout totalAmount={u.TotalAmount} />  )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination dưới bảng */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        showControls
                        total={totalPages}
                        initialPage={currentPage}
                        onChange={(page: number) => setCurrentPage(page)}
                        />
                </div>
            )}
        </div>
    );
}