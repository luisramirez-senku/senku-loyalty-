import AppHeader from "@/components/app/shared/header";
import CashierView from "@/components/app/cashier/cashier-view";

export default function CashierPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1">
        <CashierView />
      </main>
    </div>
  );
}
