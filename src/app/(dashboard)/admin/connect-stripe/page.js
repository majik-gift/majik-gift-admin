'use client';

import { useEffect } from 'react';

import { ChevronRight } from '@mui/icons-material';
import { Box, Container, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { ConnectSvg } from '@/assets';
import { useApiRequest } from '@/hooks/useApiRequest';
import { UIButton } from '@/shared/components';
import { getLocalAccessToken } from '@/shared/helpers/authHelpers';
import { createCookie } from '@/shared/helpers/cookies';
import { setCurrentUser } from '@/store/auth/auth.slice';
import { checkStripeStatus, connectStripe } from '@/store/auth/auth.thunks';

const Page = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const accountId = searchParams.get('accountId');
  const { user } = useSelector((state) => state.auth);

  const [callLoginApi, loading, _i, data] = useApiRequest(connectStripe, {
    initFetch: false,
  });

  const [checkStatus, loadingStatus, _j, dataStatus] = useApiRequest(checkStripeStatus, {
    initFetch: false,
  });

  let currRole = () => {
    switch (user.role) {
      case 'admin':
        return 'admin';
      case 'light_worker':
        return 'light-worker';
      case 'stall_holder':
        return 'stall-holder';
      default:
        break;
    }
  };

  useEffect(() => {
    if (accountId) markStripeStatus();
  }, [accountId]);

  const connectStripeHandler = async () => {
    try {
      const response = await callLoginApi({});
      if (response?.details?.redirectTo) {
        window.location.href = response?.details?.redirectTo;
      }
    } catch (error) {
      console.log('🚀 ~ loginSubmitHandler ~ error:', error);
    }
  };

  const markStripeStatus = async () => {
    try {
      const response = await checkStatus({ accountId });
      const details = response?.details;
      if (details) {
        dispatch(setCurrentUser(details));
        const accessToken = getLocalAccessToken();
        await createCookie(
          JSON.stringify({
            ...(accessToken && { access_token: accessToken }),
            user: {
              role: details.role,
              stripe_status: details.stripeConnectStatus,
              zoom_connected: details.zoom_connected,
              country: details.country,
            },
          })
        );
      }
    } catch (error) {
      console.log('🚀 ~ loginSubmitHandler ~ error:', error);
    }
  };

  if (user?.stripeConnectStatus === 'approved') {
    router.push(`/${currRole()}/dashboard`);
  }

  return (
    <>
      <Container>
        <Stack
          justifyContent="center"
          alignItems="center"
          height={'calc(100vh - 64px)'}
          spacing={2}
        >
          <Box>
            <Image
              src={ConnectSvg}
              alt="StripRequestIllus"
              style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
            />
          </Box>
          {user?.stripeConnectStatus === 'connect_required' ? (
            <Typography variant="h6" textAlign="center">
              In order for you to be available on the site as a {currRole()}, you must attach your
              Stripe in order to get payouts.
            </Typography>
          ) : (
            <Typography variant="h6" textAlign="center">
              Stripe connect account is under review, we will get back to you shortly once verified
            </Typography>
          )}
          {user?.stripeConnectStatus === 'connect_required' && (
            <UIButton
              isLoading={loading}
              endIcon={<ChevronRight />}
              variant="contained"
              onClick={connectStripeHandler}
            >
              Connect to Stripe
            </UIButton>
          )}
        </Stack>
      </Container>{' '}
    </>
  );
};

export default Page;
