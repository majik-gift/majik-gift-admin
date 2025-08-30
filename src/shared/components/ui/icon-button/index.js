import PropTypes from 'prop-types';
import React from 'react';

import { StyledIconButton } from './ui';

const UIIconButton = React.forwardRef(({ children, ...otherProps }, ref) => {
  return (
    <StyledIconButton ref={ref} {...otherProps}>
      {children}
    </StyledIconButton>
  );
});

UIIconButton.propTypes = {
  children: PropTypes.any,
};

export default UIIconButton;
