
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page just redirects to the main login page.
// It exists to maintain compatibility with old bookmarks or links.
export default function AdminLoginPageRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/login');
    }, [router]);

  return null; 
}
