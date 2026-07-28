import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions, Box, Typography, Divider } from '@mui/material';

/**
 * RestaurantOS Card Component
 * Standard surface card with soft elevation, border tokens, hover lift, header, body, and footer actions.
 */
export const Card = ({
  children,
  title,
  subtitle,
  action,
  footer,
  hoverable = true,
  variant = 'elevation', // 'elevation' | 'outlined'
  padding = 3,
  sx = {},
  ...props
}) => {
  return (
    <MuiCard
      elevation={0}
      sx={{
        borderRadius: '24px',
        backgroundColor: 'var(--glass-bg, rgba(255, 255, 255, 0.75))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.35))',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        transition: hoverable ? 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
        '&:hover': hoverable
          ? {
              transform: 'translateY(-6px)',
              borderColor: 'rgba(99, 102, 241, 0.45)',
              boxShadow: '0 16px 36px -8px rgba(99, 102, 241, 0.22)',
            }
          : {},
        ...sx,
      }}
      {...props}
    >
      {(title || subtitle || action) && (
        <CardHeader
          title={title && <Typography variant="h6" fontWeight={800}>{title}</Typography>}
          subheader={subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
          action={action}
          sx={{ pb: 1, px: padding, pt: padding }}
        />
      )}

      <CardContent sx={{ p: padding, '&:last-child': { pb: footer ? 1 : padding } }}>
        {children}
      </CardContent>

      {footer && (
        <>
          <Divider sx={{ borderColor: 'var(--border-subdued)' }} />
          <CardActions sx={{ p: padding, pt: 1.5, justifyContent: 'flex-end' }}>
            {footer}
          </CardActions>
        </>
      )}
    </MuiCard>
  );
};

export default Card;
