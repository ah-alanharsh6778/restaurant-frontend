/**
 * RestaurantOS — Permission-Driven Sidebar
 *
 * Sidebar visibility is controlled entirely by:
 *   1. The user's role (from AuthContext — fetched from real backend)
 *   2. The hasRoleAccess() function from rbac.js (which uses real backend role names)
 *
 * NEVER hardcode menu visibility.
 * Each nav item declares which roles can see it.
 * Items are filtered at render time based on the current user's real role.
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableBarIcon from '@mui/icons-material/TableBar';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import HelpIcon from '@mui/icons-material/Help';
import GroupsIcon from '@mui/icons-material/Groups';

import { useAuth } from '../hooks/useAuth';
import { useColorMode } from '../context/ThemeContext';
import { normaliseRole } from '../utils/rbac';

export const SIDEBAR_WIDTH = 260;
export const COLLAPSED_SIDEBAR_WIDTH = 72;
export const MOBILE_SIDEBAR_WIDTH = 280;

/**
 * Nav item definition:
 *   label         — Display text
 *   path          — Route path
 *   icon          — MUI Icon element
 *   allowedRoles  — Real backend role names allowed to see this item.
 *                   Empty array = all authenticated roles can see it.
 */
const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <DashboardIcon />,
        allowedRoles: [], // All authenticated users
      },
    ],
  },
  {
    title: 'Restaurant Operations',
    items: [
      {
        label: 'Customer Directory',
        path: '/customers',
        icon: <GroupsIcon />,
        allowedRoles: ['ADMIN', 'MANAGER', 'WAITER'],
      },
      {
        label: 'Table POS Management',
        path: '/tables',
        icon: <TableBarIcon />,
        allowedRoles: ['ADMIN', 'MANAGER', 'WAITER'],
      },
      {
        label: 'POS Live Orders',
        path: '/orders',
        icon: <ShoppingCartIcon />,
        allowedRoles: ['ADMIN', 'MANAGER', 'CHEF', 'WAITER'],
      },
      {
        label: 'Menu Catalog',
        path: '/menu',
        icon: <RestaurantMenuIcon />,
        allowedRoles: ['ADMIN', 'MANAGER', 'CHEF', 'WAITER'],
      },
      {
        label: 'Recipes & Prep',
        path: '/recipes',
        icon: <MenuBookIcon />,
        allowedRoles: ['ADMIN', 'MANAGER', 'CHEF'],
      },
      {
        label: 'Ingredient Stock',
        path: '/ingredients',
        icon: <CategoryIcon />,
        allowedRoles: ['ADMIN', 'MANAGER', 'CHEF', 'INVENTORY_MANAGER'],
      },
    ],
  },
  {
    title: 'Supply Chain',
    items: [
      {
        label: 'Supplier Register',
        path: '/suppliers',
        icon: <LocalShippingIcon />,
        allowedRoles: ['ADMIN', 'MANAGER', 'INVENTORY_MANAGER'],
      },
      {
        label: 'Purchase Orders',
        path: '/purchase-orders',
        icon: <AssignmentIcon />,
        allowedRoles: ['ADMIN', 'MANAGER', 'INVENTORY_MANAGER'],
      },
      {
        label: 'Stock Inventory',
        path: '/inventory',
        icon: <InventoryIcon />,
        allowedRoles: ['ADMIN', 'MANAGER', 'CHEF', 'INVENTORY_MANAGER'],
      },
    ],
  },
  {
    title: 'Finance',
    items: [
      {
        label: 'Expenses & AI OCR',
        path: '/expenses',
        icon: <AttachMoneyIcon />,
        allowedRoles: ['ADMIN', 'MANAGER'],
      },
      {
        label: 'Invoice OCR',
        path: '/invoices',
        icon: <AssignmentIcon />,
        allowedRoles: ['ADMIN', 'MANAGER'],
      },
    ],
  },

  {
    title: 'Analytics & Reports',
    items: [
      {
        label: 'Reports & Telemetry',
        path: '/reports',
        icon: <BarChartIcon />,
        allowedRoles: ['ADMIN', 'MANAGER'],
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        label: 'User Management',
        path: '/users',
        icon: <PeopleIcon />,
        allowedRoles: ['ADMIN', 'MANAGER'],
      },
      {
        label: 'Roles & RBAC',
        path: '/roles',
        icon: <SecurityIcon />,
        allowedRoles: ['ADMIN'],
      },
    ],
  },
];


export const Sidebar = ({ mobileOpen, onMobileClose, collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode } = useColorMode();

  const userRole = normaliseRole(user?.role);

  const handleNavigate = (path) => {
    navigate(path);
    if (mobileOpen) onMobileClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      // Empty allowedRoles = visible to all authenticated users
      if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
      // ADMIN sees everything
      if (userRole === 'ADMIN') return true;
      // Otherwise check if role is in the allowed list
      return item.allowedRoles.includes(userRole);
    }),
  })).filter((section) => section.items.length > 0);


  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        borderRight: '1px solid var(--border-subdued)',
        overflowX: 'hidden',
      }}
    >
      {/* ── Brand Header ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          height: { xs: 60, md: 70 },
          minHeight: { xs: 60, md: 70 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 1.5 : { xs: 2, sm: 2.5 },
          boxSizing: 'border-box',
          borderBottom: '1px solid var(--border-subdued)',
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', overflow: 'hidden' }}
          onClick={() => handleNavigate('/dashboard')}
        >
          <Box sx={{ bgcolor: 'var(--primary-600)', width: 38, height: 38, boxShadow: 'var(--shadow-glow-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
            <RestaurantIcon fontSize="small" />
          </Box>
          {!collapsed && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              RestaurantOS
            </Typography>
          )}
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <IconButton onClick={onToggleCollapse} size="small" aria-label="toggle sidebar">
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      </Box>


      {/* ── Navigation Sections ────────────────────────────────────────────── */}

      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1, px: 1 }}>
        {visibleSections.map((section, idx) => (
          <Box key={section.title} sx={{ mb: 1.5 }}>
            {!collapsed && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  px: 2,
                  pb: 0.6,
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {section.title}
              </Typography>
            )}

            <List component="nav" disablePadding>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;

                const buttonContent = (
                  <ListItemButton
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    selected={isActive}
                    sx={{
                      mb: 0.3,
                      borderRadius: '10px',
                      minHeight: 40,
                      px: collapsed ? 1.5 : 1.8,
                      justifyContent: collapsed ? 'center' : 'initial',
                      transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&.Mui-selected': {
                        backgroundColor: 'var(--primary-600)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
                        '& .MuiListItemIcon-root': { color: '#FFFFFF' },
                        '&:hover': { backgroundColor: 'var(--primary-700)' },
                      },
                      '&:hover': {
                        backgroundColor: isActive ? 'var(--primary-700)' : 'var(--bg-subtle)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: collapsed ? 0 : 1.6,
                        justifyContent: 'center',
                        color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                        fontSize: '1.2rem',
                        '& svg': { fontSize: '1.2rem' },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            fontSize: '0.835rem',
                            fontWeight: isActive ? 700 : 500,
                            noWrap: true,
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                );

                return collapsed ? (
                  <Tooltip key={item.path} title={item.label} placement="right" arrow>
                    {buttonContent}
                  </Tooltip>
                ) : (
                  buttonContent
                );
              })}
            </List>

            {idx < visibleSections.length - 1 && !collapsed && (
              <Divider sx={{ my: 1, mx: 1, borderColor: 'var(--border-subdued)' }} />
            )}
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: 'var(--border-subdued)' }} />

      {/* ── Logout ────────────────────────────────────────────────────────── */}
      <Box sx={{ p: 1 }}>
        {collapsed ? (
          <Tooltip title="Logout" placement="right" arrow>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '10px',
                minHeight: 44,
                justifyContent: 'center',
                color: 'var(--color-danger)',
                '&:hover': { backgroundColor: 'rgba(239,68,68,0.08)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ) : (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '10px',
              minHeight: 44,
              color: 'var(--color-danger)',
              '&:hover': { backgroundColor: 'rgba(239,68,68,0.08)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: 1.6, color: 'inherit' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              slotProps={{ primary: { fontSize: '0.835rem', fontWeight: 700 } }}
            />
          </ListItemButton>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: collapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH },
        flexShrink: { md: 0 },
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: MOBILE_SIDEBAR_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: collapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH,
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
