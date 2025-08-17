
"use client"
// This page is a placeholder and should be removed or adapted
// when a proper customer authentication flow is built.
// For now, it redirects to the demo customer dashboard.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the specific demo customer page
    router.replace('/customer/bAsz8Nn9EaN5Sg2v3j0K');
  }, [router]);

  return null; // Render nothing while redirecting
}
