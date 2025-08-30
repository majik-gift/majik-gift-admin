import { messaging } from '@/shared/services/firebase';
import { Close } from '@mui/icons-material';
import { Card, IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { onMessage } from 'firebase/messaging';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

const useHandleForeGroundNotifications = () => {
  const path = usePathname();
  const router = useRouter();

  const handleNavigation = (notificationType, chatId, communityId, eventId, eventType, key) => {
    closeSnackbar(key);

    // if (notificationType === SCREEN_TYPE.NEW_FOLLOWER) {
    //   return router.push('/profile');
    // } else if (notificationType === SCREEN_TYPE.NEW_MESSAGE) {
    //   return router.push(`/chat?chatId=${chatId}`);
    // } else if (notificationType === SCREEN_TYPE.NEW_MEMBER_JOIN_COMMUNITY) {
    //   return router.push(`/community/${communityId}`);
    // } else if (notificationType === SCREEN_TYPE.NEW_EVENT_CREATED) {
    //   if (eventType === 'campaign') {
    //     return router.push(`/compaigns/${eventId}`);
    //   }
    //   return router.push(`/charity/${eventId}`);
    // }
  };
  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {

      const { title, body } = payload.data;

      enqueueSnackbar({
        variant: 'info', // You can use 'success', 'error', 'warning', or 'info'
        autoHideDuration: 5000,
        content: (key) => (
          <Link href={`notifications`}>
            <Card
              sx={{
                borderRadius: '10px',
                maxWidth: '400px',
                borderLeft: 5,  
                borderColor: (theme) => theme.palette.primary.main,
              }}
              elevation={5}
            >
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => closeSnackbar(key)}>
                    <Close />
                  </IconButton>
                }
              >
                <ListItemButton
                  borderRadius="10px"
                  // onClick={() =>
                  //   handleNavigation(notificationType, chatId, communityId, eventId, eventType, key)
                  // }
                >
                  {/* <ListItemAvatar>
                    <Avatar src={notificationOptions.icon} alt="" />
                  </ListItemAvatar> */}
                  <ListItemText
                    primary={title}
                    secondary={body}
                    secondaryTypographyProps={{
                      noWrap: true,
                    }}
                    primaryTypographyProps={{
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Card>
          </Link>
        ),
      });
    });

    return () => unsubscribe(); // Unsubscribe to prevent duplicate listeners
  }, [path]); // Add path as a dependency to ensure it always has the latest value
};

export default useHandleForeGroundNotifications;
