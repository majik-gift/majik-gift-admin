import { useContext, useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import useFCM from '@/hooks/useFCM';
import useHandleForeGroundNotifications from '@/hooks/useHandleForeGroundNotifications';
import { setCurrentUser } from '@/store/auth/auth.slice';
import { UISplash } from '../components';
import { SocketContext } from '../context/socket/socketReducer';
import { useToast } from '../context/ToastContext';
import { getLocalAccessToken, removeLocalAccessToken } from '../helpers/authHelpers';
import { createCookie, deleteCookie } from '../helpers/cookies';
import axiosInstance from '../services/axiosInstance';

export const SessionProvider = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const { connectSocket, connected } = useContext(SocketContext);
  const token = getLocalAccessToken();

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const [splashVisible, setSplashVisible] = useState(false); // State for splash screen visibility

  useFCM();
  useHandleForeGroundNotifications();

  const getSession = async () => {
    try {
      const { data } = await axiosInstance.get('auth/me');
      dispatch(setCurrentUser(data?.response?.details));
      await createCookie(
        JSON.stringify({
          user: {
            role: data?.response?.details?.role,
            stripe_status: data?.response?.details?.stripeConnectStatus,
            zoom_connected: data?.response?.details?.zoom_connected,
          },
        })
      );
      if (!connected) {
        console.log('socket connect horha ha');
        connectSocket();
      }
    } catch (error) {
      console.log('🚀 ~ getSession ~ error:', error);
      if (error?.response?.data?.statusCode === 401) {
        removeLocalAccessToken();
        await deleteCookie();
        if (
          !(
            pathname.includes('event-invite') ||
            pathname.includes('login') ||
            pathname.includes('zoom-documentation')
          )
        ) {
          router.push('/login');
        }
        addToast({
          message: 'Your session get expired please login again',
          severity: 'error',
        });
      } else {
        addToast({
          message: 'Something went wrong please try again later',
          severity: 'error',
        });
      }
    } finally {
      const splashTimeout = setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (token) {
      getSession();
    } else if (
      !(
        pathname.includes('event-invite') ||
        pathname.includes('login') ||
        pathname.includes('zoom-documentation')
      )
    ) {
      router.push('/login');
    }
    setLoading(false);
  }, [token]);

  // useEffect(() => {
  //   if (!loading) {
  //     const splashTimeout = setTimeout(() => {
  //       setSplashVisible(false); // Hide splash after delay
  //     }, splashDelay);

  //     return () => clearTimeout(splashTimeout); // Clear timeout on unmount
  //   }
  // }, [loading, isLoggedIn, router]);

  useEffect(() => {
    if (
      (user?.stripeConnectStatus === 'connect_required' ||
        user?.stripeConnectStatus === 'under_review') &&
      user?.country === 'Australia'
      // ||
      // (user?.role === 'light_worker' && !user?.zoom_connected)
    ) {
      if (user?.role === 'light_worker' && !pathname.startsWith('/light-worker/connect-stripe')) {
        router.push('/light-worker/connect-stripe');
      }
      if (user?.role === 'stall_holder' && !pathname.startsWith('/stall-holder/connect-stripe')) {
        router.push('/stall-holder/connect-stripe');
      }
    } else if (
      user?.role === 'light_worker' &&
      !user?.paypal_connect &&
      user?.country !== 'Australia'
    ) {
      if (user?.role === 'light_worker' && !pathname.startsWith('/light-worker/user-profile')) {
        router.push(`/light-worker/user-profile/${user?.id}/update?tab=panel`);
      }
      if (user?.role === 'stall_holder' && !pathname.startsWith('/stall-holder/user-profile')) {
        router.push(`/stall-holder/user-profile/${user?.id}/update?tab=panel`);
      }
    }
  }, [user]);

  // Show splash while loading or during the delay
  if (loading) {
    return <UISplash />;
  }

  return <>{children}</>;
};
