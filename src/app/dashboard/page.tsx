'use client';

import { useEffect, useState, useCallback } from "react";
import { Order, OrderStatus } from "@/types/Order";
import { getAllOrders } from "@/libs/orderService";
import { Card, CardBody, CardHeader, Chip, Spinner, Input, Button, Select, SelectItem } from "@heroui/react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
}

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

interface StatusData {
  status: string;
  count: number;
  color: string;
  [key: string]: string | number;
}

interface TableData {
  table: string;
  revenue: number;
  orders: number;
  [key: string]: string | number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
        applyDateFilter(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      applyDateFilter(orders);
    }
  }, [dateRange, customStartDate, customEndDate, orders]);

  const applyDateFilter = useCallback((ordersData: Order[]) => {
    let filtered = [...ordersData];
    const now = new Date();

    switch (dateRange) {
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filtered = ordersData.filter(order => {
          const orderDate = new Date(order.CreatedAt * 1000);
          return orderDate >= today;
        });
        break;
      case '7days':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = ordersData.filter(order => {
          const orderDate = new Date(order.CreatedAt * 1000);
          return orderDate >= weekAgo;
        });
        break;
      case '30days':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = ordersData.filter(order => {
          const orderDate = new Date(order.CreatedAt * 1000);
          return orderDate >= monthAgo;
        });
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
          filtered = ordersData.filter(order => {
            const orderDate = new Date(order.CreatedAt * 1000);
            return orderDate >= startDate && orderDate <= endDate;
          });
        }
        break;
      default:
        filtered = ordersData;
    }

    setFilteredOrders(filtered);
    calculateStats(filtered);
  }, [dateRange, customStartDate, customEndDate]);

  const calculateStats = (ordersData: Order[]) => {
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.TotalAmount, 0);
    const totalOrders = ordersData.length;
    const completedOrders = ordersData.filter(order => order.Status === OrderStatus.Paid).length;
    const pendingOrders = ordersData.filter(order => order.Status !== OrderStatus.Paid).length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    setStats({
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      averageOrderValue,
    });
  };

  // Prepare chart data based on date range
  const getChartData = (): ChartData[] => {
    const chartData: ChartData[] = [];
    let daysToShow = 7;

    switch (dateRange) {
      case 'today':
        daysToShow = 1;
        break;
      case '7days':
        daysToShow = 7;
        break;
      case '30days':
        daysToShow = 30;
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          daysToShow = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        }
        break;
    }

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.CreatedAt * 1000).toISOString().split('T')[0];
        return orderDate === dateStr;
      });

      const revenue = dayOrders.reduce((sum, order) => sum + order.TotalAmount, 0);
      const ordersCount = dayOrders.length;

      chartData.push({
        date: date.toLocaleDateString('vi-VN', { 
          month: 'short', 
          day: 'numeric',
          ...(daysToShow > 7 ? { year: '2-digit' } : {})
        }),
        revenue,
        orders: ordersCount,
      });
    }
    return chartData;
  };

  // Prepare status data
  const getStatusData = (): StatusData[] => {
    const statusCounts = filteredOrders.reduce((acc, order) => {
      acc[order.Status] = (acc[order.Status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count], index) => ({
      status: status === OrderStatus.Processing ? 'Đang xử lý' :
              status === OrderStatus.Serving ? 'Đang phục vụ' :
              status === OrderStatus.Paid ? 'Đã thanh toán' : status,
      count,
      color: COLORS[index % COLORS.length],
    }));
  };

  // Prepare table revenue data
  const getTableData = (): TableData[] => {
    const tableStats = filteredOrders.reduce((acc, order) => {
      if (!acc[order.Table]) {
        acc[order.Table] = { revenue: 0, orders: 0 };
      }
      acc[order.Table].revenue += order.TotalAmount;
      acc[order.Table].orders += 1;
      return acc;
    }, {} as Record<string, { revenue: number; orders: number }>);

    return Object.entries(tableStats)
      .map(([table, data]) => ({
        table: `Bàn ${table}`,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 tables
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner color="secondary" size="lg" />
      </div>
    );
  }

  const chartData = getChartData();
  const statusData = getStatusData();
  const tableData = getTableData();

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Doanh Thu</h1>
        <Chip color="primary" variant="flat" size="lg">
          {new Date().toLocaleDateString('vi-VN')}
        </Chip>
      </div>

      {/* Date Filter Controls */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Lọc theo thời gian</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="w-full sm:w-auto">
              <Select
                label="Khoảng thời gian"
                placeholder="Chọn khoảng thời gian"
                selectedKeys={[dateRange]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setDateRange(selectedKey);
                }}
                className="w-full sm:w-48"
              >
                <SelectItem key="today">Hôm nay</SelectItem>
                <SelectItem key="7days">7 ngày qua</SelectItem>
                <SelectItem key="30days">30 ngày qua</SelectItem>
                <SelectItem key="custom">Tùy chọn</SelectItem>
              </Select>
            </div>
            
            {dateRange === 'custom' && (
              <>
                <div className="w-full sm:w-auto">
                  <Input
                    type="date"
                    label="Từ ngày"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full sm:w-40"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Input
                    type="date"
                    label="Đến ngày"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full sm:w-40"
                  />
                </div>
              </>
            )}
            
            <div className="w-full sm:w-auto">
              <Button 
                color="primary" 
                variant="flat"
                onPress={() => {
                  setDateRange('7days');
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="w-full sm:w-auto"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">Tổng Doanh Thu</p>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <h4 className="font-bold text-large">
              {stats.totalRevenue.toLocaleString('vi-VN')}₫
            </h4>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">Tổng Đơn Hàng</p>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <h4 className="font-bold text-large">{stats.totalOrders}</h4>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">Đã Hoàn Thành</p>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <h4 className="font-bold text-large">{stats.completedOrders}</h4>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">Giá Trị TB/Đơn</p>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <h4 className="font-bold text-large">
              {stats.averageOrderValue.toLocaleString('vi-VN')}₫
            </h4>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <h3 className="text-base sm:text-lg font-semibold">Xu Hướng Doanh Thu</h3>
          </CardHeader>
          <CardBody className="p-2 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString('vi-VN')}₫`, 'Doanh thu']}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Orders Trend */}
        <Card>
          <CardHeader>
            <h3 className="text-base sm:text-lg font-semibold">Số Lượng Đơn Hàng</h3>
          </CardHeader>
          <CardBody className="p-2 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-base sm:text-lg font-semibold">Phân Bố Trạng Thái Đơn Hàng</h3>
          </CardHeader>
          <CardBody className="p-2 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="count"
                  fontSize={10}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Top Tables Revenue */}
        <Card>
          <CardHeader>
            <h3 className="text-base sm:text-lg font-semibold">Top Bàn Doanh Thu Cao</h3>
          </CardHeader>
          <CardBody className="p-2 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tableData} layout="horizontal" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  dataKey="table" 
                  type="category" 
                  width={60}
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString('vi-VN')}₫`, 'Doanh thu']}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <h3 className="text-base sm:text-lg font-semibold">Đơn Hàng Gần Đây</h3>
        </CardHeader>
        <CardBody className="p-2 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-semibold">ID</th>
                  <th className="text-left py-2 text-sm font-semibold">Bàn</th>
                  <th className="text-left py-2 text-sm font-semibold">Tổng Tiền</th>
                  <th className="text-left py-2 text-sm font-semibold">Trạng Thái</th>
                  <th className="text-left py-2 text-sm font-semibold hidden sm:table-cell">Thời Gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders
                  .sort((a, b) => b.CreatedAt - a.CreatedAt)
                  .slice(0, 10)
                  .map((order) => (
                    <tr key={order.OrderID} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-mono text-xs sm:text-sm">{order.OrderID}</td>
                      <td className="py-2 text-sm">{order.Table}</td>
                      <td className="py-2 font-semibold text-green-600 text-sm">
                        {order.TotalAmount.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="py-2">
                        <Chip
                          size="sm"
                          color={
                            order.Status === OrderStatus.Processing ? "warning" :
                            order.Status === OrderStatus.Serving ? "primary" :
                            "success"
                          }
                          variant="flat"
                          className="text-xs"
                        >
                          {order.Status === OrderStatus.Processing ? 'Đang xử lý' :
                           order.Status === OrderStatus.Serving ? 'Đang phục vụ' :
                           'Đã thanh toán'}
                        </Chip>
                      </td>
                      <td className="py-2 text-xs text-gray-600 hidden sm:table-cell">
                        {new Date(order.CreatedAt * 1000).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
