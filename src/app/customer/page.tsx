import AppHeader from "@/components/app/shared/header";
import CustomerDashboard from "@/components/app/customer/customer-dashboard";

export default function CustomerPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1">
        <CustomerDashboard />
      </main>
    </div>
  );
}
