import { UIButton, UIDialog, UIInputField } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { manageEventStatus } from '@/store/light-worker/events/events.thunk';
import { manageProductStatus } from '@/store/products/products.thunk';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// import { rejectionSchema } from "./schema";

const RejectionDialog = ({ open, handleDialogState, id }) => {
  const { addToast } = useToast();
  const router = useRouter();

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    // resolver: yupResolver(rejectionSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = async (data) => {
    dispatch(
      manageEventStatus({
        params: { id },
        payload: { registrationStatus: 'rejected' },
      })
    );

    addToast({
      message: 'Request rejected successfully, user has been notified through email',
      severity: 'success',
    });
    router.push('/admin/products');
    handleDialogState(false); // Close dialog after saving
    reset(); // Reset form after submission
  };

  useEffect(() => {
    if (error) {
      addToast({
        message: error.message,
        severity: 'error',
      }); // Show toast if there's an error
    }
  }, [error]);

  return (
    <UIDialog
      open={open}
      onClose={() => {
        handleDialogState(false);
        reset(); // Reset form on closing
      }}
      dialogTitle="Reason of rejection"
      actions={
        <>
          <UIButton isLoading={loading} onClick={handleSubmit(onSubmit)}>
            Save
          </UIButton>
          <UIButton
            color="error"
            onClick={() => {
              handleDialogState(false);
              reset(); // Reset form on cancel
            }}
          >
            Cancel
          </UIButton>
        </>
      }
    >
      <UIInputField
        label="Reason"
        name="reason"
        multiline
        rows={4}
        control={control}
        errorMessage={errors?.reason?.message}
      />
    </UIDialog>
  );
};

export default RejectionDialog;
