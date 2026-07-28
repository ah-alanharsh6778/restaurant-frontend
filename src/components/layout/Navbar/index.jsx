import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  InputBase,
  Tooltip,
  Paper,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  RestaurantMenu as RestaurantMenuIcon,
  InfoOutlined as InfoIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { useThemeContext } from '../../../context/ThemeContext';
import { toast } from 'react-toastify';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, userRole } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Ctrl+K shortcut for search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProfileOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const handleNotificationOpen = (event) => setNotificationAnchorEl(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchorEl(null);

  const handleLogout = () => {
    handleProfileClose();
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const searchableRoutes = [
    { label: 'Orders', path: '/orders' },
    { label: 'Tables', path: '/tables' },
    { label: 'Menu Items Catalog', path: '/menu' },
    { label: 'Kitchen Ingredients & Units', path: '/ingredients' },
    { label: 'Dish Recipes & Cooking Steps', path: '/recipes' },
    { label: 'Inventory Stock Control', path: '/inventory' },
    { label: 'Approved Supplier Directory', path: '/suppliers' },
    { label: 'Purchase Orders Ledger', path: '/purchase-orders' },
    { label: 'Expenses Register', path: '/expenses' },
    { label: 'Invoice OCR Dropzone', path: '/invoice-upload' },
    { label: 'Financial Analytics Reports', path: '/reports' },
    { label: 'Users & RBAC Roles', path: '/users' },
  ];

  const filteredRoutes = searchableRoutes.filter((r) =>
    r.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sampleNotifications = [
    { id: 1, text: 'New order #ORD-104 received from Table 7', time: '4 mins ago' },
    { id: 2, text: 'Low stock alert: Fresh Tomatoes below 15 kg', time: '18 mins ago' },
    { id: 3, text: 'PO #8801 status updated to RECEIVED', time: '1 hr ago' },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(9, 13, 22, 0.85)'
              : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          {/* Left: Drawer Toggle & Brand Logo */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="toggle sidebar"
              onClick={onToggleSidebar}
              sx={{ mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              display="flex"
              alignItems="center"
              gap={1.2}
              onClick={() => navigate('/dashboard')}
              sx={{ cursor: 'pointer' }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                }}
              >
                <RestaurantMenuIcon fontSize="small" />
              </Box>
              <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em">
                RestaurantOS
              </Typography>
            </Box>
          </Box>

          {/* Center: Search Bar Button */}
          <Paper
            elevation={0}
            onClick={() => setSearchOpen(true)}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              px: 2,
              py: 0.8,
              borderRadius: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              width: 340,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
              Quick navigation search...
            </Typography>

            <Typography
              variant="caption"
              sx={{
                bgcolor: 'background.paper',
                px: 1,
                py: 0.3,
                borderRadius: 1.5,
                border: '1px solid rgba(0,0,0,0.1)',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            >
              Ctrl K
            </Typography>
          </Paper>

          {/* Right Side Controls */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {mode === 'dark' ? <LightModeIcon sx={{ color: '#FBBF24' }} /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Notifications Bell */}
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationOpen}>
                <Badge badgeContent={sampleNotifications.length} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Notifications Popover */}
            <Popover
              open={Boolean(notificationAnchorEl)}
              anchorEl={notificationAnchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{
                paper: {
                  elevation: 4,
                  sx: { width: 340, borderRadius: 3, mt: 1, p: 1 },
                },
              }}
            >
              <Box p={1.5} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight={700}>
                  System Notifications
                </Typography>
                <Chip label="2 New" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
              </Box>
              <Divider />
              <List disablePadding>
                {mockNotifications.map((item) => (
                  <ListItem key={item.id} sx={{ px: 2, py: 1.2, '&:hover': { bgcolor: 'action.hover' } }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.type === 'order' ? <OrderIcon color="primary" fontSize="small" /> : <WarningIcon color="warning" fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      slotProps={{ primary: { fontSize: '0.825rem', fontWeight: 600 } }}
                      secondary={item.time}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Popover>
          </Box>

          <Box>
            <IconButton onClick={handleProfileOpen} size="small" sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem', fontWeight: 700 }}>
                {user?.fullName?.charAt(0) || 'H'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{
                paper: {
                  elevation: 4,
                  sx: { width: 230, borderRadius: 3, mt: 1, p: 0.5 },
                },
              }}
            >
              <Box px={2} py={1.5}>
                <Typography variant="subtitle2" fontWeight={700} noWrap>
                  {user?.fullName || 'Harsh Singh'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {user?.email || 'harsh@gmail.com'}
                </Typography>
                <Chip
                  label={userRole || 'OWNER'}
                  size="small"
                  color="primary"
                  sx={{ mt: 1, height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                />
              </Box>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={() => { handleProfileClose(); navigate('/settings'); }}>
                <SettingsIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                Account Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { elevation: 6, sx: { borderRadius: 4, mt: -10 } } }}
      >
        <Box p={2.5}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <SearchIcon color="action" />
            <InputBase
              autoFocus
              fullWidth
              placeholder="Search features, modules, settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ fontSize: '1.1rem', fontWeight: 600 }}
            />
          </Box>
          <Divider />

          <List sx={{ pt: 1, maxHeight: 320, overflow: 'auto' }}>
            {filteredRoutes.map((route, i) => (
              <ListItem
                key={i}
                button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                  navigate(route.path);
                }}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemText primary={route.label} slotProps={{ primary: { fontSize: '0.9rem', fontWeight: 600 } }} />
                <ArrowIcon fontSize="small" color="action" />
              </ListItem>
            ))}
          </List>
        </Box>
      </Dialog>
    </>
  );
};

export default Navbar;
