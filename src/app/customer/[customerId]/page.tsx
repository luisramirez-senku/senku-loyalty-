
"use client";

import CustomerDashboard from "@/components/app/customer/customer-dashboard";

export default function CustomerDetailsPage({ params }: { params: { customerId: string } }) {
  return <CustomerDashboard customerId={params.customerId} />;
}
