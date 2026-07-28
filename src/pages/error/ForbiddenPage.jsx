import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

export const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Paper elevation={0} sx={{ p: 6, textAlign: 'center', maxWidth: 480, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
        <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'error.50', color: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
          <BlockIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          403 - Access Forbidden
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You do not have the required RBAC security permissions to view this resource. Contact your administrator.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')} sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 700 }}>
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default ForbiddenPage;
