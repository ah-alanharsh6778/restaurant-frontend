import React from 'react';
import { LinearProgress, CircularProgress, Box, Typography } from '@mui/material';

/**
 * RestaurantOS Progress Component
 * Linear progress bar with gradient fill, percentage label, buffer state, and circular progress rings.
 */
export const Progress = ({
  value = 0,
  variant = 'linear', // 'linear' | 'circular'
  color = 'primary', // 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  showLabel = true,
  height = 8,
  size = 48,
  sx = {},
}) => {
  const getColorHex = () => {
    switch (color) {
      case 'secondary':
        return 'var(--secondary-500)';
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

  const colorHex = getColorHex();

  if (variant === 'circular') {
    return (
      <Box display="inline-flex" position="relative" alignItems="center" justifyContent="center" sx={sx}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={4}
          sx={{ color: 'var(--bg-subtle)' }}
        />
        <CircularProgress
          variant="determinate"
          value={Math.min(100, Math.max(0, value))}
          size={size}
          thickness={4}
          sx={{
            color: colorHex,
            position: 'absolute',
            left: 0,
            strokeLinecap: 'round',
          }}
        />
        {showLabel && (
          <Box
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption" fontWeight={800} color="var(--text-primary)" fontSize="0.75rem">
              {`${Math.round(value)}%`}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {showLabel && (
        <Box display="flex" justifyContent="space-between" mb={0.6}>
          <Typography variant="caption" fontWeight={700} color="var(--text-secondary)">
            Progress
          </Typography>
          <Typography variant="caption" fontWeight={800} color="var(--text-primary)">
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      )}

      <LinearProgress
        variant="determinate"
        value={Math.min(100, Math.max(0, value))}
        sx={{
          height: height,
          borderRadius: `${height / 2}px`,
          backgroundColor: 'var(--bg-subtle)',
          '& .MuiLinearProgress-bar': {
            borderRadius: `${height / 2}px`,
            background: `linear-gradient(90deg, ${colorHex} 0%, var(--primary-400) 100%)`,
          },
        }}
      />
    </Box>
  );
};

export default Progress;
