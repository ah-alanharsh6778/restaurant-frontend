import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

export const SectionHeader = ({ title, subtitle, action, divider = true }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: subtitle ? 0.5 : 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.05rem' }}>
          {title}
        </Typography>
        {action}
      </Box>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
      )}
      {divider && <Divider sx={{ mt: 1.5, mb: 2 }} />}
    </Box>
  );
};

export default SectionHeader;
