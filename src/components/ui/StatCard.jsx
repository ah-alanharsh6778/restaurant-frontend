import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

/**
 * RestaurantOS StatCard Component
 * High-impact KPI / Metric card featuring title, main numeric metric, percentage trend badge (up/down arrow with green/red indicator), icon badge, and glass background.
 */
export const StatCard = ({
  title,
  value,
  subtitle,
  trend = null, // e.g. "+14.2%" or "-3.5%"
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  icon,
  color = 'primary', // 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  sx = {},
}) => {
  const getColorHex = () => {
    switch (color) {
      case 'secondary':
        return 'var(--secondary-500)';
      case 'accent':
        return 'var(--accent-rose)';
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'danger':
        return 'var(--color-danger)';
      case 'primary':
      default:
        return 'var(--primary-600)';
    }
  };

  const mainColor = getColorHex();
  const isTrendUp = trendDirection === 'up';

  return (
    <Paper
      elevation={0}
      className="glass-card"
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: '24px',
        backgroundColor: 'var(--glass-bg, rgba(255, 255, 255, 0.75))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.35))',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 16px 36px -8px rgba(99, 102, 241, 0.22)',
          borderColor: 'rgba(99, 102, 241, 0.45)',
        },
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.75rem',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              mt: 0.5,
            }}
          >
            {value}
          </Typography>
        </Box>

        {icon && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: '16px',
              backgroundColor: color === 'danger'
                ? 'rgba(239, 68, 68, 0.15)'
                : color === 'success'
                ? 'rgba(34, 197, 94, 0.15)'
                : color === 'secondary'
                ? 'rgba(6, 182, 212, 0.15)'
                : 'rgba(99, 102, 241, 0.15)',
              color: color === 'danger'
                ? '#EF4444'
                : color === 'success'
                ? '#16A34A'
                : color === 'secondary'
                ? '#06B6D4'
                : mainColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      {(trend || subtitle) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
          {trend && (
            <Chip
              icon={isTrendUp ? <MdTrendingUp size={16} /> : <MdTrendingDown size={16} />}
              label={trend}
              size="small"
              sx={{
                height: 24,
                fontWeight: 800,
                fontSize: '0.725rem',
                backgroundColor: isTrendUp ? 'rgba(34, 197, 94, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                color: isTrendUp ? '#22C55E' : '#EF4444',
                border: `1px solid ${isTrendUp ? '#22C55E' : '#EF4444'}`,
                '& .MuiChip-icon': {
                  color: 'inherit',
                },
              }}
            />
          )}
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default StatCard;
