'use client';

import { ApiLoader, NotFoundData, UIButton, UICard, UIIconButton } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { ContentCopy } from '@mui/icons-material';
import { Box, Grid, List, ListItem, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateActivityDialog from './create-activity-dialog';

const GetAllActivities = () => {
  const [openModal, setOpenModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { serviceId, eventId } = useParams(); // Get the service ID from URL params


  const getAllActivities = async () => {
    setIsLoading(true);
    try {
      const url = `activities?perPage=99999&${serviceId ? `service_id=${serviceId}` : `event_id=${eventId}`}`;
      const response = await axiosInstance.get(url);
      setRecords(response.data.response.details.activities); // Assuming the API returns a `data.items` structure
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error?.response?.data?.message || 'Failed to fetch activities');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    getAllActivities();
  }, []);

  return (
    <div>
      <UICard
        pageHeight
        backButton
        heading="Announcements"
        action={<UIButton onClick={() => setOpenModal(true)}>Create Announcement</UIButton>}
      >
        <ApiLoader loading={isLoading} error={error}>
          <Grid container spacing={2}>
            {records?.items?.map((activity, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <ActivityItem data={activity} getData={getAllActivities} />
              </Grid>
            ))}
          </Grid>
          {!records?.items?.length && (
            <Box
              sx={{
                height: '80%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <NotFoundData title="No Announcements found" />
            </Box>
          )}
        </ApiLoader>
      </UICard>

      {openModal && (

        <CreateActivityDialog
          openCreateActivityModal={openModal}
          setOpenCreateActivityModal={setOpenModal}
          getData={getAllActivities}
        />
      )}
    </div>
  );
};

export default GetAllActivities;

const ActivityItem = ({ data, getData = () => { } }) => {
  const { content, created_at, service, event, zoom_meeting } = data;
  const { addToast, showDialog } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  // Function to copy join URL
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      addToast({
        message: 'Copied to clipboard!',
        severity: 'success', // 'error', 'warning', 'info', 'success'
      });
    });
  };

  const deleteActivity = (id, preFix) => async (closeHandler) => {
    try {
      const response = await axiosInstance.delete(`activities/${id}`);

      getData();
    } catch (error) {
      console.error('Error fetching activities:', error);
      addToast({
        message: error?.response?.data?.message || 'Failed to fetch activities',
        severity: 'error', // 'error', 'warning', 'info', 'success'
      });
    } finally {
      closeHandler();
    }
  };

  const deleteHandler = (id) => {
    showDialog({
      title: 'Are you Sure?',
      message: 'You want to delete this activity',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(deleteActivity(id));
  };

  return (
    <UICard
      sx={{ marginBottom: 2 }}
      bottomActions={
        <>
          <UIButton
            variant="contained"
            size="small"
            color="error"
            onClick={() => deleteHandler(data.id)}
            isLoading={isLoading}
          >
            delete
          </UIButton>
        </>
      }
    >
      <List dense disableGutters>
        <ListItem disableGutters>
          <Typography variant="h6">
            <strong>Date:</strong> {moment(created_at).format(`${process.env.NEXT_PUBLIC_DATE_FORMAT} hh:mm A`)}
          </Typography>
        </ListItem>
        <ListItem disableGutters>
          <Typography variant="body2" color="text.secondary">
            <strong>{event ? 'Group Activities' : 'Service'} ID:</strong> {event ? event?.id : service?.id}
          </Typography>
        </ListItem>
        <ListItem disableGutters>
          <Typography variant="body2" maxWidth="100%">
            <strong>Content:</strong> {formatContentWithLinks(content)}
          </Typography>
        </ListItem>

        {/* <>
          <ListItem disableGutters>
            <Typography variant="body2" color="text.secondary">
              <strong>Meeting ID:</strong> {zoom_meeting?.meeting_id || 'Not available'}
            </Typography>
          </ListItem>

          <ListItem disableGutters>
            <Typography variant="body2" color="text.secondary">
              <strong>Meeting Schedule data:</strong>{' '}
              {zoom_meeting?.start_time
                ? moment(zoom_meeting?.start_time).format('DD/MM/YYYY hh:mm A')
                : 'Not available'}
            </Typography>
          </ListItem>

          <ListItem disableGutters>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2">
                {' '}
                <strong>Start URL (Host):</strong>
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '4px' }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '70%',
                  }}
                >
                  {zoom_meeting?.start_url || 'Not available'}
                </Typography>
                {zoom_meeting?.start_url && (
                  <Tooltip title="Please do not share this link with others to ensure secure access">
                    <UIIconButton
                      size="small"
                      color="primary"
                      onClick={() => copyToClipboard(zoom_meeting?.start_url)}
                      sx={{ marginLeft: 1 }}
                    >
                      <ContentCopy fontSize="small" />
                    </UIIconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </ListItem>
          <ListItem disableGutters>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2">
                <strong>Join URL (Participants):</strong>
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '4px' }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '70%',
                  }}
                >
                  {zoom_meeting?.join_url || 'Not available'}
                </Typography>
                {zoom_meeting?.join_url && (
                  <UIIconButton
                    size="small"
                    color="primary"
                    onClick={() => copyToClipboard(zoom_meeting?.join_url)}
                    sx={{ marginLeft: 1 }}
                  >
                    <ContentCopy fontSize="small" />
                  </UIIconButton>
                )}
              </Box>
            </Box>
          </ListItem>
        </> */}
      </List>
    </UICard>
  );
};

const formatContentWithLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) =>
    urlRegex.test(part) ? (
      <Typography
        component={'a'}
        noWrap
        key={index}
        width={'100%'}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: 'blue', textDecoration: 'underline', display: 'inline-block' }}
      >
        {part}
      </Typography>
    ) : (
      part
    )
  );
};
