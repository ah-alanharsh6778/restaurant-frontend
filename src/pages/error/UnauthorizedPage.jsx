import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Paper elevation={0} sx={{ p: 6, textAlign: 'center', maxWidth: 480, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'warning.50', color: 'warning.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
          <LockOutlinedIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          401 - Unauthorized
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your authentication session has expired or you are not logged in. Please sign in to access RestaurantOS.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')} sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 700 }}>
          Go to Login Page
        </Button>
      </Paper>
    </Box>
  );
};

export default UnauthorizedPage;
