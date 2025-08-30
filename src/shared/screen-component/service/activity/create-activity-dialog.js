import { UIButton, UIDialog, UIInputField } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import CreateZoomMeetingDialog from './create-zoom-meeting-dialog';
import { createActivitySchema } from './schema';

const CreateActivityDialog = ({
  openCreateActivityModal,
  setOpenCreateActivityModal = () => { },
  getData = () => { },
}) => {
  const [createZoomMeeting, setCreateZoomMeeting] = useState(false);
  const [createdMeetingData, setCreatedMeetingData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const { serviceId, eventId } = useParams(); // Get the service ID from URL params

  const { addToast } = useToast();

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: yupResolver(createActivitySchema),
    defaultValues: {
      content: '',
    },
  });

  const createActivityHandler = async (data) => {
    const activityData = {
      zoom_meeting_id: createdMeetingData?.id,
      ...(serviceId && { service_id: Number(serviceId) }),
      ...(eventId && { event_id: Number(eventId) }),
      content: data?.content,
    };
    setIsLoading(true);
    try {
      const apiData = await axiosInstance.post('activities', activityData);
      addToast({
        message: 'Activity created successfully',
        severity: 'success', // 'error', 'warning', 'info', 'success'
      });
      getData();
      reset();
      setCreatedMeetingData(null);
    } catch (error) {
      console.log('🚀 ~ createActivityHandler ~ error:', error);
      addToast({
        message: error?.response?.data?.message,
        severity: 'error', // 'error', 'warning', 'info', 'success'
      });
    } finally {
      setIsLoading(false);
      setOpenCreateActivityModal(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast({
      message: 'Start URL copied to clipboard!',
      severity: 'success', // 'error', 'warning', 'info', 'success'
    });
  };

  return (
    <>
      <UIDialog
        isopen={openCreateActivityModal}
        dialogTitle="Create Announcement"
        onClose={() => setOpenCreateActivityModal(false)}
        actions={
          <>
            <UIButton isLoading={isLoading} onClick={handleSubmit(createActivityHandler)}>
              Save
            </UIButton>
            {/* <UIButton onClick={() => setCreateZoomMeeting(true)}>Create zoom meeting</UIButton> */}
          </>
        }
      >
        <>
          <UIInputField
            name="content"
            errorMessage={errors.content?.message}
            control={control}
            placeholder="Content"
            label="Content"
            fullWidth
            multiline
            rows={3}
          />
        </>

        {/* <Stack spacing={2} mt={2}>
          <Box>
            <Typography variant="subtitle1">Start URL (Host):</Typography>
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
                  maxWidth: '80%',
                }}
              >
                {createdMeetingData?.start_url || 'Not available'}
              </Typography>
              <UIButton onClick={() => handleCopyToClipboard(createdMeetingData?.start_url)}>
                Copy
              </UIButton>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle1">Join URL (Participants):</Typography>
            <Typography
              variant="body2"
              component="a"
              href={createdMeetingData?.join_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#007bff', textDecoration: 'underline' }}
            >
              {createdMeetingData?.join_url || 'Not available'}
            </Typography>
          </Box>
        </Stack> */}
      </UIDialog>
      <CreateZoomMeetingDialog
        open={createZoomMeeting}
        onClose={() => setCreateZoomMeeting(!createZoomMeeting)}
        onMeetingCreated={(data) => {
          setCreatedMeetingData(data);
        }}
      />
    </>
  );
};

export default CreateActivityDialog;
