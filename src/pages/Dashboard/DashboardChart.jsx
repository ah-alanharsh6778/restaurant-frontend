import { Paper, Box, Typography, Chip } from '@mui/material';

export const DashboardChart = ({ title, subtitle, badge, children }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3.5,
        height: '100%',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          {title && (
            <Typography variant="h6" fontWeight={800}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {badge && <Chip label={badge} size="small" color="primary" sx={{ fontWeight: 800 }} />}
      </Box>

      <Box sx={{ width: '100%', height: 320, mt: 2 }}>{children}</Box>
    </Paper>
  );
};

export default DashboardChart;
