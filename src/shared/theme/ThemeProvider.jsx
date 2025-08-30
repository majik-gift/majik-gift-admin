"use client";

import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

const UIThemeProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default UIThemeProvider;
