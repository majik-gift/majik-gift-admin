'use client';
import LightWorker from '@/shared/light-worker/LightWorker';
import { useParams } from 'next/navigation';
import React from 'react';

function Page() {
  const { id } = useParams();
  return <LightWorker id={id} />;
}

export default Page;
