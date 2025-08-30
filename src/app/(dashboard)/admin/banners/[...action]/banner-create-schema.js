import * as yup from 'yup';

export const bannerCreateSchema = yup.object({
  type: yup
    .string()
    .required('Type is required')
    .oneOf(['event', 'service', 'product', 'light_worker']),
  button_text: yup.string().required('Button  Text is required'),
  button_text_color: yup.string().required('Title Color is required'),
  title: yup.string().required('Title is required').min(3).max(200),
  order_by: yup.number().required('Order By is required'),
  event_id: yup
    .object()
    .nullable()
    .when('type', {
      is: 'event',
      then: (schema) => schema.required('Group Activities selection is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  service_id: yup
    .object()
    .nullable()
    .when('type', {
      is: 'service',
      then: (schema) => schema.required('Service selection is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  product_id: yup
    .object()
    .nullable()
    .when('type', {
      is: 'product',
      then: (schema) => schema.required('Product selection is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  light_worker_id: yup
    .object()
    .nullable()
    .when('type', {
      is: 'light_worker',
      then: (schema) => schema.required('Light Worker selection is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  banner_image: yup.mixed().required('Banner image is required'),
});
