// app/admin/dashboard/components/recent-orders.tsx
"use client"; // Make this a client component

import React, { useState, useMemo } from "react"; // Import useMemo for filtering
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Download, Printer } from "lucide-react"
import { AdminOrder } from "../page"; // Import the AdminOrder type
import Link from "next/link"; // For linking to order detail

interface RecentOrdersProps {
  initialOrders: AdminOrder[]; // Accept orders as a prop
}

// Helper functions (can be moved to a utils file)
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};


export default function RecentOrders({ initialOrders }: RecentOrdersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Memoize filtered orders to prevent re-calculation on every render
  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        order.orderId.toLowerCase().includes(searchLower) ||
        (order.userName && order.userName.toLowerCase().includes(searchLower)) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(searchLower));
        // You might want to add search by product name if you fetch items and display them

      const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialOrders, searchQuery, statusFilter]);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered": // Assuming 'delivered' and 'paid' means completed
      case "paid": // Check your actual "completed" status logic
        return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>
      case "processing":
      case "shipped":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Diproses</Badge>
      case "pending_confirmation":
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Dibatalkan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Dibayar</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500 hover:bg-red-600">Gagal</Badge>
      case "refunded":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Refund</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="col-span-1 md:col-span-4"> {/* Adjust col-span as needed */}
      <CardHeader>
        <CardTitle>Pesanan Terbaru</CardTitle>
        <CardDescription>Daftar pesanan terbaru dari pelanggan Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filter and Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari ID, Nama, Email..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter Status Pesanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending_confirmation">Pending Konfirmasi</SelectItem>
                <SelectItem value="processing">Diproses</SelectItem>
                <SelectItem value="shipped">Dikirim</SelectItem>
                <SelectItem value="delivered">Terkirim (Selesai)</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button> */}
            {/* <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Print</Button> */}
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Pembayaran</TableHead>
                <TableHead className="text-center">Status Pesanan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>
                        <div>{order.userName || 'N/A'}</div>
                        <div className="text-xs text-zinc-400">{order.userEmail || 'N/A'}</div>
                    </TableCell>
                    <TableCell>{formatDate(order._createdAt)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell className="text-center">{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(order.orderStatus)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <Link href={`/admin/dashboard/orders/${order.orderId}`} passHref>
                             <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                          </Link>
                          {/* Add more actions like update status later */}
                          {/* <DropdownMenuItem>Update Status</DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-zinc-400">
                    Tidak ada pesanan yang cocok dengan filter Anda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}