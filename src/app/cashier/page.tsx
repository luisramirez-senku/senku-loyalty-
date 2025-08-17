
"use client";

import AppHeader from "@/components/app/shared/header";
import CashierView from "@/components/app/cashier/cashier-view";
import withAuth from "@/components/app/shared/with-auth";

function CashierPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1">
        <CashierView />
      </main>
    </div>
  );
}

export default withAuth(CashierPage);
