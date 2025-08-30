import * as yup from 'yup';


export const customerUpdateSchema = yup.object({
     first_name: yup.string().min(3, 'First name must be at least 3 characters').max(50, 'First name must be at most 50 characters').required('First name is required'),
     last_name: yup.string().min(3, 'Last name must be at least 3 characters').max(50, 'Last name must be at most 50 characters').required('Last name is required'),
     email: yup.string().email('Invalid email format').required('Email is required'),
     phone_number: yup.string().required('Phone number is required').min(11, 'Phone number must be at least 11 characters'),
     address: yup.string().min(3, 'Address must be at least 3 characters').max(200, 'Address must be at most 200 characters').required('Address is required'),
     note: yup.string(), 
});