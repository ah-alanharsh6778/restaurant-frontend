import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import FindInPageIcon from '@mui/icons-material/FindInPage';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Paper elevation={0} sx={{ p: 6, textAlign: 'center', maxWidth: 480, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'primary.50', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
          <FindInPageIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          404 - Page Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The requested page or route does not exist or has been moved in RestaurantOS.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')} sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 700 }}>
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
