// app/admin/dashboard/components/order-stats.tsx
// This component can remain a Server Component if calculations are simple
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Assuming path
import { ShoppingBag, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"
import { AdminOrder } from "../page"; // Import the AdminOrder type

interface OrderStatsProps {
  orders: AdminOrder[];
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default function OrderStats({ orders }: OrderStatsProps) {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending_confirmation' || o.paymentStatus === 'pending').length;
  const completedOrders = orders.filter(o => o.orderStatus === 'delivered' && o.paymentStatus === 'paid').length;
  const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled').length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.totalAmount, 0);


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"> {/* Added Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          {/* <p className="text-xs text-muted-foreground">+10% dari bulan lalu</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          {/* <p className="text-xs text-muted-foreground">+15% dari bulan lalu</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pesanan Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrders}</div>
          {/* <p className="text-xs text-muted-foreground">Menunggu konfirmasi</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pesanan Selesai</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedOrders}</div>
          {/* <p className="text-xs text-muted-foreground">Bulan ini</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pesanan Dibatalkan</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cancelledOrders}</div>
          {/* <p className="text-xs text-muted-foreground">Bulan ini</p> */}
        </CardContent>
      </Card>
    </div>
  )
}