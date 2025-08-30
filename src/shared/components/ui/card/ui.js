import { conditionalObject } from "@/shared/utilis/utilis";
import { Box, styled } from "@mui/material";

export const StyledCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "elevation" && prop !== "pageHeight",
})(({ theme, elevation, pageHeight }) => ({
  padding: "0rem 1rem 1rem 1rem",
  borderRadius: theme.shape.borderRadius,
  overflow: "auto",

  ...conditionalObject(elevation, {
    boxShadow: "0px 10px 25px 0px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(241, 241, 245, 1)",
  }),

  position: "relative",

  ...conditionalObject(pageHeight, {
    height: "calc(100vh - 5rem)",
  }),
}));
