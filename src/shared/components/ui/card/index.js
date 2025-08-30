'use client';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Alert, Box, Fab, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import * as PropTypes from 'prop-types';

import { StyledCard } from './ui';

const UICard = ({
  children,
  heading,
  paypalError,
  elevation = true,
  action = null,
  pageHeight = false,
  primaryAction = null,
  isLoading = false,
  errorMessage = '',
  bottomActions,
  backButton = false,
  asChild,
  ...otherProps
}) => {
  const router = useRouter();
  return (
    <StyledCard pageHeight={pageHeight} elevation={elevation} {...otherProps}>
      {/* {backButton && (
        <Fab onClick={() => router.back()} size="small" color="secondary" sx={{ mb: 1 }}>
          <KeyboardBackspaceIcon />
        </Fab>
      )} */}
      {paypalError === 'panel' && <Alert sx={{marginTop:1}} severity="error">Kindly add your paypal connect.</Alert>}
      {(heading || action || primaryAction) && (
        <Box
          display="flex"
          alignItems="center"
          py="1rem"
          position="sticky"
          top="0"
          bgcolor="white"
          zIndex={asChild ? 1 : 4}
          justifyContent={heading || (primaryAction && action) ? 'space-between' : 'flex-end'}
        >
          {heading ? (
            typeof heading === 'string' ? (
              <Typography variant="h3" fontWeight={700}>
                {backButton && (
                  <Fab
                    component="span"
                    onClick={() => router.back()}
                    size="small"
                    color="secondary"
                    sx={{ mb: 1, mr: 1 }}
                  >
                    <KeyboardBackspaceIcon />
                  </Fab>
                )}
                {heading}
              </Typography>
            ) : (
              heading
            )
          ) : (
            primaryAction
          )}

          {action}
        </Box>
      )}

      {children}

      {bottomActions && (
        <Box display="flex" alignItems="center" pb="0.6rem" mt={2}>
          {bottomActions}
        </Box>
      )}
    </StyledCard>
  );
};

export default UICard;

UICard.propTypes = {
  elevation: PropTypes.bool,
  children: PropTypes.any,
  heading: PropTypes.any,
  action: PropTypes.node,
  pageHeight: PropTypes.bool,
  primaryAction: PropTypes.any,
  isLoading: PropTypes.bool,
  errorMessage: PropTypes.string,
};
