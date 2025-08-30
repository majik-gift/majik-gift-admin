import * as yup from 'yup';

export const updateSchema = yup.object({
  readings_standard_fee: yup.string().required('Readings standard fee is required'),
  readings_extras_package_fee: yup.string().required('Readings extras package fee is required'),
  ticket_sales_standard_fee: yup.string().required('Ticket sales standard fee is required'),
  ticket_sales_extras_package_fee: yup.string().required('Ticket sales extras package fee is required'),
  shop_items_standard_fee: yup.string().required('Shop items standard fee is required'),
  shop_items_extras_package_fee: yup.string().required('Shop items extras package fee is required'),
  subscriptions_standard_fee: yup.string().required('Subscriptions standard fee is required'),
  subscriptions_extras_package_fee: yup.string().required('Subscriptions extras package fee is required'),
});

