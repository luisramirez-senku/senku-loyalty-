
"use client";
import AppHeader from "@/components/app/shared/header";
import withAuth from "@/components/app/shared/with-auth";

function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}

// Applying HOC for auth protection
export default withAuth(CustomerLayout);
