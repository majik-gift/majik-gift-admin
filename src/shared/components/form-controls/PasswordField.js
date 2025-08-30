'use client';

import { useState } from 'react';

import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';
import * as PropTypes from 'prop-types';

import UiInputFiled from './InputField';

const UIPasswordField = ({ showIcon = true, defaultShowPassword = false, ...otherProps }) => {
  const [showPassword, setShowPassword] = useState(defaultShowPassword);

  const handleClickShowPassword = () => {
    const input = document.querySelector('input[name="password"]'); // Adjust selector if needed
    if (input) {
      const cursorPosition = input.selectionStart; // Store cursor position

      setShowPassword((prev) => !prev); // Toggle password visibility

      setTimeout(() => {
        input.selectionStart = cursorPosition;
        input.selectionEnd = cursorPosition;
      }, 0); // Restore cursor position after state update
    }
  };

  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <UiInputFiled
      type={showPassword ? 'text' : 'password'}
      autoComplete="current-password"
      startIcon={showIcon && <LockIcon color="secondary" />}
      icon={
        <IconButton
          aria-label="toggle password visibility"
          size="small"
          sx={{ padding: 0 }}
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      }
      placeholder="Password"
      {...otherProps}
    />
  );
};

export default UIPasswordField;

UIPasswordField.propTypes = {
  showIcon: PropTypes.bool,
  defaultShowPassword: PropTypes.bool,
};
