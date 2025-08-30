import * as yup from 'yup';

export const categoryCreateSchema = yup.object({
  name: yup.string().required('Name is required').min(3).max(200),
  type: yup.string().required('Type is required').min(5).max(500),
  // image: yup.mixed().required('Image is required'),
});
