import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

/**
 * RestaurantOS GlassCard Component
 * Solid card with dark background, rectangular border, and hover ambient glow.
 */
export const GlassCard = ({
  children,
  title,
  subtitle,
  action,
  gradient = false,
  glowOnHover = true,
  padding = { xs: 2.5, sm: 3.5 },
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      className="glass-card"
      sx={{
        p: padding,
        borderRadius: '4px',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: isDark ? '0 8px 32px 0 rgba(0, 0, 0, 0.4)' : '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        position: 'relative',
        overflow: 'hidden',
        background: gradient
          ? (isDark
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(99, 102, 241, 0.08) 100%)')
          : undefined,
        transition: 'all 0.25s ease',
        '&:hover': glowOnHover
          ? {
              transform: 'translateY(-2px)',
              borderColor: 'primary.main',
              boxShadow: isDark
                ? '0 12px 32px -8px rgba(99, 102, 241, 0.3), 0 0 16px rgba(99, 102, 241, 0.2)'
                : '0 12px 32px -8px rgba(99, 102, 241, 0.22), 0 0 16px rgba(99, 102, 241, 0.15)',
            }
          : {},
        ...sx,
      }}
      {...props}
    >
      {(title || subtitle || action) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
          <Box>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.3, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && <Box>{action}</Box>}
        </Box>
      )}

      {children}
    </Box>
  );
};

export default GlassCard;
