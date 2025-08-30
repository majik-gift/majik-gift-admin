'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid2 } from '@mui/material';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { timeSlotSchema } from './schema';
import servicesApi from '@/apis/services/services.api';
import { useApiRequest } from '@/hooks/useApiRequest';
import { UIButton, UICard, UIInputField, UISelect, UITimePicker } from '@/shared/components';
import { createTimeSlot } from '@/store/services/services.thunk';
import { useEffect } from 'react';
import { useToast } from '@/shared/context/ToastContext';

const Create = () => {
  const router = useRouter();
  const { id } = useParams();
  const { addToast } = useToast();
  const [createTimeSlotApi, loading, error, data, errorStack] = useApiRequest(
    createTimeSlot,
    {
      initFetch: false,
    }
  );


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
      number_of_slot: 1,
      day: 'monday',
      youtube_url: '',
    },
  });

  const createServiceHandler = async (data) => {
    try {
      const payload = {
        ...data,
        service_id: id,
      };
      // console.log('🚀 ~ createServiceHandler ~ data:', dayjs(payload.start_time).format(""));
      await createTimeSlotApi(payload);
      router.back();
    } catch (error) {
      console.log('🚀 ~ createServiceHandler ~ error:', error);
    }
  };
  return (
    <UICard
      pageHeight
      heading={'Create Time Slot'}
      backButton
      bottomActions={
        <UIButton
          isLoading={loading} // Show loading state
          // type="submit"
          onClick={handleSubmit(createServiceHandler)}
          sx={{ mt: '20px' }}
        >
          Create Time Slot
        </UIButton>
      }
    >
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
    </UICard>
  );
};

export default Create;

const daysOfWeek = [
  { label: 'Sunday', value: 'sunday' },
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
];
