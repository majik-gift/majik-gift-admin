import * as yup from "yup";

export const rejectionSchema = yup.object({
  reason: yup.string().min(3).required("Description is required"),
});
