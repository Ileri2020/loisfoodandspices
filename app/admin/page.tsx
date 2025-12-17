"use client";

import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DataTableDemo } from "@/components/myComponents/subs/datatable";
import { useAppContext } from "@/hooks/useAppContext";

import UserForm from "@/prisma/forms/UserForm";
import ProductForm from "@/prisma/forms/ProductForm";
import CategoryForm from "@/prisma/forms/CategoryForm";
import StockForm from "@/prisma/forms/StockForm";
import FeaturedProductForm from "@/prisma/forms/FeaturedProductForm";
import ReviewForm from "@/prisma/forms/ReviewForm";
import NotificationForm from "@/prisma/forms/NotificationForm";
import PaymentForm from "@/prisma/forms/PaymentForm";
import RefundForm from "@/prisma/forms/RefundForm";
import CartForm from "@/prisma/forms/CartForm";
import CouponForm from "@/prisma/forms/CouponForm";
import ShippingAddressForm from "@/prisma/forms/ShippingAddressForm";
import PostForm from "@/prisma/forms/PostForm";

const allForms = [
  { name: "User", component: UserForm },
  { name: "Product", component: ProductForm },
  { name: "Category", component: CategoryForm },
  { name: "Stock", component: StockForm },
  { name: "FeaturedProduct", component: FeaturedProductForm },
  { name: "Review", component: ReviewForm },
  { name: "Notification", component: NotificationForm },
  { name: "Payment", component: PaymentForm },
  { name: "Refund", component: RefundForm },
  { name: "Cart", component: CartForm },
  { name: "Coupon", component: CouponForm },
  { name: "ShippingAddress", component: ShippingAddressForm },
  { name: "Post", component: PostForm },
];

const staffForms = ["Cart", "Stock", "Notification"];

const Admin = () => {
  const { user } = useAppContext();
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartData, setCartData] = useState<any[]>([]);
  const [notificationData, setNotificationData] = useState<any[]>([]);

  // Determine which forms the user can see
  const forms = isAdmin ? allForms : isStaff ? allForms.filter(f => staffForms.includes(f.name)) : [];

  const toggleForm = (name: string) => {
    setSelectedForms(prev =>
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const filteredForms = useMemo(
    () => forms.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, forms]
  );

  const toggleAll = () => {
    if (selectedForms.length === filteredForms.length) {
      setSelectedForms([]);
    } else {
      setSelectedForms(filteredForms.map(f => f.name));
    }
  };

  const allSelected = selectedForms.length === filteredForms.length && filteredForms.length > 0;
  const partiallySelected = selectedForms.length > 0 && selectedForms.length < filteredForms.length;

  const formColumns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ table }: any) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Checkbox checked={allSelected} onCheckedChange={toggleAll} className={partiallySelected ? "bg-gray-400" : ""} />
              <span>Form Name</span>
            </div>
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>
        ),
      },
      {
        accessorKey: "select",
        header: "Select",
        cell: ({ row }: any) => (
          <Checkbox
            checked={selectedForms.includes(row.original.name)}
            onCheckedChange={() => toggleForm(row.original.name)}
          />
        ),
      },
    ],
    [selectedForms, searchQuery, filteredForms]
  );

  const cartColumns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "userName", header: "User" },
      { accessorKey: "total", header: "Total" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "createdAt", header: "Created At" },
    ],
    []
  );

  const notificationColumns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "userName", header: "User" },
      { accessorKey: "message", header: "Message" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "createdAt", header: "Created At" },
    ],
    []
  );

  // Fetch carts and notifications
  useEffect(() => {
    if (!isAdmin && !isStaff) return;

    const fetchData = async () => {
      try {
        // Carts
        const cartsRes = await fetch("/api/dbhandler?model=cart");
        let carts = await cartsRes.json();
        if (!Array.isArray(carts)) carts = [];
        carts = carts.filter((c: any) => c.status?.toLowerCase() === "paid");
        setCartData(
          carts.map((c: any) => ({
            id: c.id,
            userName: c.user?.name || "Unknown",
            total: c.total,
            status: c.status,
            createdAt: new Date(c.createdAt).toLocaleString(),
          }))
        );

        // Notifications
        const notifRes = await fetch("/api/dbhandler?model=notification");
        let notifications = await notifRes.json();
        if (!Array.isArray(notifications)) notifications = [];
        notifications = notifications.filter(
          (n: any) => isAdmin || (isStaff && n.to?.toLowerCase() === "staff")
        );
        setNotificationData(
          notifications.map((n: any) => ({
            id: n.id,
            userName: n.username || "Unknown",
            message: n.message,
            category: n.category,
            createdAt: new Date(n.createdAt).toLocaleString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, [isAdmin, isStaff]);

  // If user is not admin or staff, show error
  if (!isAdmin && !isStaff) {
    return (
      <div className="w-full p-4 text-center text-red-600 font-bold">
        You do not have permission to access this page.
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.6, ease: "easeIn" } }}
      className="w-[100vw] p-4"
    >
      <div className="text-4xl font-semibold w-full text-center mb-6">Admin Dashboard</div>

      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
        {/* DataTable for form selection */}
        <div className="mb-6 max-w-md">
          <DataTableDemo columns={formColumns} data={filteredForms} />
        </div>

        {selectedForms.map(name => {
          const FormComponent = forms.find(f => f.name === name)?.component;
          return FormComponent ? <FormComponent key={name} /> : null;
        })}
      </div>

      {/* Carts Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Paid Carts</h3>
        <DataTableDemo columns={cartColumns} data={cartData} />
      </div>

      {/* Notifications Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Notifications</h3>
        <DataTableDemo columns={notificationColumns} data={notificationData} />
      </div>
    </motion.section>
  );
};

export default Admin;
