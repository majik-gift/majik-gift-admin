import { MoreVert } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import UIIconButton from '../ui/icon-button';
import Link from 'next/link';

const ChatHeader = ({
  recipient,
  handleOpenDrawer,
  chat,
  openMeetingModal = () => {},
  handleArchivedChat = () => {},
  onSendZoomLink = () => {},
  archived,
}) => {
  const isLargeScreen = useMediaQuery('(min-width:900px)');

  const formatDate = (dateString) => {
    const date = moment(dateString);

    if (date.isSame(moment(), 'day')) {
      return `Today, ${date.format('hh:mm a')}`;
    } else {
      return date.format('MMM DD, h:mm a');
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getRedirectUrl = (chat) => {
    if (chat?.product_order_id) {
      return `order-history/${chat.product_order_id}/details`;
    } else if (chat?.service_order_id) {
      return `service-order-history/${chat.service_order_id}/details`;
    } else if (chat?.event_ticket_id) {
      return `event-ticket-order-history/${chat.event_ticket_id}/details`;
    } else if (chat?.event_id) {
      return `events/details/${chat.event_id}`;
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        minHeight: '80px',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // flexDirection: { sm: 'row', xs: 'column' },
      }}
    >
      <Stack direction="row" width="100%">
        <ListItem sx={{ width: '80%' }}>
          {!isLargeScreen && (
            <ListItemAvatar sx={{ minWidth: '40px' }}>
              <IconButton onClick={handleOpenDrawer}>
                <MenuIcon />
              </IconButton>
            </ListItemAvatar>
          )}
          <ListItemAvatar sx={{ minWidth: { sm: 64 } }}>
            <Avatar
              alt={
                chat?.name
                  ? chat.name
                  : recipient
                    ? `${recipient.first_name} ${recipient.last_name}`
                    : 'Select a Chat'
              }
              src={chat?.group_icon ? chat?.group_icon : recipient?.profile_image}
              sx={{ width: { xs: 40, sm: 50, md: 54 }, height: { xs: 40, sm: 50, md: 54 } }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              chat?.name
                ? chat.name
                : recipient
                  ? `${recipient.first_name} ${recipient.last_name}`
                  : 'Select a Chat'
            }
            primaryTypographyProps={{
              noWrap: true,
              variant: 'h6',
              fontWeight: 'bold',
            }}
            secondary={
              !chat?.name && (
                <>
                  {recipient?.is_online
                    ? 'online'
                    : recipient?.last_online
                      ? formatDate(recipient?.last_online)
                      : ''}
                </>
              )
            }
          />
        </ListItem>

        {/* {chat?.service_order?.service?.type === 'service' &&
          chat?.service_order.status === 'pending' && (
            <Box
              sx={{
                mr: 1,
                width: '100%',
                mb: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <UIButton size="small" onClick={() => openMeetingModal()}>
                Create Zoom meeting
              </UIButton>
            </Box>
          )} */}

        {chat && (
          <Box
            sx={{
              mr: 1,
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <UIIconButton
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              fillable
              size="small"
            >
              <MoreVert />
            </UIIconButton>
          </Box>
        )}

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {chat?.service_order?.service?.type === 'service' &&
            chat?.service_order.status === 'pending' && (
              <MenuItem
                onClick={() => {
                  handleClose();
                  openMeetingModal();
                }}
              >
                Create Zoom meeting
              </MenuItem>
            )}
          <MenuItem
            onClick={() => {
              handleClose();
              handleArchivedChat();
            }}
          >
            {archived ? 'Unarchive chat' : 'Archived chat'}
          </MenuItem>
          {(chat?.event_ticket_id || chat?.service_order_id) && (
            <MenuItem
              onClick={() => {
                handleClose();
                onSendZoomLink();
              }}
            >
              Send Zoom link to chat
            </MenuItem>
          )}
          <Link href={getRedirectUrl(chat)}>
            {chat?.type === 'individual' ? (
              <MenuItem>View Order</MenuItem>
            ) : (
              <MenuItem>View Group Activities</MenuItem>
            )}
          </Link>
        </Menu>
      </Stack>

      {chat?.service_order?.service?.type === 'service' &&
        chat?.service_order?.status === 'pending' &&
        chat?.service_order?.zoom_meeting?.start_url && (
          <Typography
            noWrap
            maxWidth="400px"
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden', ml: 2, mb: 1 }}
          >
            <a
              href={chat?.service_order?.zoom_meeting.start_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1976d2', textDecoration: 'underline' }}
            >
              Click here to start your Zoom meeting
            </a>
          </Typography>
        )}
    </Paper>
  );
};

export default ChatHeader;
