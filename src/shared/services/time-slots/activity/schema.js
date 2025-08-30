import * as yup from 'yup';
export const createMessageSchema = yup.object({
    content: yup.string().required('Message is required*'),
  });
  