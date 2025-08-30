import { UIButton, UIDateTimePicker, UIDialog, UIInputField } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createZoomMeetingSchema } from './schema';

const CreateZoomMeetingDialog = ({ open, onClose, onMeetingCreated = () => {}, ...props }) => {
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
    resolver: yupResolver(createZoomMeetingSchema),
    defaultValues: {
      duration: '',
      start_time: dayjs(),
    },
  });

  console.log('🚀 ~ CreateZoomMeetingDialog ~ errors:', errors);

  const createMeetingHandler = async (data) => {
    const meetingData = {
      ...(serviceId && { service_id: Number(serviceId) }),
      ...(eventId && { event_id: Number(eventId) }),
      start_time: dayjs(data.start_time).toISOString(),
      ...data,
    };
    setIsLoading(true);
    try {
      const apiData = await axiosInstance.post('/zoom/create-meeting', meetingData);
      addToast({
        message: 'Meeting created successfully',
        severity: 'success', // 'error', 'warning', 'info', 'success'
      });
      onMeetingCreated(apiData?.data?.response.details.meeting);
      onClose();
    } catch (error) {
      addToast({
        message: error?.message,
        severity: 'error', // 'error', 'warning', 'info', 'success'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UIDialog
      dialogTitle="Create meeting "
      isopen={open}
      onClose={isLoading ? () => {} : onClose}
      maxWidth="xs"
      actions={
        <>
          <UIButton isLoading={isLoading} onClick={handleSubmit(createMeetingHandler)}>
            Create
          </UIButton>
        </>
      }
      {...props}
    >
      <Stack spacing={2}>
        <Box>
          <UIDateTimePicker
            control={control}
            errorMessage={errors.start_time?.message}
            name="start_time"
            label={'Start time'}
            disablePast
          />
        </Box>
        <Box>
          <UIInputField
            name="duration"
            errorMessage={errors.duration?.message}
            control={control}
            placeholder="Duration"
            label="Duration (In minutes)"
            fullWidth
            type="number"
          />
        </Box>
      </Stack>
    </UIDialog>
  );
};

export default CreateZoomMeetingDialog;
