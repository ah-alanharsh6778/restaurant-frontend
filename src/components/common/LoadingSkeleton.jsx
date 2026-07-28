import React from 'react';
import { Paper, Skeleton, Box, Grid } from '@mui/material';

export const LoadingSkeleton = ({ type = 'table', rows = 5 }) => {
  if (type === 'card') {
    return (
      <Grid container spacing={2.5}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={32} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 1, borderRadius: 1.5 }} />
      ))}
    </Paper>
  );
};

export default LoadingSkeleton;
