'use client';

import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Divider, Grid2, InputAdornment, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { useApiRequest } from '@/hooks/useApiRequest';
import {
  ConnectZoomBtn,
  UIButton,
  UICard,
  UICheckbox,
  UIDialog,
  UIInputField,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import {
  settingsGet,
  updateReadingSettings,
  updateShopItemsSettings,
  updateSubscriptionSettings,
  updateTicketSettings,
  updateTipsPercentage,
} from '@/store/admin/settings/setting.thunk';
import { updateSchema } from './update-schema';

const Settings = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataToSub, setDataToSub] = useState({ type: '', data: null });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  let { showDialog, addToast } = useToast();
  const dispatch = useDispatch();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(updateSchema),
    defaultValues: {
      readings_standard_fee: '',
      readings_extras_package_fee: '',
      ticket_sales_standard_fee: '',
      ticket_sales_extras_package_fee: '',
      shop_items_standard_fee: '',
      shop_items_extras_package_fee: '',
      subscriptions_standard_fee: '',
      subscriptions_extras_package_fee: '',
      // update_on_db: true,
      is_notify: false,
    },
  });

  const [getSettingData, loading, _k, _j, _i, _h, fieldsData] = useApiRequest(settingsGet, {
    initFetch: true,
  });

  useEffect(() => {
    if (fieldsData?.details) {
      Object.keys(fieldsData.details).forEach((key) => {
        setValue(key, fieldsData.details[key]);
      });
    }
  }, [fieldsData, setValue]);

  const updateFees = async (data, type) => {
    setOpenUpdate(true);
    setDataToSub({ type: type, data: data });

    // const sectionData = {};
    // let apiType;
    // if (type === "reading") {
    //   sectionData.readings_standard_fee = data.readings_standard_fee;
    //   sectionData.readings_extras_package_fee = data.readings_extras_package_fee;
    //   apiType = updateReadingSettings({ params: { id: data?.id }, payload:sectionData })
    // } else if (type === "ticket") {
    //   sectionData.ticket_sales_standard_fee = data.ticket_sales_standard_fee;
    //   sectionData.ticket_sales_extras_package_fee = data.ticket_sales_extras_package_fee;
    //   apiType = updateTicketSettings({ params: { id: data?.id }, payload:sectionData })
    // } else if (type === "shop") {
    //   sectionData.shop_items_standard_fee = data.shop_items_standard_fee;
    //   sectionData.shop_items_extras_package_fee = data.shop_items_extras_package_fee;
    //   apiType = updateShopItemsSettings({ params: { id: data?.id }, payload:sectionData })
    // } else if (type === "subscription") {
    //   sectionData.subscriptions_standard_fee = data.subscriptions_standard_fee;
    //   sectionData.subscriptions_extras_package_fee = data.subscriptions_extras_package_fee;
    //   apiType = updateSubscriptionSettings({ params: { id: data?.id }, payload:sectionData })
    // } else if (type === "tips_percentage") {
    //   sectionData.tips_percentage = data.tips_percentage;
    //   apiType = updateTipsPercentage({ params: { id: data?.id }, payload:sectionData })
    // }
    // let response = await dispatch(apiType).unwrap();
    // addToast({ message: response?.message, severity: "success" });
  };

  const callApi = async () => {
    try {
      const sectionData = {
        update_on_db: dataToSub.data?.update_on_db,
        is_notify: dataToSub.data?.is_notify,
      };

      setLoadingSubmit(true);

      let apiType;
      if (dataToSub.type === 'reading') {
        sectionData.readings_standard_fee = dataToSub.data?.readings_standard_fee;
        sectionData.readings_extras_package_fee = dataToSub.data?.readings_extras_package_fee;
        apiType = updateReadingSettings({
          params: { id: dataToSub?.data?.id },
          payload: sectionData,
        });
      } else if (dataToSub.type === 'ticket') {
        sectionData.ticket_sales_standard_fee = dataToSub.data?.ticket_sales_standard_fee;
        sectionData.ticket_sales_extras_package_fee =
          dataToSub.data?.ticket_sales_extras_package_fee;
        apiType = updateTicketSettings({
          params: { id: dataToSub?.data?.id },
          payload: sectionData,
        });
      } else if (dataToSub.type === 'shop') {
        sectionData.shop_items_standard_fee = dataToSub.data?.shop_items_standard_fee;
        sectionData.shop_items_extras_package_fee = dataToSub.data?.shop_items_extras_package_fee;
        apiType = updateShopItemsSettings({
          params: { id: dataToSub?.data?.id },
          payload: sectionData,
        });
      } else if (dataToSub.type === 'subscription') {
        sectionData.subscriptions_standard_fee = dataToSub.data?.subscriptions_standard_fee;
        sectionData.subscriptions_extras_package_fee =
          dataToSub.data?.subscriptions_extras_package_fee;
        apiType = updateSubscriptionSettings({
          params: { id: dataToSub?.data?.id },
          payload: sectionData,
        });
      } else if (dataToSub.type === 'tips_percentage') {
        sectionData.tips_percentage = dataToSub.data?.tips_percentage;
        apiType = updateTipsPercentage({
          params: { id: dataToSub?.data?.id },
          payload: sectionData,
        });
      }
      let response = await dispatch(apiType).unwrap();

      addToast({ message: response?.message, severity: 'success' });
    } catch (error) {
      if (error?.status !== 422) {
        addToast({ message: error?.message, severity: 'success' });
      }
    } finally {
      setOpenUpdate(false);
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <Box component="form" sx={{ width: '100%' }}>
        <UICard heading="Settings" backButton>
          <Grid2 container spacing={2} my={2}>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="h4" my={1}>
                Reading & Subscriptions
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label="Standard Fee"
                control={control}
                name="readings_standard_fee"
                errorMessage={errors.readings_standard_fee?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        %
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label="Exclusive Package Fee"
                control={control}
                name="readings_extras_package_fee"
                errorMessage={errors.readings_extras_package_fee?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        %
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Stack justifyContent="flex-end" direction="row" height={1}>
                {/* <UIButton type="button" ></UIButton> */}
                <UIButton
                  type="button"
                  onClick={handleSubmit((data) => updateFees(data, 'reading'))}
                >
                  Update
                </UIButton>
              </Stack>
            </Grid2>
          </Grid2>
          <Divider />
          <Grid2 container spacing={2} my={2}>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="h4" my={1}>
                Ticket Sales
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label="Standard Fee"
                control={control}
                name="ticket_sales_standard_fee"
                errorMessage={errors.ticket_sales_standard_fee?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        %
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label="Exclusive Package Fee"
                control={control}
                name="ticket_sales_extras_package_fee"
                errorMessage={errors.ticket_sales_extras_package_fee?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        %
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Stack justifyContent="flex-end" direction="row" height={1}>
                {/* <UIButton type="submit">Update</UIButton> */}
                <UIButton
                  type="button"
                  onClick={handleSubmit((data) => updateFees(data, 'ticket'))}
                >
                  Update
                </UIButton>
              </Stack>
            </Grid2>
          </Grid2>
          <Divider />

          <Grid2 container spacing={2} my={2}>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="h4" my={1}>
                Physical Shop Items
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label="Standard Fee"
                control={control}
                name="shop_items_standard_fee"
                errorMessage={errors.shop_items_standard_fee?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        %
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label="Exclusive Package Fee"
                control={control}
                name="shop_items_extras_package_fee"
                errorMessage={errors.shop_items_extras_package_fee?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        %
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Stack justifyContent="flex-end" direction="row" height={1}>
                {/* <UIButton type="submit">Update</UIButton> */}
                <UIButton type="button" onClick={handleSubmit((data) => updateFees(data, 'shop'))}>
                  Update
                </UIButton>
              </Stack>
            </Grid2>
          </Grid2>
          <Divider />

          {/* <Grid2 container spacing={2} my={2}>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="h4" my={1}>
                Subscriptions
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label="Standard Fee"
                control={control}
                name="subscriptions_standard_fee"
                errorMessage={errors.subscriptions_standard_fee?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        %
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label="Exclusive Package Fee"
                control={control}
                name="subscriptions_extras_package_fee"
                errorMessage={errors.subscriptions_extras_package_fee?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        %
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Stack justifyContent="flex-end" direction="row" height={1}>
                <UIButton
                  type="button"
                  onClick={handleSubmit((data) => updateFees(data, 'subscription'))}
                >
                  Update
                </UIButton>
              </Stack>
            </Grid2>
          </Grid2>
          <Divider /> */}

          {/* Tips Percentage  */}
          <Grid2 container spacing={2} my={2}>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="h4" my={1}>
                Tips Percentage
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label="Tips Percentage"
                control={control}
                name="tips_percentage"
                errorMessage={errors.tips_percentage?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        %
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Stack justifyContent="flex-end" direction="row" height={1}>
                <UIButton
                  type="button"
                  onClick={handleSubmit((data) => updateFees(data, 'tips_percentage'))}
                >
                  Update
                </UIButton>
              </Stack>
            </Grid2>
          </Grid2>

          {/* <Grid2 container spacing={2} my={2}>
            <Grid2 size={{ xs: 12 }}>
              <ConnectZoomBtn normalBtn={false} />
            </Grid2>
          </Grid2> */}
        </UICard>
      </Box>

      <UIDialog onClose={() => setOpenUpdate(false)} open={openUpdate} dialogTitle={'Confirmation'}>
        <Stack gap={1}>
          <UICheckbox
            name="is_notify"
            label="Notify all the light workers about this fee changes."
            control={control}
          />
          <UIButton type="button" onClick={callApi} isLoading={loadingSubmit}>
            Update
          </UIButton>
        </Stack>
      </UIDialog>
    </>
  );
};

export default Settings;
