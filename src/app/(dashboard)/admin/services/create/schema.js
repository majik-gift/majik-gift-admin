import * as yup from 'yup';

export const servicesSchema = yup.object({
  title: yup.string().required('Title is required*'),
  description: yup
    .string()
    .required('Description is required*')
    .max(3000, 'Description must not exceed 3000 words'),
  created_for: yup.object().required('Created for is required'),
  type: yup.string().required('Type is required*'),
  categories: yup
    .array()
    .min(1, 'At least one category is required')
    .required('Categories are required'),
  total_price: yup
    .number()
    .required('Price is required*')
    .integer('Price must be an integer')
    .positive('Price must be a positive integer')
    .typeError('Price must be a number'),
  image: yup.array().min(1, 'At least one image is required').required('Image is required'),
  banner_image: yup.mixed().required('Image is required'), // The image field is required
});
