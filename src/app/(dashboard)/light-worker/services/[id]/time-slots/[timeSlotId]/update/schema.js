import * as yup from 'yup';

// Custom validation to check if end_time is after start_time
const validateEndTime = (end_time, context) => {
  const { start_time } = context.parent; // Get start_time from the same object
  if (start_time && end_time) {
    const start = new Date(start_time); // Parse start_time
    const end = new Date(end_time); // Parse end_time
    return end > start; // Ensure end_time is after start_time
  }
  return true; // If either is not provided, just return true
};

export const timeSlotSchema = yup.object().shape({
  start_time: yup.string().required('Start time is required'),
  end_time: yup
    .string()
    .required('End time is required')
    .test('is-after', 'End time must be after start time', validateEndTime), // Custom validation
  number_of_slot: yup
    .number()
    .required('Number of slots is required')
    .min(1, 'At least 1 slot is required')
    .integer('Number of slots must be an integer')
    .test(
      'is-valid-slot',
      'Number of slots must be greater than or equal to booked slots',
      function (value) {
        const { context } = this.options;
        const bookedSlotsLength = context?.timeSlotData?.details?.booked_slots?.length || 0;
        return value >= bookedSlotsLength;
      }
    ),
  day: yup.string().required('Day is required'),
});
