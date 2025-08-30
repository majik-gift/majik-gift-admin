'use client';
import { useEffect, useState } from 'react';

import { Avatar, Grid, Grid2, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useApiRequest } from '@/hooks/useApiRequest';
import { ApiLoader, UIButton, UICard, UIInputField } from '@/shared/components';
import { getSingleUser, mangeUserStatus, updateUser } from '@/store/admin/users/users.thunks';
import { useToast } from '@/shared/context/ToastContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerUpdateSchema } from './customerUpdateSchema';

const UserDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const [statusLoading, setStatusLoading] = useState(null);

  const { userData } = useSelector((state) => state.users);
  const [fetchUser, loading] = useApiRequest(getSingleUser);
  const [updateUserCall, submitLoading] = useApiRequest(updateUser);
  const { addToast } = useToast();
  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({
    resolver:yupResolver(customerUpdateSchema),
    defaultValues: {},
  });

  useEffect(() => {
    fetchUser({ id: params.id });
  }, [params]);

  useEffect(() => {
    if (userData) {
      reset({
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone_number: userData.phone_number || '',
        address: userData.address || '',
        note: userData.note || '',
      });
    }
  }, [userData]);

  const handleUser = async (data) => {
    let { email, ...payload } = data;
    setStatusLoading(true);
    try {
      const response = await updateUserCall({
        params: { id: params.id },
        payload: payload,
      });
      addToast({severity : 'success' , message : response.message});
      router.back();
    } catch (error) {
      console.log('🚀 ~ handleUser ~ error:', error?.statusCode, error?.status, error);
      if (error.details?.code == 422) {
        Object.entries(error?.details?.data).forEach(([field, message]) => {
          setError(field, { type: 'manual', message });
        });
      }
    } finally {
      setStatusLoading(null);
    }
  };

  const fields = [
    { name: 'email', label: 'Email', disabled: true },
    { name: 'first_name', label: 'First Name', type: 'text' },
    { name: 'last_name', label: 'Last Name', type: 'text' },
    { name: 'phone_number', label: 'Phone Number', type: 'number' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'note', label: 'Description', type: 'text' },
  ];

  return (
    <UICard heading={'Update Customer Details'} backButton>
      <ApiLoader loading={loading}>
        <Grid2 container spacing={2} component="form" onSubmit={handleSubmit(handleUser)}>
          {fields.map((field, i) => (
            <Grid2 item key={i} size={{ xs: 12, md: 6, lg: 4 }}>
              <UIInputField
                key={field.name}
                control={control}
                type={field.type}
                name={field.name}
                label={field.label}
                errorMessage={errors?.[field.name]?.message}
                placeholder={field.label}
                disabled={field?.disabled}
              />
            </Grid2>
          ))}
          <Grid2 item size={{ xs: 12, md: 6, lg: 4 }}>
            <UIButton sx={{ mt: 1 }} type="submit" isLoading={submitLoading}>
              Update Customer
            </UIButton>
          </Grid2>
        </Grid2>
      </ApiLoader>
    </UICard>
  );
};

export default UserDetailsPage;
