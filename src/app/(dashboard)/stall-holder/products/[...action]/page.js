'use client';

import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, FormHelperText, Grid2, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useApiRequest } from '@/hooks/useApiRequest';
import {
  ApiLoader,
  UIAutocomplete,
  UIButton,
  UICard,
  UIFileUploader,
  UIInputField,
  UIRadio,
} from '@/shared/components';
import CountryCostInput from '@/shared/components/country-cost-input/country-cost-input';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { categoriesGet } from '@/store/admin/categories/categories.thunk';
import { settingsGet } from '@/store/admin/settings/setting.thunk';
import { clearError, clearSuccess } from '@/store/products/products.slice';
import {
  createProduct,
  deleteProductImage,
  getSingleProduct,
  updateProduct,
} from '@/store/products/products.thunk';
import { productCreateSchema } from './product-create-schema';

const CreateProduct = () => {
  const { loading, singleProduct, success, error, singleProductLoading } = useSelector(
    (state) => state.product
  );
  const { allCategory, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);
  const [getSettingData, settingLoading, _k, _j, _i, _h, settingData] = useApiRequest(settingsGet, {
    initFetch: true,
  });

  const [allCountry, setAllCountry] = useState([]);
  const [shippingCost, setShippingCost] = useState([]);
  const [shippingCostErrors, setShippingCostErrors] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isUserFecthingloading, setIsUserFecthingloading] = useState(false);

  const router = useRouter();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const { action } = useParams();
  const [type, id] = action || [];
  const isUpdate = type === 'update' && id;
  let isAdmin = user?.role === 'admin';

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(productCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      total_price: '',
      quantity: '',
      banner_image: null,
      image: [],
      height: '',
      diameter: '',
      weight: '',
      note: '',
      fee_option: 'standard',
      applied_fee: 0,
      categories: [],
    },
  });
  const feeOption = watch('fee_option');
  const categoriesData = watch('categories');

  let appliedFees =
    feeOption === 'standard'
      ? settingData?.details?.shop_items_standard_fee
      : settingData?.details?.shop_items_extras_package_fee;

  const radioOptions = [
    { label: `Standard (${settingData?.details?.shop_items_standard_fee} %)`, value: 'standard' },
    {
      label: `Exclusive Package (${settingData?.details?.shop_items_extras_package_fee} %)`,
      value: 'extras_package',
    },
  ];

  useEffect(() => {
    if (error?.data) {
      Object.entries(error.data).forEach(([field, message]) => {
        setError(field, { type: 'manual', message });
      });
    }

    return () => dispatch(clearError());
  }, [error]);

  useEffect(() => {
    if (id) {
      dispatch(getSingleProduct({ params: { id } }));
    }
  }, [id, dispatch]);

  // useEffect(() => {
  //   if (isUpdate && singleProduct) {
  //     Object.keys(singleProduct).forEach((key) => {
  //       if (!['banner_image', 'image'].includes(key)) {
  //         setValue(key, singleProduct[key]);
  //       }
  //     });
  //   }
  // }, [singleProduct, setValue, isUpdate]);
  useEffect(() => {
    if (isUpdate && singleProduct) {
      Object.keys(singleProduct).forEach((key) => {
        if (key === 'categories') {
          const formattedCategories = singleProduct.categories.map((e) => ({
            label: e.name,
            value: e.id,
          }));

          setValue(key, formattedCategories);
        } else if (key === 'shippings') {
          const formattedShippings = singleProduct.shippings.map((e) => ({
            country_id: e.country.id,
            cost: e.cost,
          }));
          setShippingCost(formattedShippings);
        } else if (!['banner_image', 'image'].includes(key)) {
          setValue(key, singleProduct[key]);
        }
      });
    }
  }, [singleProduct, setValue, isUpdate]);

  const createProductHandler = async (dataToSend) => {
    console.log('🚀 ~ createProductHandler ~ dataToSend:', dataToSend);
    if (!shippingCost.length) {
      setShippingCostErrors('At least one shipment country is required');
      return;
    }
    const errors = validateShippingCost(shippingCost);
    if (errors.length) {
      setShippingCostErrors(errors);
      return;
    }
    setShippingCostErrors([]);

    const payload = {
      name: dataToSend.name,
      quantity: dataToSend.quantity,
      total_price: dataToSend.total_price,
      description: dataToSend.description,
      banner_image: dataToSend.banner_image,
      product_image: dataToSend.product_image,
      image: dataToSend.image,
      height: dataToSend.height,
      diameter: dataToSend.diameter,
      width: dataToSend.width,
      note: dataToSend.note,
      weight: dataToSend.weight,
      categories: dataToSend?.categories ? dataToSend?.categories?.map((e) => e.value) : [],
      fee_option: isAdmin ? 'standard' : dataToSend?.fee_option,
      applied_fee: isAdmin ? 0 : appliedFees,
      shipment_countries: shippingCost,
    };
    console.log('🚀 ~ createProductHandler ~ payload:', payload);

    let res;
    try {
      if (isUpdate) {
        res = await dispatch(updateProduct({ params: { id }, payload })).unwrap();
      } else {
        res = await dispatch(createProduct(payload)).unwrap();
      }
      addToast({ message: res?.message, severity: 'success' });
      dispatch(clearSuccess());
      router.push('/stall-holder/products');
    } catch (error) {
      if (error.code != 422) {
        addToast({ message: error?.message, severity: 'error' });
      }
    }
  };

  const handleFileUpload = (e, fieldName) => setValue(fieldName, e);
  const getAllCategories = () => dispatch(categoriesGet({ userData: null, type: "product_category" }));

  const handleFileDelete = (imageIndex) => {
    if (!isUpdate) return true;
    return dispatch(deleteProductImage({ params: { id, imageIndex } }))
      .unwrap()
      .then((res) => {
        addToast({ message: res?.message, severity: 'success' });
        return true;
      })
      .catch((error) => {
        setError('image', { type: 'manual', message: error?.data?.image });
        return false;
      });
  };

  const fields = [
    { label: 'Name', name: 'name', type: 'text' },
    // { label: 'Description', name: 'description', type: 'text' },
    { label: 'Price', name: 'total_price', type: 'number' },
    { label: 'Diameter', name: 'diameter', type: 'number' },
    { label: 'Height', name: 'height', type: 'number' },
    { label: 'Weight', name: 'weight', type: 'number' },
    { label: 'Note', name: 'note', type: 'text' },
    { label: 'Quantity', name: 'quantity', type: 'number' },
  ];

  if (type !== 'create' && type !== 'update') {
    return <div>Invalid action</div>;
  }

  let optForAutoComplete = allCategory?.map((e) => ({
    label: e.name,
    value: e.id,
  }));
  // ?.filter(
  //   (e) =>
  //     e.type === 'product_category' && !categoriesData.some((category) => category.value === e.id)
  // )

  useEffect(() => {
    const getAllCountry = async () => {
      try {
        const { data } = await axiosInstance.get('country');
        setAllCountry(data.response.details);
      } catch (error) { }
    };
    getAllCountry();
  }, []);

  return (
    <ApiLoader loading={singleProductLoading}>
      <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit(createProductHandler)}>
        <UICard backButton pageHeight heading={`${isUpdate ? 'Update' : 'Create'} Product`}>
          <Grid2 container spacing={2}>
            {fields.map((field) => (
              <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key={field.name}>
                <UIInputField
                  label={field.label}
                  name={field.name}
                  placeholder={field.label}
                  type={field.type}
                  fullWidth
                  control={control}
                  errorMessage={errors[field.name]?.message}
                />
              </Grid2>
            ))}

            <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
              <UIAutocomplete
                options={optForAutoComplete}
                label="Categories"
                name="categories"
                placeholder="Categories"
                fullWidth
                control={control}
                errorMessage={errors?.categories?.message}
                onOpen={getAllCategories}
                isLoading={categoriesLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <UIInputField
                label="Description"
                name="description"
                placeholder="Description"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors?.description?.message}
                multiline
                rows={4}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Typography fontWeight="800" variant="h5">
                Shipping amount charge to customer
              </Typography>
              <Stack direction="row" flexWrap="wrap">
                {allCountry?.map((each, index) => {
                  return (
                    <CountryCostInput
                      data={each}
                      key={each.id}
                      shippingCost={shippingCost}
                      setShippingCost={setShippingCost}
                      errors={typeof shippingCostErrors === 'string' ? [] : shippingCostErrors}
                    />
                  );
                })}
                {typeof shippingCostErrors === 'string' && (
                  <FormHelperText sx={{ color: 'error.main' }}>{shippingCostErrors}</FormHelperText>
                )}
              </Stack>
            </Grid2>
            {user?.role != 'admin' && (
              <Grid2 size={{ xs: 12 }}>
                <Typography fontWeight="800" variant="h5">
                  Fee Option
                </Typography>
                <UIRadio name="fee_option" control={control} options={radioOptions} />
              </Grid2>
            )}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIFileUploader
                label="Product Images"
                multiple
                onChange={(e) => handleFileUpload(e, 'image')}
                errorMessage={errors.image?.message}
                initialImages={isUpdate ? singleProduct?.image : []}
                onDel={handleFileDelete}
                showDelBtn
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIFileUploader
                label="Featured Image"
                title="Upload Image"
                onChange={(e) => handleFileUpload(e, 'banner_image')}
                initialImages={isUpdate ? [singleProduct?.banner_image] : []}
                errorMessage={errors.banner_image?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Stack alignItems="center">
                <UIButton fullWidth type="submit" sx={{ maxWidth: 200 }} isLoading={loading}>
                  {isUpdate ? 'Update' : 'Create'}
                </UIButton>
              </Stack>
            </Grid2>
          </Grid2>
        </UICard>
      </Box>
    </ApiLoader>
  );
};

export default CreateProduct;

const validateShippingCost = (data) => {
  const errors = [];

  data.forEach((item, index) => {
    const error = {};
    if (item.cost === null || item.cost === undefined || item.cost === '') {
      error.cost = `Cost is required `;
    } else if (item.cost < 0) {
      error.cost = `Invalid cost. Must be a positive number.`;
    }

    if (Object.keys(error).length > 0) {
      errors.push({ id: item.country_id, ...error });
    }
  });

  return errors;
};
