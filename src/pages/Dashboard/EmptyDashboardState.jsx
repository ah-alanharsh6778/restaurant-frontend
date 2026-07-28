import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

export const EmptyDashboardState = ({
  title = 'No Dashboard Data Available',
  description = 'There are no active orders, expenses, or inventory metrics to summarize yet.',
  onRefresh,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px dashed',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'primary.50',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <AssessmentIcon sx={{ fontSize: 36 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: onRefresh ? 3 : 0 }}>
        {description}
      </Typography>
      {onRefresh && (
        <Button variant="contained" onClick={onRefresh} sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
          Refresh Analytics
        </Button>
      )}
    </Paper>
  );
};

export default EmptyDashboardState;
