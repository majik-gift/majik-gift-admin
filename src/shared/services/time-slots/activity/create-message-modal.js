import { UIButton, UIDialog, UIInputField } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createMessageSchema } from './schema';

const CreateMessageDialog = ({
  openCreateActivityModal,
  setOpenCreateActivityModal = () => {},
  getData = () => {},
}) => {

  const [isLoading, setIsLoading] = useState(false);
  const { timeSlotId } = useParams(); // Get the service ID from URL params

  const { addToast } = useToast();

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
resolver: yupResolver(createMessageSchema),
    defaultValues: {
      content: '',
    },
  });

  const createActivityHandler = async (data) => {
    const activityData = {
      message: data?.content,
      time_slot_id:timeSlotId
    };
    setIsLoading(true);
    try {
      const apiData = await axiosInstance.post('chat/sendMessageToAll', activityData);
      addToast({
        message: 'Activity created successfully',
        severity: 'success', // 'error', 'warning', 'info', 'success'
      });
      getData();
      reset();
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

  return (
    <>
      <UIDialog
        isopen={openCreateActivityModal}
        onClose={() => setOpenCreateActivityModal(false)}
        actions={
          <>
            <UIButton isLoading={isLoading} onClick={handleSubmit(createActivityHandler)}>
             Send
            </UIButton>
        
          </>
        }
      >
        <>
          <UIInputField
            name="content"
            errorMessage={errors.content?.message}
            control={control}
            placeholder="Message"
            label="Message"
            fullWidth
            multiline
            rows={3}
          />
        </>
      </UIDialog>
   
    </>
  );
};

export default CreateMessageDialog;
