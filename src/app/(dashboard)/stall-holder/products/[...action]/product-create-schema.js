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

export const productCreateSchema = yup.object({
  name: yup.string().required('Name is required').min(3).max(200),
  description: yup.string().required('Description is required').min(5).max(3000),
  note: yup.string().required('Description is required').min(5).max(500),
  height: positiveNumberTest('Height'),
  weight: positiveNumberTest('Weight'),
  diameter: positiveNumberTest('Diameter'),
  total_price: positiveNumberTest('Price'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .integer('Quantity must be an integer')
    .min(0, 'Quantity must be positive')
    .typeError('Quantity must be a number'),
  categories: yup
    .array()
    .min(1, 'At least one category is required')
    .required('Categories are required'),
  // banner_image: yup.mixed().required('Banner image is required'),
  // image: yup
  //   .array()
  //   .of(
  //     yup.mixed().required('Product images are required')
  //     // .test("fileType", "Only .jpeg, .jpg and .png files are allowed", (value) => {
  //     //   return value && ["image/jpeg", "image/png"].includes(value.type);
  //     // })
  //   )
  //   .min(1, 'At least one product image is required'),
});
