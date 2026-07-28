import { Box, Typography, Link as MuiLink, Chip } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2.5,
        px: 3,
        mt: 'auto',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.4)' : '#FFFFFF',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} <strong>RestaurantOS Enterprise Suite v3.0</strong>. All rights reserved.
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <Chip
          label="System Operational"
          color="success"
          size="small"
          variant="outlined"
          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
        />
        <MuiLink href="#" underline="hover" variant="caption" color="text.secondary">
          Privacy Policy
        </MuiLink>
        <MuiLink href="#" underline="hover" variant="caption" color="text.secondary">
          Terms of Service
        </MuiLink>
        <MuiLink href="#" underline="hover" variant="caption" color="text.secondary">
          Help & Support
        </MuiLink>
      </Box>
    </Box>
  );
};

export default Footer;
