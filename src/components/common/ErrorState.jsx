import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export const ErrorState = ({
  title = 'Something Went Wrong',
  description = 'An unexpected error occurred while processing your request.',
  onRetry,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'error.light',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 280,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'error.50',
          color: 'error.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <ErrorIcon sx={{ fontSize: 36 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: onRetry ? 3 : 0 }}>
        {description}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="error" onClick={onRetry} sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
          Retry Request
        </Button>
      )}
    </Paper>
  );
};

export default ErrorState;
