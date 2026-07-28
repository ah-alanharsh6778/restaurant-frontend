import React from 'react';
import { Grid, Paper, Skeleton, Box } from '@mui/material';

export const DashboardSkeleton = () => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Cards Skeleton */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Grid item xs={12} sm={6} md={2.4} key={i}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={32} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Skeleton */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[1, 2].map((i) => (
          <Grid item xs={12} md={6} key={i}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: 320 }}>
              <Skeleton variant="text" width="40%" height={28} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={240} sx={{ borderRadius: 2 }} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tables Skeleton */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 1, borderRadius: 1 }} />
        ))}
      </Paper>
    </Box>
  );
};

export default DashboardSkeleton;
