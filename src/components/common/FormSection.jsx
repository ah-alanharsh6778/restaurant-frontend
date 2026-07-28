import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

export const FormSection = ({ title, subtitle, children }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      {title && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'text.primary' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          <Divider sx={{ mt: 1.5 }} />
        </Box>
      )}
      {children}
    </Paper>
  );
};

export const FormCard = FormSection;

export default FormSection;
