import * as yup from 'yup';

// Reusable test for numeric values >= 1
const positiveNumberTest = (fieldName) => {
  return yup
    .string()
    .required(`${fieldName} is required`)
    .test('is-positive', `${fieldName} must be a number greater than or equal to 1`, (value) => {
      const number = parseFloat(value);
      return !isNaN(number) && number >= 1;
    });
};

export const lightWorkerAddSchema = (isUpdate) =>
  yup.object({
    first_name: yup
      .string()
      .min(3, 'First name must contain at least 3 characters')
      .max(20, 'First name must be at most 20 characters')
      .required('First name is required'),
    last_name: yup
      .string()
      .min(3, 'Last name must contain at least 3 characters')
      .max(20, 'Last name must be at most 20 characters')
      .required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: isUpdate
      ? yup
          .string()
          .nullable()
          .test(
            'is-empty-or-valid',
            'Password must be at least 6 characters',
            (value) => value === null || value === '' || value?.length >= 6
          )
      : yup
          .string()
          .nullable()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters'),
    phone_number: yup
      .string()
      .required('Phone number is required')
      .min(10, 'Phone number must be at least 10 characters'),
    address: yup.string().required('Address is required'),
    note: yup.string(),
    business_name: yup.string().required('Business Name is required'),
    // insurance_expire_date: yup.date().when('country', {
    //   is: (country) => country?.label?.toLowerCase() === 'australia',
    //   then: (schema) => schema.required('Insurance expiry date is required'),
    //   otherwise: (schema) => schema.nullable()
    // }),
    // abn: yup.string().when('country', {
    //   is: (country) => country?.label?.toLowerCase() === 'australia',
    //   then: (schema) => schema.required('Abn is required'),
    //   otherwise: (schema) => schema.nullable()
    // }),
    area_of_work: yup.string().required('Area of work is required'),
    country: yup.mixed().required('Country is required'),
    medium_type: yup.string().required('Medium Type is required'),
    // Conditional validation for paypal_handle
    paypal_connect: yup.string().when('country', {
      is: (country) => country?.label?.toLowerCase() !== 'australia',
      then: (schema) => schema.required('PayPal connect is required for non-Australian users'),
      otherwise: (schema) => schema.nullable(),
    }),
    // Validation for Social Media URLs (Facebook, Instagram, Tiktok)
    facebook: yup.string().nullable(),
    website: yup.string().nullable(),
    instagram: yup.string().nullable(),
    tiktok: yup.string().nullable(),
    other_social_media: yup.string().nullable(),
  });
