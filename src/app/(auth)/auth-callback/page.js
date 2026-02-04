'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { createCookie } from '@/shared/helpers/cookies';
import { storeLocalAccessToken } from '@/shared/helpers/authHelpers';
import { setCurrentUser } from '@/store/auth/auth.slice';

/**
 * Handles redirect from web app after light-worker / stall-holder login.
 * URL hash format: #access_token=TOKEN&role=light_worker|stall_holder
 * Stores token and user role, then redirects to the correct dashboard.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hash = window.location.hash?.slice(1) || '';
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const role = params.get('role');

        if (!accessToken || !role) {
          setError('Missing token or role. Please log in again from the web app.');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        if (role !== 'light_worker' && role !== 'stall_holder') {
          setError('Invalid role. Please log in again from the web app.');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Fetch user details with the token
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://newapi.majikgift.com/api/v1/';
        const response = await axios.get(`${apiUrl}auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userDetails = response?.data?.response?.details || response?.data?.details || response?.data;

        if (!userDetails || userDetails.role !== role) {
          setError('Unable to verify account');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        storeLocalAccessToken(accessToken);
        await createCookie(
          JSON.stringify({
            access_token: accessToken,
            user: {
              role: userDetails.role,
              stripe_status: userDetails.stripeConnectStatus,
              zoom_connected: userDetails.zoom_connected,
              country: userDetails.country,
            },
          })
        );
        dispatch(setCurrentUser({
          role: userDetails.role,
          stripe_status: userDetails.stripeConnectStatus,
          zoom_connected: userDetails.zoom_connected,
          country: userDetails.country,
        }));

        const dashboardPath =
          role === 'light_worker' ? '/light-worker/dashboard' : '/stall-holder/dashboard';
        router.replace(dashboardPath);
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Something went wrong. Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [dispatch, router]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          gap: 2,
        }}
      >
        <Typography color="error">{error}</Typography>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2,
      }}
    >
      <Typography>Signing you in...</Typography>
      <CircularProgress />
    </Box>
  );
}
