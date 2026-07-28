import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

export const ProfileMenu = () => {
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={handleOpen} sx={{ p: 0.5 }}>
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: 'primary.main',
            fontSize: '0.95rem',
            fontWeight: 700,
          }}
        >
          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              width: 260,
              borderRadius: 3.5,
              mt: 1.5,
              overflow: 'visible',
              filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.12))',
            },
          },
        }}
      >
        <Box px={2} py={1.5}>
          <Typography variant="subtitle2" fontWeight={700}>
            {user?.fullName || 'Restaurant OS User'}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {user?.email || 'user@restaurantos.com'}
          </Typography>
          <Typography
            variant="caption"
            color="primary"
            fontWeight={800}
            sx={{ textTransform: 'uppercase', mt: 0.5, display: 'inline-block' }}
          >
            Role: {userRole || 'OWNER'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
            navigate('/settings');
          }}
          sx={{ py: 1, borderRadius: 1.5 }}
        >
          <SettingsIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          Account Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ py: 1, borderRadius: 1.5, color: 'error.main' }}>
          <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;
