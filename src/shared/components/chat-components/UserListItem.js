import {
  Avatar,
  Badge,
  Box,
  Grid,
  ListItemButton,
  ListItemText,
  Typography,
  styled,
} from '@mui/material';
import { useSelector } from 'react-redux';
import DateTimeDisplay from './DateTimeDisplay';

const UserListItem = ({ chat, onClick = () => {}, selected }) => {
  const { user } = useSelector((state) => state.auth);

  const recipient = chat?.participants?.find((each) => each?.user?.id !== user?.id)?.user;

  return (
    <ListItemButton
      alignItems="center"
      dense={false}
      selected={selected}
      divider
      onClick={onClick}
      sx={{ ...linkStyles }}
    >
      <Grid container width={1} spacing={2}>
        <Grid item xl={2} xs={2.5}>
          <Badge
            color={recipient?.isOnline ? 'success' : ''}
            variant="dot"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            overlap="circular"
          >
            <Avatar
              alt={`${recipient?.first_name} ${recipient?.last_name}`}
              src={chat?.group_icon ? chat?.group_icon : recipient?.profile_image}
              sx={{ width: { xs: 36, sm: 42, lg: 64 }, height: { xs: 36, sm: 42, lg: 64 } }}
            />
          </Badge>
        </Grid>
        <Grid item container xs={9.5}>
          <Grid item lg={9} xs={12}>
            <ListItemText
              primary={
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {chat?.name
                    ? chat.name
                    : chat.product_order_id
                      ? `Order# ${chat.product_order_id}`
                      : chat.service_order_id
                        ? `Order# ${chat.service_order_id}`
                        : chat.event_id
                          ? `Order# ${chat.event_id}`
                          : chat.event_ticket_id
                            ? `Order# ${chat.event_ticket_id}`
                            : ''}
                </Typography>
              }
              secondary={
                chat.name
                  ? chat?.last_message_sent?.content
                  : `${recipient?.first_name} ${recipient?.last_name}`
              }
              secondaryTypographyProps={{
                noWrap: true,
                variant: 'body1',
              }}
              sx={{
                my: 0,
                flexGrow: 1, // Allow text to take up available space
              }}
            />
          </Grid>
          <Grid item lg={3} xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { lg: 'column' },
                justifyContent: { lg: 'flex-end', xs: 'space-between' }, // Align at the bottom on small screens
                alignItems: 'flex-end', // Align time to the right
                mt: { xs: 1, sm: 0 }, // Add margin-top on small screens
              }}
            >
              <Typography variant="body2" color="text.hint" noWrap>
                <DateTimeDisplay dateTime={chat?.last_message_sent_at} />
              </Typography>
              {Number(chat?.unread_count) > 0 && (
                <UnreadCountBox>
                  <Badge badgeContent={chat.unread_count > 9 ? '9+' : chat.unread_count} color="success" />
                </UnreadCountBox>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </ListItemButton>
  );
};

export default UserListItem;

const linkStyles = {
  '&.Mui-selected': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    '& *': {
      transition: '0.2s all ease-in-out',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&::before': {
      height: '100%',
    },
  },
  '&::before': {
    content: `''`,
    position: 'absolute',
    top: '50%',
    right: '0',
    transform: 'translateY(-50%) ',
    height: '0',
    width: '5px',
    backgroundColor: 'primary.main',
    transition: '0.2s all ease-in-out',
  },
  '&:hover::before': {
    height: '100%',
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
};

const UnreadCountBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '24px',
  height: '24px',
  marginTop: theme.spacing(0.5),
}));
