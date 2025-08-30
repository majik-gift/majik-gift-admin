import * as yup from 'yup';

export const userProfileSchema = (isUpdate) =>
  yup.object({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone_number: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required'),
    medium_type: yup.string().required('Address is required'),
    note: yup.string(),
    facebook: yup
      .string()
      .nullable()
      .test(
        'is-valid-url',
        'Must be a valid URL',
        (value) => value === null || value === '' || yup.string().url().isValidSync(value)
      ),
    website: yup
      .string()
      .nullable()
      .test(
        'is-valid-url',
        'Must be a valid URL',
        (value) => value === null || value === '' || yup.string().url().isValidSync(value)
      ),
    instagram: yup
      .string()
      .nullable()
      .test(
        'is-valid-url',
        'Must be a valid URL',
        (value) => value === null || value === '' || yup.string().url().isValidSync(value)
      ),
    tiktok: yup
      .string()
      .nullable()
      .test(
        'is-valid-url',
        'Must be a valid URL',
        (value) => value === null || value === '' || yup.string().url().isValidSync(value)
      ),
    other_social_media: yup
      .string()
      .nullable()
      .test(
        'is-valid-url',
        'Must be a valid URL',
        (value) => value === null || value === '' || yup.string().url().isValidSync(value)
      ),
  });
