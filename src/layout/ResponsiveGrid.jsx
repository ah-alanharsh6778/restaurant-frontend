import React from 'react';
import { Grid } from '@mui/material';

/**
 * ResponsiveGrid Component
 * Standard 12-Column Responsive Layout Wrapper supporting mobile, tablet, desktop spans.
 */
export const ResponsiveGrid = ({
  children,
  spacing = { xs: 2, sm: 2.5, md: 3 },
  columns = 12,
  sx = {},
  ...props
}) => {
  return (
    <Grid container spacing={spacing} columns={columns} sx={{ width: '100%', margin: 0, ...sx }} {...props}>
      {children}
    </Grid>
  );
};

/**
 * ResponsiveGridItem Component
 * Standard Grid Item with preset responsive spans
 */
export const ResponsiveGridItem = ({
  children,
  xs = 12,
  sm = 6,
  md = 4,
  lg,
  xl,
  sx = {},
  ...props
}) => {
  return (
    <Grid size={{ xs, sm, md, lg, xl }} sx={{ ...sx }} {...props}>
      {children}
    </Grid>
  );
};

export default ResponsiveGrid;
