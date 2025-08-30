import * as yup from "yup";

export const rejectionSchema = yup.object({
  reason: yup.string().trim().min(3).required("reason is required"),
});
