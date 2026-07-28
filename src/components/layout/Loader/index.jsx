import { Box, CircularProgress, Typography } from '@mui/material';

export const Loader = ({ message = 'Loading RestaurantOS...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: 2,
      }}
    >
      <CircularProgress size={48} thickness={4} color="primary" />
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
