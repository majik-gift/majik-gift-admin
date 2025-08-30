'use client'
import StallHolder from '@/shared/stall-holder/StallHolder'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const {id} = useParams();
  return (
   <StallHolder id={id}/>
  )
}

export default page