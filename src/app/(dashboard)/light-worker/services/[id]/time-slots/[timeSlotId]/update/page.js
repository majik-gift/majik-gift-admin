'use client';
import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Grid2 } from '@mui/material';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { timeSlotSchema } from './schema';
import servicesApi from '@/apis/services/services.api';
import { useApiRequest } from '@/hooks/useApiRequest';
import {
  ApiLoader,
  UIButton,
  UICard,
  UIInputField,
  UISelect,
  UITimePicker,
} from '@/shared/components';

const Update = () => {
  const router = useRouter();
  const { timeSlotId, id } = useParams();
  const [updateTimeSlotApi, loading, error, data, errorStack] = useApiRequest(
    servicesApi.updateTimeSlot,
    {
      initFetch: false,
    }
  );

  const [, loadingFetch, errorFetch, timeSlotData] = useApiRequest(servicesApi.getSingleTimeSlots, {
    initFetch: true,
    apiProps: {
      params: { id: timeSlotId },
    },
  });

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(timeSlotSchema),
    defaultValues: {
      start_time: null,
      end_time: null,
      number_of_slot: 0,
      day: 'monday',
      youtube_url: null,
    },
    context: { timeSlotData },
  });

  useEffect(() => {
    if (timeSlotData) {
      reset({
        start_time: dayjs.unix(timeSlotData?.details?.start_time),
        end_time: dayjs.unix(timeSlotData?.details?.end_time),
        number_of_slot: timeSlotData?.details?.number_of_slot,
        day: timeSlotData?.details?.day,
        youtube_url: timeSlotData?.details?.youtube_url,
      });
    }
  }, [timeSlotData]);

  const updateTimeSlotHandler = async (data) => {
    console.log('🚀 ~ updateTimeSlotHandler ~ data:', data);
    try {
      const payload = {
        ...data,
        service_id: id,
      };
      await updateTimeSlotApi({ params: { id: timeSlotId }, payload });
      router.back();
    } catch (error) {
      console.log('🚀 ~ updateTimeSlotHandler ~ error:', error);
    }
  };
  return (
    <UICard
      pageHeight
      heading={'Update Time Slot'}
      backButton
      bottomActions={
        <UIButton
          isLoading={loading} // Show loading state
          // type="submit"
          onClick={handleSubmit(updateTimeSlotHandler)}
          sx={{ mt: '20px' }}
        >
          Update Time Slot
        </UIButton>
      }
    >
      <ApiLoader loading={loadingFetch} error={errorFetch}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 6 }}>
            <UITimePicker
              name="start_time"
              label="Start time"
              errorMessage={errors?.start_time?.message}
              control={control}
              fullWidth
              errors={errorStack?.data || {}}
            />
          </Grid2>

          <Grid2 size={{ xs: 6 }}>
            <UITimePicker
              name="end_time"
              label="End time"
              errorMessage={errors?.end_time?.message}
              control={control}
              fullWidth
              errors={errorStack?.data || {}}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <UIInputField
              label="Number of slot"
              name="number_of_slot"
              errorMessage={errors.number_of_slot?.message}
              control={control}
              placeholder="Number of slot"
              fullWidth
              type="number"
              errors={errorStack?.data || {}}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <UIInputField
              label="Youtube Video Url"
              name="youtube_url"
              errorMessage={errors.youtube_url?.message}
              control={control}
              placeholder="Youtube Video Url (Optional)"
              fullWidth
              type="text"
              errors={errorStack?.data || {}}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <UISelect
              name="day"
              label="Days"
              showEmptyOption={false}
              errorMessage={errors.day?.message}
              errors={errorStack?.data || {}}
              control={control}
              fullWidth
              options={daysOfWeek}
            />
          </Grid2>
        </Grid2>
      </ApiLoader>
    </UICard>
  );
};

export default Update;

const daysOfWeek = [
  { label: 'Sunday', value: 'sunday' },
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
];
