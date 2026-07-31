import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Chip,
  Tooltip,
  InputBase,
  Paper,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { useAuth } from '../hooks/useAuth';
import { useColorMode } from '../context/ThemeContext';
import { SIDEBAR_WIDTH, COLLAPSED_SIDEBAR_WIDTH } from './Sidebar';
import NotificationDrawer from '../components/common/NotificationDrawer';

export const Navbar = ({ onMobileToggle, collapsed }) => {
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const isDark = mode === 'dark';
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const openMenu = Boolean(anchorEl);

  const getUserDisplayName = () => {
    if (!user) return 'Admin User';
    if (user.name) return user.name;
    if (user.fullName) return user.fullName;
    if (user.email) return user.email.split('@')[0];
    return 'Admin User';
  };

  const getInitials = (name) => {
    if (!name) return 'AU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleNavigate = (path) => {
    handleCloseMenu();
    navigate(path);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = getUserDisplayName();
  const initials = getInitials(displayName);

  const getUserRoleName = () => {
    if (!user?.role) return 'Administrator';
    if (typeof user.role === 'object' && user.role !== null) return user.role.name || 'Administrator';
    return String(user.role);
  };
  const roleDisplay = getUserRoleName();

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: { xs: 60, md: 70 },
          width: {
            xs: '100%',
            md: `calc(100% - ${collapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH}px)`,
          },
          ml: {
            xs: 0,
            md: `${collapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH}px`,
          },
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          borderRadius: 0,
          top: 0,
          left: 'auto',
          right: 0,
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subdued)',
          color: 'var(--text-primary)',
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        <Toolbar
          sx={{
            height: '100%',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Left Controls: Mobile Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMobileToggle}
              sx={{ display: { md: 'none' }, borderRadius: '4px' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Center: Global Search Bar - Strict Rectangular Box */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, maxWidth: 420, mx: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subdued)',
                transition: 'border-color 0.2s ease',
                '&:hover, &:focus-within': {
                  borderColor: 'var(--primary-500)',
                },
              }}
            >
              <SearchIcon sx={{ color: 'var(--text-muted)', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Search POS, orders, recipes..."
                sx={{ fontSize: '0.875rem', width: '100%', color: 'var(--text-primary)' }}
              />
            </Paper>
          </Box>

          {/* Right Controls: Theme Toggle, Notifications, User Menu - Strict Rectangular Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Theme Toggle Controller */}
            <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`} arrow>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                  border: '1px solid var(--border-subdued)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-surface)',
                  '&:hover': { backgroundColor: 'var(--bg-subtle)' },
                }}
              >
                {isDark ? <LightModeIcon sx={{ color: '#F59E0B', fontSize: 20 }} /> : <DarkModeIcon sx={{ color: '#6366F1', fontSize: 20 }} />}
              </IconButton>
            </Tooltip>

            {/* Notification Drawer Trigger */}
            <Tooltip title="Notifications" arrow>
              <IconButton
                onClick={() => setNotifOpen(true)}
                color="inherit"
                sx={{
                  border: '1px solid var(--border-subdued)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-surface)',
                  '&:hover': { backgroundColor: 'var(--bg-subtle)' },
                }}
              >
                <Badge
                  badgeContent={3}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      borderRadius: '2px',
                    },
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 20, color: 'var(--text-secondary)' }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Profile Trigger - Strict Rectangle Avatar */}
            <Box
              onClick={handleOpenMenu}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                cursor: 'pointer',
                p: 0.5,
                pr: { xs: 0.5, sm: 1.5 },
                borderRadius: '4px',
                border: '1px solid var(--border-subdued)',
                backgroundColor: 'var(--bg-surface)',
                transition: 'border-color 0.2s ease',
                '&:hover': { borderColor: 'var(--primary-500)', backgroundColor: 'var(--bg-subtle)' },
              }}
            >
              <Avatar
                variant="square"
                sx={{
                  bgcolor: 'var(--primary-600)',
                  color: '#FFFFFF',
                  width: 34,
                  height: 34,
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2, fontSize: '0.85rem' }}>
                  {displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                  {roleDisplay}
                </Typography>
              </Box>
            </Box>

            {/* Profile Dropdown Menu - Strict Rectangular Box */}
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleCloseMenu}
              onClick={handleCloseMenu}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  mt: 1.5,
                  minWidth: 220,
                  borderRadius: '4px',
                  border: '1px solid var(--border-subdued)',
                  backgroundColor: 'var(--bg-surface)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block' }} noWrap>
                  {user?.email || 'admin@restaurantos.com'}
                </Typography>
                <Chip
                  label={roleDisplay}
                  size="small"
                  color="primary"
                  sx={{ mt: 1, fontWeight: 800, height: 20, fontSize: '0.65rem', borderRadius: '2px' }}
                />
              </Box>

              <Divider sx={{ my: 1, borderColor: 'var(--border-subdued)' }} />

              <MenuItem onClick={() => handleNavigate('/profile')} sx={{ py: 1, borderRadius: '4px', mx: 0.5 }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="User Profile" />
              </MenuItem>

              <MenuItem onClick={() => handleNavigate('/settings')} sx={{ py: 1, borderRadius: '4px', mx: 0.5 }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Account Settings" />
              </MenuItem>

              <MenuItem onClick={() => handleNavigate('/roles')} sx={{ py: 1, borderRadius: '4px', mx: 0.5 }}>
                <ListItemIcon>
                  <SecurityIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Security & RBAC" />
              </MenuItem>

              <Divider sx={{ my: 1, borderColor: 'var(--border-subdued)' }} />

              <MenuItem onClick={handleLogout} sx={{ py: 1, borderRadius: '4px', mx: 0.5, color: 'var(--color-danger)' }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: 'var(--color-danger)' }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
};

export default Navbar;
