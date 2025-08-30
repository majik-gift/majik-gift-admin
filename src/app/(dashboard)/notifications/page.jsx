'use client'

import { CircularProgress, Stack } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const page = () => {
    const router = useRouter();
    const { user } = useSelector(state => state.auth)
    const [loading] = useState(true)
    useEffect(() => {
        if (user) router.push(`/${user?.role.replace(/_/g, "-")}/notifications`)

    }, [user, router])
    return (
    <Stack justifyContent="center" alignItems="center" height={'100vh'}>
       {loading && <CircularProgress />} 
    </Stack>
    )
}

export default page