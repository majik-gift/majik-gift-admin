import * as yup from 'yup';

export const orderCreateSchema = yup.object({
  tracking_id: yup.string().required('Tracking Id is required').max(200),
  carrier_service: yup.string().required('Carrier Service is required').max(500),
});
