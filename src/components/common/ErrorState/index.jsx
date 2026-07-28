import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/Error';

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'Failed to load data from the server. Please try refreshing.',
  onRetry,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        textAlign: 'center',
        borderRadius: 4,
        border: (theme) => `1px dashed ${theme.palette.error.light}`,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'error.light',
          color: 'error.main',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <ErrorOutlineIcon fontSize="large" />
      </Box>

      <Typography variant="h6" fontWeight={800} gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
        {description}
      </Typography>

      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry} sx={{ fontWeight: 700 }}>
          Retry Request
        </Button>
      )}
    </Paper>
  );
};

export default ErrorState;
