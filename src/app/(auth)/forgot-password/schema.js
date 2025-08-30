import * as yup from 'yup';

export const forgetPassSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),

});


export const verifyOtpSchema = yup.object({
  otp: yup
    .string().min(6),

});



export const resetPasswordSchema = yup.object().shape({
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Confirm Passwords must match')
    .required('Confirm Password is required'),
});