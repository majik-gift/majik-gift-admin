'use client';
import { useEffect, useState } from 'react';

import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Chip, Grid2, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Carousel from 'react-material-ui-carousel';
import { useDispatch, useSelector } from 'react-redux';

import { ApiLoader, UIButton, UICard } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { getSingleProduct, manageProductStatus } from '@/store/products/products.thunk';
import RejectionDialog from './rejection-dialog';
import dayjs from 'dayjs';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { singleProduct, singleProductLoading, loading, error } = useSelector(
    (state) => state.product
  );
  const [openRejectionsDialog, setOpenRejectionsDialog] = useState(false);
  const { addToast } = useToast();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Assuming you have an API call to fetch this data using id
    dispatch(getSingleProduct({ params: { id } }));
  }, [id]);

  useEffect(() => {
    if (error) {
      addToast({
        message: error.message,
        severity: 'error',
      });
    }
  }, [error]);

  const handleUserStatus = async () => {
    try {
      const { payload } = await dispatch(
        manageProductStatus({ params: { id }, payload: { registrationStatus: 'approved' } })
      );
      if (payload) {
        addToast({
          message: payload.message,
          severity: 'success',
        });
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const bottomActions = () => (
    <Stack spacing={1} direction="row">
      <UIButton
        isLoading={loading}
        disabled={loading || singleProduct?.registration_status !== 'pending'}
        onClick={handleUserStatus}
      >
        Approve
      </UIButton>
      <UIButton
        color="error"
        disabled={singleProductLoading || singleProduct?.registration_status !== 'pending'}
        onClick={() => setOpenRejectionsDialog(!openRejectionsDialog)}
      >
        Reject
      </UIButton>
    </Stack>
  );

  const renderUserDetails = (data) => (
    <Grid2 container spacing={2}>
      {/* Carousel for Images */}
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6">Product images</Typography>
        <Carousel
          indicators={true}
          autoPlay={false}
          animation="slide"
          navButtonsAlwaysVisible
          NextIcon={<ArrowForwardIos />}
          PrevIcon={<ArrowBackIos />}
        // sx={{ width: "100%", maxHeight: 400 }}
        >
          {data?.image?.map((img, index) => (
            <Box key={index} display="flex" justifyContent="center" height={260}>
              <Image
                src={img}
                alt={`Product Image ${index + 1}`}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 'auto', height: '100%' }}
              />
            </Box>
          ))}
        </Carousel>
      </Grid2>

      {/* Product Name */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Product Name</Typography>
        <Typography variant="body1">{data?.name || 'N/A'}</Typography>
      </Grid2>

      {/* Price */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Price</Typography>
        <Typography variant="body1">{data?.price || 'N/A'} AUD</Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Diameter</Typography>
        <Typography variant="body1">{data?.diameter || 'N/A'} </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Height</Typography>
        <Typography variant="body1">{data?.height || 'N/A'} </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Weight</Typography>
        <Typography variant="body1">{data?.weight || 'N/A'} </Typography>
      </Grid2>

      {/* Quantity */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Quantity</Typography>
        <Typography variant="body1">
          {data?.quantity == 0 ? 'Out of Stock' : data?.quantity}
        </Typography>
      </Grid2>

      {/* Registration Status */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Status</Typography>

        <Chip
          label={data?.registration_status}
          sx={{ textTransform: 'capitalize' }}
          color={
            data?.registration_status === 'approved'
              ? 'success'
              : data?.registration_status === 'rejected'
                ? 'error'
                : 'warning'
          }
          size="small"
        />
      </Grid2>

      {/* Commission Charges */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Commission Charges</Typography>
        <Typography variant="body1">{data?.total_price - data?.price}</Typography>
      </Grid2>

      {/* Created At */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Created At</Typography>
        <Typography variant="body1">
          {/* {new Date(data?.created_at)
            .toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            .replaceAll(' ', '-') || 'N/A'} */}
          {dayjs(data?.created_at).format(process.env.NEXT_PUBLIC_DATE_FORMAT) || '-'}
        </Typography>
      </Grid2>

      {/* Created By */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Created By</Typography>
        <Typography variant="body1">
          {`${data?.created_by?.first_name} ${data?.created_by?.last_name}` || 'N/A'}
        </Typography>
      </Grid2>

      {/* Description */}
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6">Note</Typography>
        <Typography variant="body1">{data?.note || 'N/A'}</Typography>
      </Grid2>

      {/* Description */}
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6">Description</Typography>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line',
            wordBreak: 'break-word', // Words will break if too long
          }}
        >
          {data?.description || 'N/A'}
        </Typography>
      </Grid2>

      {/* Featured Image */}
      {data?.banner_image && (
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="h6">Featured Image</Typography>
          <Image
            src={data?.banner_image}
            alt={`Featured Image`}
            width={100}
            height={100}
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
            priority
          />
        </Grid2>
      )}
    </Grid2>
  );

  return (
    <>
      <UICard heading={'Product Details'} backButton bottomActions={bottomActions()}>
        <ApiLoader loading={singleProductLoading}>
          {singleProduct && renderUserDetails(singleProduct)}
        </ApiLoader>
      </UICard>
      <RejectionDialog
        open={openRejectionsDialog}
        id={id}
        handleDialogState={setOpenRejectionsDialog}
      />
    </>
  );
};

export default ProductDetailsPage;
