
"use client";

import AnalyticsDashboard from "@/components/app/admin/analytics-dashboard";
import withAuth from "@/components/app/shared/with-auth";

function AdminDashboardPage() {
  return <AnalyticsDashboard />;
}

// Protect this page with the Auth HOC
export default withAuth(AdminDashboardPage);
