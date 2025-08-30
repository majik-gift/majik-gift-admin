'use client';

import { useContext } from 'react';

import { UIButton, UIInputField, UIPasswordField } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginOutlined, Mail } from '@mui/icons-material';
import { Box, Link as MuiLink, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useApiRequest } from '@/hooks/useApiRequest';
import { SocketContext } from '@/shared/context/socket/socketReducer';
import { useToast } from '@/shared/context/ToastContext';
import { createCookie } from '@/shared/helpers/cookies';
import { login } from '@/store/auth/auth.thunks'; // Thunks for authentication
import { loginSchema } from './schema'; // Validation schema
import CountryCostInput from '@/shared/components/country-cost-input/country-cost-input';

export default function Login() {
  const { connectSocket } = useContext(SocketContext);
  const params = useSearchParams();
  const redirectUrl = params.get('redirectUrl');
  const { addToast } = useToast();

  const router = useRouter();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const [callLoginApi, loading, , data] = useApiRequest(login, {
    initFetch: false,
  });

  const loginSubmitHandler = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      role: 'panel',
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    try {
      const response = await callLoginApi(payload);
      await createCookie(
        JSON.stringify({
          access_token: response?.access_token,
          user: {
            role: response?.details.role,
            stripe_status: response?.details.stripeConnectStatus,
            zoom_connected: response?.details.zoom_connected,
            country: response?.details.country,
          },
        })
      );
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
      connectSocket();
    } catch (error) {
      console.log('🚀 ~ loginSubmitHandler ~ error:', error);
      addToast({
        message: error?.message,
        severity: 'error',
      });
    }
  };

  return (
    <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit(loginSubmitHandler)}>
      <Typography fontSize="1.5rem" fontWeight={900}>
        Login
      </Typography>
      <Typography>Enter your email and password to login</Typography>

      <Stack mt="2rem" spacing={2}>
        <UIInputField
          name="email"
          errorMessage={errors.email?.message}
          control={control}
          placeholder="Email"
          fullWidth
          startIcon={<Mail color="secondary" />}
        />

        <UIPasswordField
          name="password"
          errorMessage={errors.password?.message}
          control={control}
          fullWidth
        />
      </Stack>

      {/* <UICheckbox name="rememberMe" control={control} label="Keep me logged in" /> */}

      <Box width="100%" mt="2rem">
        <UIButton
          isLoading={loading} // Show loading state
          startIcon={<LoginOutlined />}
          color="secondary"
          fullWidth
          type="submit"
        >
          Login
        </UIButton>
      </Box>

      <Typography mt="0.5rem" width="100%" textAlign="center">
        Forgot password?{' '}
        <MuiLink component={Link} href="/forgot-password">
          Reset
        </MuiLink>
      </Typography>
    </Box>
  );
}
