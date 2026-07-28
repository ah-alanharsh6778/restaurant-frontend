import React from 'react';
import { Box, CircularProgress, Skeleton, Typography } from '@mui/material';
import { MdRestaurant } from 'react-icons/md';

/**
 * RestaurantOS Loader Component
 * Supports:
 * - Circular Pulse Loader
 * - Kitchen Food Icon Spinning Animation
 * - Full Screen Glass Backdrop Loader
 * - Shimmer Lines Skeleton Loader
 */
export const Loader = ({
  variant = 'circular', // 'circular' | 'kitchen' | 'fullscreen' | 'skeleton'
  size = 40,
  text = 'Loading RestaurantOS...',
  rows = 3,
  height = 40,
  sx = {},
}) => {
  if (variant === 'fullscreen') {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--bg-overlay)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          gap: 2,
          color: '#FFFFFF',
          ...sx,
        }}
      >
        <Box className="animate-pulse-glow" sx={{ p: 2, borderRadius: '50%', backgroundColor: 'var(--primary-600)' }}>
          <MdRestaurant size={36} color="#FFFFFF" className="animate-spin" />
        </Box>
        <Typography variant="h6" fontWeight={800}>
          {text}
        </Typography>
      </Box>
    );
  }

  if (variant === 'kitchen') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, gap: 1.5, ...sx }}>
        <Box
          sx={{
            width: size + 16,
            height: size + 16,
            borderRadius: '50%',
            backgroundColor: 'var(--primary-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-600)',
            boxShadow: 'var(--shadow-glow-primary)',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }}
        >
          <MdRestaurant size={size} color="var(--primary-600)" />
        </Box>
        {text && (
          <Typography variant="caption" fontWeight={700} color="var(--text-secondary)">
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  if (variant === 'skeleton') {
    return (
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, ...sx }}>
        {Array.from({ length: rows }).map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            height={height}
            sx={{ borderRadius: '12px', backgroundColor: 'var(--bg-subtle)' }}
          />
        ))}
      </Box>
    );
  }

  // Default Circular Loader
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3, gap: 1.5, ...sx }}>
      <CircularProgress size={size} sx={{ color: 'var(--primary-600)' }} />
      {text && (
        <Typography variant="body2" fontWeight={600} color="var(--text-secondary)">
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
