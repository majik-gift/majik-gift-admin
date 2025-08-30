'use client';

import { apiGet, apiPost } from '@/shared/services/apiService';
import { Button } from '@mui/material';
import { useEffect } from 'react';

const Page = () => {
  const handleLogin = async () => {
    const zoomAuthUrl = await apiGet('zoom/login');
    window.location.href = zoomAuthUrl.response.details.authUrl;
  };

  const demoMeeting = async () => {
    const zoomAuthUrl = await apiPost('zoom/create-meeting');
    console.log('🚀 ~ demoMeeting ~ zoomAuthUrl:', zoomAuthUrl);
  };

  useEffect(() => {
    const fetchToken = async (code, state) => {
      try {
        const response = await apiPost('zoom/store-token', {
          code,
          state,
        });
      } catch (error) {
        console.error('Error fetching the token:', error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    if (code) fetchToken(code, state);
  }, []);
  return (
    <>
      <Button variant="contained" onClick={handleLogin}>
        Connect zoom
      </Button>
      <Button variant="contained" onClick={demoMeeting}>
        Create Demo meeting
      </Button>
    </>
  );
};

export default Page;
