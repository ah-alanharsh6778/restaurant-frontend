import React from 'react';
import { Avatar as MuiAvatar, Badge as MuiBadge, AvatarGroup as MuiAvatarGroup, Box } from '@mui/material';

/**
 * RestaurantOS Avatar Component
 * User avatar with image fallback, initials generation, online/offline status dot, sizes, and AvatarGroup stack.
 */
export const Avatar = ({
  src,
  name = '',
  size = 'medium', // 'xs' | 'sm' | 'medium' | 'large' | 'xl'
  status, // 'online' | 'busy' | 'offline' | null
  sx = {},
  ...props
}) => {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase();
  };

  const getSizePx = () => {
    switch (size) {
      case 'xs':
        return 24;
      case 'sm':
        return 32;
      case 'large':
        return 48;
      case 'xl':
        return 64;
      case 'medium':
      default:
        return 40;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'var(--color-success)';
      case 'busy':
        return 'var(--color-warning)';
      case 'offline':
        return 'var(--text-muted)';
      default:
        return null;
    }
  };

  const sizePx = getSizePx();
  const statusColor = getStatusColor();

  const avatarElement = (
    <MuiAvatar
      src={src}
      alt={name}
      sx={{
        width: sizePx,
        height: sizePx,
        fontSize: `${sizePx * 0.4}px`,
        fontWeight: 800,
        bgcolor: 'var(--primary-600)',
        color: '#FFFFFF',
        boxShadow: 'var(--shadow-sm)',
        border: '2px solid var(--bg-surface)',
        ...sx,
      }}
      {...props}
    >
      {!src && getInitials(name)}
    </MuiAvatar>
  );

  if (!statusColor) return avatarElement;

  return (
    <MuiBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: statusColor,
          color: statusColor,
          boxShadow: '0 0 0 2px var(--bg-surface)',
          width: sizePx * 0.3,
          height: sizePx * 0.3,
          borderRadius: '50%',
        },
      }}
    >
      {avatarElement}
    </MuiBadge>
  );
};

export const AvatarGroup = ({ children, max = 4, sx = {}, ...props }) => {
  return (
    <MuiAvatarGroup
      max={max}
      sx={{
        '& .MuiAvatar-root': {
          border: '2px solid var(--bg-surface)',
          fontSize: '0.8125rem',
          fontWeight: 800,
          bgcolor: 'var(--primary-700)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiAvatarGroup>
  );
};

export default Avatar;
