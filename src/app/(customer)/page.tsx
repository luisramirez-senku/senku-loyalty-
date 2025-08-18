
"use client"
// This page is a placeholder that redirects to the customer
// lookup page.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the customer lookup page
    router.replace('/customer/find');
  }, [router]);

  return null; // Render nothing while redirecting
}
