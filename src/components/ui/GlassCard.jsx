import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * RestaurantOS GlassCard Component
 * Glassmorphic card with backdrop blur, translucent border, hover ambient glow, and optional gradient mesh.
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
  return (
    <Box
      className="glass-card"
      sx={{
        p: padding,
        borderRadius: '24px',
        backgroundColor: 'var(--glass-bg, rgba(255, 255, 255, 0.75))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.35))',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        position: 'relative',
        overflow: 'hidden',
        background: gradient
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(99, 102, 241, 0.08) 100%)'
          : 'var(--glass-bg, rgba(255, 255, 255, 0.75))',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': glowOnHover
          ? {
              transform: 'translateY(-6px)',
              borderColor: 'rgba(99, 102, 241, 0.45)',
              boxShadow: '0 16px 36px -8px rgba(99, 102, 241, 0.22), 0 0 16px rgba(99, 102, 241, 0.15)',
            }
          : {},
        ...sx,
      }}
      {...props}
    >
      {(title || subtitle || action) && (
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
          <Box>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 600, mt: 0.3, display: 'block' }}>
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
