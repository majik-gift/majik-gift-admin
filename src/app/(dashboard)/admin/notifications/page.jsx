'use client';
import { redirectNotificationLink } from '@/shared/constant';
import axiosInstance from '@/shared/services/axiosInstance';
import { ChevronLeft, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Notifications = () => {
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marksASReadLoading, setMarksASReadLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const router = useRouter();

  const getAllNotifications = async (isLoadMore = false) => {
    if (page > totalPages) return; // Prevent fetching if all pages are loaded
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadMoreLoading(true);
    }

    try {
      const { data } = await axiosInstance.get(`notification?page=${page}`);
      if (isLoadMore) {
        setNotification((prev) => [...prev, ...(data?.response?.details?.items || [])]); // Append new notifications
        console.log(
          '🚀 ~ getAllNotifications ~ data?.response?.details?.items:',
          data?.response?.details?.items
        );
      } else {
        setNotification(data?.response?.details?.items); // Append new notifications
      }
      setTotalPages(data?.response?.details?.meta?.totalPages);
    } catch (error) {
      console.log('🚀 ~ getAllNotifications ~ error:', error);
      // dispatch(setToast({ type: 'error', message: error?.message }));
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  const handleNotificationClick = async () => {
    setMarksASReadLoading(true);
    try {
      await axiosInstance.post(`notification/marks-all-as-read`);
      setNotification([]);
      setPage(1); // Reload all notifications
      getAllNotifications();
    } catch (error) {
      // showMessage('error', 'Something went wrong, please try again later');
    } finally {
      setMarksASReadLoading(false);
    }
  };

  const loadMoreNotifications = () => {
    setPage((prev) => prev + 1);
    setLoadMoreLoading(true);
  };

  useEffect(() => {
    getAllNotifications(loadMoreLoading);
  }, [page, refresh]);

  return (
    <Container maxWidth="lg">
      <Stack gap={4} py={3}>
        <Stack gap={1}>
          <Button
            sx={{ alignSelf: 'flex-start', color: 'black' }}
            startIcon={<ChevronLeft />}
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" fontWeight="bold">
              Notifications
            </Typography>
            <Stack direction={'row'}>
              <Button onClick={handleNotificationClick} color={'black'}>
                {marksASReadLoading ? <CircularProgress size={25} /> : 'Mark all as read'}
              </Button>
              <Button
                onClick={() => {
                  setRefresh(!refresh);
                  setPage(1);
                }}
                color={'black'}
              >
                Refresh
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <Stack gap={3} minHeight="400px">
          <List disablePadding>
            {!loading &&
              !!notification?.length &&
              notification.map((notification, i) => (
                <Link
                  key={i}
                  href={redirectNotificationLink(user?.role, notification?.notification)}
                >
                  <Notification
                    notificationData={notification}
                    loading={false}
                    setNotification={setNotification}
                    getAllNotifications={getAllNotifications}
                  />
                </Link>
              ))}
            {(loading || loadMoreLoading) &&
              Array(10)
                .fill()
                .map((_, i) => <Notification key={i} loading={true} />)}
          </List>
          {!loading && !notification?.length && (
            <Typography
              textAlign="center"
              alignSelf="center"
              my="auto"
              variant="h6"
              fontWeight="Medium"
            >
              No notifications to show
            </Typography>
          )}
          {!loading && page < totalPages && (
            <Box mx="auto" mt={2}>
              <Button onClick={() => loadMoreNotifications(true)} disabled={loadMoreLoading}>
                {loadMoreLoading ? <CircularProgress size={25} /> : 'Load More'}
              </Button>
            </Box>
          )}
        </Stack>
      </Stack>
      {/* <ScrollToTop /> */}
    </Container>
  );
};

export default Notifications;

const Notification = ({
  loading = true,
  notificationData = {},
  read = false,
  setNotification,
  getAllNotifications,
}) => {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { notificationType, eventId, eventType, chatId, communityId, ...rest } = JSON.parse(
    notificationData.data || '{}'
  );
  console.log(moment(undefined));
  const handleNotificationClick = async () => {
    if (notificationData.status === 'sent') {
      try {
        await axiosInstance.put(`notification/${notificationData?.notification?.id}`);
      } catch (error) {
        console.log('Error updating notification status:', error);
      }
    }
  };

  if (loading) {
    return (
      <ListItem disableGutters>
        <ListItemButton divider>
          <ListItemText
            primary={<Skeleton variant="text" width={200} />}
            secondary={<Skeleton variant="text" width={100} />}
          />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={handleNotificationClick}
        divider
        selected={notificationData.status === 'sent'}
      >
        <ListItemText
          primary={notificationData?.notification?.title || <Skeleton variant="text" width={200} />}
          secondary={
            <>
              <Typography
                variant="body2"
                sx={{ display: 'flex', flexWrap: 'wrap' }}
                color="textSecondary"
              >
                {notificationData?.notification?.message}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {moment(notificationData?.notification?.created_at).fromNow()}
              </Typography>
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
