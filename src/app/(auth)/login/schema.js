import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
  .string()
  .trim()
  .email('Invalid email format')
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    'Enter a valid email address'
  )
  .required('Email is required'),
  password: yup.string().required('Password is required'),
  rememberMe: yup.boolean(),  
});

// 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