import { Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

export const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 1 }}
      >
        <MuiLink
          underline="hover"
          color="inherit"
          href="/dashboard"
          sx={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
          Home
        </MuiLink>
        {breadcrumbs.map((crumb, idx) => (
          <Typography key={idx} variant="caption" color="text.secondary" fontWeight={500}>
            {crumb}
          </Typography>
        ))}
      </Breadcrumbs>

      {/* Main Title & Action Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && <Box display="flex" alignItems="center" gap={1.5}>{actions}</Box>}
      </Box>
    </Box>
  );
};

export default PageHeader;
