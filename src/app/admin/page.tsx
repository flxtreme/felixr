'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoot() {
  const router = useRouter();

  useEffect(() => {
    const redirect = () => {
      router.push('/admin/dashboard')
    };

    return redirect();
  }, [router])

  return null;
}