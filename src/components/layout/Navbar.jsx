import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  InputBase,
  Paper,
  Dialog,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';

export const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
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
    { label: 'Invoice OCR Upload', path: '/invoice-upload' },
    { label: 'Financial Analytics Reports', path: '/reports' },
    { label: 'Users & RBAC Roles', path: '/users' },
  ];

  const filteredRoutes = searchableRoutes.filter((r) =>
    r.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderRadius: 0,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'var(--bg-surface)'
              : 'var(--bg-surface)',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          {/* Left: Menu Drawer Toggle & Brand Logo */}
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

            <Logo />
          </Box>

          {/* Center: Search Bar Trigger */}
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

          {/* Right Side: ThemeToggle, NotificationMenu, ProfileMenu */}
          <Box display="flex" alignItems="center" gap={1}>
            <ThemeToggle />
            <NotificationMenu />
            <ProfileMenu />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Quick Search Modal */}
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
                <ArrowForwardIcon fontSize="small" color="action" />
              </ListItem>
            ))}
          </List>
        </Box>
      </Dialog>
    </>
  );
};

export default Navbar;
