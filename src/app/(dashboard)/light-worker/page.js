'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/light-worker/dashboard');
  }, [router]);

  return <div>Redirecting...</div>;
};

export default Page;
