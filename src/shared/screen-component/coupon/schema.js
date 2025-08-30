import * as yup from 'yup';

export const couponCreateSchema = yup.object({
  code: yup
    .string()
    .required('Coupon code is required')
    .min(3, 'Coupon code must be at least 3 characters')
    .max(20, 'Coupon code cannot exceed 20 characters'),

  discount_percentage: yup
    .string()
    .required('Discount percentage is required')
    .test(
      'is-valid-number',
      'Discount percentage must be a valid number',
      (value) => !isNaN(parseFloat(value)) && isFinite(value)
    )
    .test(
      'is-positive',
      'Discount percentage must be greater than or equal to 1',
      (value) => parseFloat(value) >= 1
    )
    .test(
      'is-within-range',
      'Discount percentage cannot exceed 100%',
      (value) => parseFloat(value) <= 100
    ),

  usage_limit: yup
    .string()
    .required('Usage limit is required')
    .test(
      'is-valid-number',
      'Usage limit must be a valid number',
      (value) => !isNaN(parseFloat(value)) && isFinite(value)
    )
    .test(
      'is-positive',
      'Usage limit must greater than or equal to 1',
      (value) => parseFloat(value) >= 1
    ),
  type: yup
    .string()
    .required('Type is required')
    .oneOf(['event', 'service', 'product'], 'Invalid type selected'),

  event_id: yup
    .mixed()
    .nullable()
    .when('type', {
      is: 'event',
      then: (schema) =>
        schema
          .required('Group Activities selection is required')
          .test(
            'is-valid-object',
            'Group Activities selection is required',
            (value) => value?.id !== null && value?.label !== ''
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  service_id: yup
    .mixed()
    .nullable()
    .when('type', {
      is: 'service',
      then: (schema) =>
        schema
          .required('Service selection is required')
          .test(
            'is-valid-object',
            'Service selection is required',
            (value) => value?.id !== null && value?.label !== ''
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  product_id: yup
    .mixed()
    .nullable()
    .when('type', {
      is: 'product',
      then: (schema) =>
        schema
          .required('Product selection is required')
          .test(
            'is-valid-object',
            'Product selection is required',
            (value) => value?.id !== null && value?.label !== ''
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

  expire_at: yup
    .date()
    .required('Expiration date is required')
    .min(new Date(), 'Expiration date must be in the future'),
});
