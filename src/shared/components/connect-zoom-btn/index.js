'use client';

import { useToast } from '@/shared/context/ToastContext';
import { createCookie } from '@/shared/helpers/cookies';
import axiosInstance from '@/shared/services/axiosInstance';
import { setCurrentUser } from '@/store/auth/auth.slice';
import { Box, Button, CircularProgress, Grid, Stack, styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ConnectZoomBtn = ({ showReconnectBtn = true, redirectUri = null, normalBtn = true }) => {
  const { addToast, showDialog } = useToast();
  const { user } = useSelector((state) => state.auth);

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  const [isZoomConnected, setIsZoomConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTokenApiLoading, setIsTokenApiLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const { data } = await axiosInstance.get(
        `zoom/login?redirectUri=${redirectUri ? redirectUri : ''}`
      );
      window.location.href = data.response.details.authUrl;
    } catch (error) {
      console.log('🚀 ~ handleLogin ~ error:', error);
      addToast({
        message: 'Error connecting to Zoom',
        severity: 'error', // 'error', 'warning', 'info', 'success'
      });
    } finally {
    }
  };

  const handleRevoke = async (closeHandler) => {
    try {
      const { data } = await axiosInstance.post(`zoom/revoke-zoom-token`);
      addToast({
        message: data?.message,
        severity: 'success', // 'error', 'warning', 'info', 'success'
      });
      await createCookie(
        JSON.stringify({
          user: {
            role: user?.role,
            stripe_status: user?.stripeConnectStatus,
            zoom_connected: false,
          },
        })
      );
      // Reset the URL parameters
      setIsZoomConnected(false);
      dispatch(setCurrentUser({ ...user, zoom_connected: false }));
    } catch (error) {
      console.log('🚀 ~ handleLogin ~ error:', error.statusCode);
      if (error.statusCode === 404) {
        setIsZoomConnected(false);
        dispatch(setCurrentUser({ ...user, zoom_connected: false }));
        await createCookie(
          JSON.stringify({
            user: {
              role: user?.role,
              stripe_status: user?.stripeConnectStatus,
              zoom_connected: false,
            },
          })
        );
      }
      addToast({
        message: error?.message,
        severity: 'error', // 'error', 'warning', 'info', 'success'
      });
    } finally {
      closeHandler();
    }
  };

  useEffect(() => {
    const fetchToken = async (code, state) => {
      setIsTokenApiLoading(true);

      try {
        const response = await axiosInstance.post('zoom/store-token', {
          code,
          state,
          redirectUri,
        });

        addToast({
          message: 'Zoom connected successfully',
          severity: 'success', // 'error', 'warning', 'info', 'success'
        });

        console.log('Access Token:', response);
        await createCookie(
          JSON.stringify({
            user: {
              role: user?.role,
              stripe_status: user?.stripeConnectStatus,
              zoom_connected: true,
            },
          })
        );
        // Reset the URL parameters
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState(null, '', newUrl);
        setIsZoomConnected(true);
        dispatch(setCurrentUser({ ...user, zoom_connected: true }));
      } catch (error) {
        addToast({
          message: error?.message || 'Error fetching the token',
          severity: 'error',
        });
        console.error('Error fetching the token:', error);
      } finally {
        setIsTokenApiLoading(false);
      }
    };

    if (user && code && !isZoomConnected) fetchToken(code, state);
  }, [code, state, user]);

  useEffect(() => {
    const fetchZoomConnectionStatus = async () => {
      try {
        const { data } = await axiosInstance.get('auth/me');
        setIsZoomConnected(data?.response?.details?.zoom_connected);
      } catch (error) {
        console.error('Error fetching the token:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchZoomConnectionStatus();
  }, []);

  const handleRevokeConfirm = (id) => {
    showDialog({
      title: 'Are you Sure?',
      message:
        'Are you sure you want to revoke access to Zoom? This action will disconnect Zoom from your account and may limit certain features. You can reconnect anytime if needed.',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(handleRevoke);
  };

  return (
    <>
      {normalBtn ? (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            disabled={isTokenApiLoading || loading}
            onClick={isZoomConnected ? handleRevokeConfirm : handleLogin}
            startIcon={loading && <CircularProgress size={15} />}
          >
            {loading || isTokenApiLoading
              ? 'loading...'
              : isZoomConnected
                ? 'Revoke zoom'
                : 'Connect Zoom'}
          </Button>
          {/* {showReconnectBtn && isZoomConnected && (
        <Tooltip title="Reconnect your account or connect a different one" onClick={handleLogin}>
          <Fab color="primary" size="small" disabled={isTokenApiLoading || loading}>
            <Replay />
          </Fab>
        </Tooltip>
      )} */}
        </Stack>
      ) : (
        <Grid container spacing={2} my={2} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h3" my={3} align="center" fontWeight="bold" color="primary">
              Zoom Integration
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" my={2}>
              Connect or disconnect your Zoom account to start scheduling meetings and sessions.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={8} md={6}>
            <CardContainer>
              <Typography variant="h6" gutterBottom align="center" color="textPrimary">
                {isZoomConnected ? 'Zoom is Connected' : 'Zoom is Not Connected'}
              </Typography>

              <StyledButton
                variant="contained"
                onClick={isZoomConnected ? handleRevokeConfirm : handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="secondary" />
                ) : (
                  <>{isZoomConnected ? 'Revoke Zoom' : 'Connect Zoom'}</>
                )}
              </StyledButton>
            </CardContainer>
          </Grid>

          {/* Snackbar for status updates */}
        </Grid>
      )}
    </>
  );
};

export default ConnectZoomBtn;

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s ease',
}));

// Custom Styled Card for layout and spacing
const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '10px',
  padding: '20px',
  boxShadow: theme.shadows[5],
  marginBottom: '20px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));
