import * as yup from 'yup';

export const changePassword = () =>
  yup.object({
    password: yup.string().required('Old password is required'),
    new_password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .notOneOf([yup.ref('password')], 'New password must be different from old password'),
    confirm_password: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('new_password')], 'Passwords must match'),
  });
