import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TableBar as TablesIcon,
  Category as CategoryIcon,
  RestaurantMenu as MenuIcon,
  Kitchen as IngredientIcon,
  MenuBook as RecipeIcon,
  ReceiptLong as OrderIcon,
  LocalShipping as SupplierIcon,
  ShoppingCart as PurchaseOrderIcon,
  Inventory as InventoryIcon,
  Payments as ExpenseIcon,
  CloudUpload as InvoiceIcon,
  Assessment as ReportIcon,
  People as UserIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 76;

export const Sidebar = ({ open = true, isMobile = false, onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasRole, userRole } = useAuth();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, roles: [] },
        { label: 'Orders', path: '/orders', icon: <OrderIcon />, roles: [] },
        { label: 'Tables', path: '/tables', icon: <TablesIcon />, roles: [] },
      ],
    },
    {
      title: 'CATALOG & RECIPES',
      items: [
        { label: 'Menu Categories', path: '/menu/categories', icon: <CategoryIcon />, roles: ['OWNER', 'MANAGER', 'CHEF'] },
        { label: 'Menu Items Catalog', path: '/menu', icon: <MenuIcon />, roles: ['OWNER', 'MANAGER', 'CHEF'] },
        { label: 'Kitchen Ingredients', path: '/ingredients', icon: <IngredientIcon />, roles: ['OWNER', 'MANAGER', 'CHEF', 'STORE_MANAGER'] },
        { label: 'Dish Recipes & Portions', path: '/recipes', icon: <RecipeIcon />, roles: ['OWNER', 'MANAGER', 'CHEF'] },
      ],
    },
    {
      title: 'OPERATIONS & INVENTORY',
      items: [
        { label: 'Inventory Stock Level', path: '/inventory', icon: <InventoryIcon />, roles: ['OWNER', 'MANAGER', 'STORE_MANAGER'] },
        { label: 'Approved Suppliers', path: '/suppliers', icon: <SupplierIcon />, roles: ['OWNER', 'MANAGER', 'STORE_MANAGER'] },
        { label: 'Purchase Orders', path: '/purchase-orders', icon: <PurchaseOrderIcon />, roles: ['OWNER', 'MANAGER', 'STORE_MANAGER'] },
      ],
    },
    {
      title: 'FINANCE & ANALYTICS',
      items: [
        { label: 'Expenses Register', path: '/expenses', icon: <ExpenseIcon />, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
        { label: 'Invoice OCR Upload', path: '/invoice-upload', icon: <InvoiceIcon />, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
        { label: 'Business Reports', path: '/reports', icon: <ReportIcon />, roles: ['OWNER', 'MANAGER'] },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Users & RBAC Roles', path: '/users', icon: <UserIcon />, roles: ['OWNER'] },
        { label: 'System Settings', path: '/settings', icon: <SettingsIcon />, roles: ['OWNER', 'MANAGER'] },
      ],
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        py: 2,
        px: open ? 1.5 : 1,
      }}
    >
      {/* Access Level Badge */}
      {open && (
        <Box
          sx={{
            mx: 1,
            mb: 2.5,
            p: 1.5,
            borderRadius: 3,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={800} display="block">
              ACCESS LEVEL
            </Typography>
            <Typography variant="body2" fontWeight={800} color="primary">
              {userRole || 'OWNER'}
            </Typography>
          </Box>
          <Chip label="ONLINE" color="success" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }} />
        </Box>
      )}

      {/* Nav List */}
      <List sx={{ flexGrow: 1, py: 0 }}>
        {navSections.map((section, sectionIdx) => {
          const visibleItems = section.items.filter(
            (item) => item.roles.length === 0 || hasRole(item.roles)
          );

          if (visibleItems.length === 0) return null;

          return (
            <Box key={sectionIdx} sx={{ mb: 2 }}>
              {open && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={800}
                  sx={{ px: 2, py: 0.5, display: 'block', letterSpacing: '0.06em' }}
                >
                  {section.title}
                </Typography>
              )}

              {visibleItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={!open ? item.label : ''} placement="right">
                      <ListItemButton
                        onClick={() => {
                          navigate(item.path);
                          if (isMobile && onCloseMobile) onCloseMobile();
                        }}
                        selected={isActive}
                        sx={{
                          borderRadius: 2.5,
                          py: 1,
                          px: open ? 2 : 1.5,
                          justifyContent: open ? 'initial' : 'center',
                          backgroundColor: isActive
                            ? (theme) => (theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.08)')
                            : 'transparent',
                          color: isActive ? 'primary.main' : 'text.primary',
                          borderLeft: isActive ? (theme) => `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                          fontWeight: isActive ? 800 : 500,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : 'auto',
                            justifyContent: 'center',
                            color: isActive ? 'primary.main' : 'text.secondary',
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        {open && (
                          <ListItemText
                            primary={item.label}
                            slotProps={{
                              primary: {
                                fontSize: '0.875rem',
                                fontWeight: isActive ? 800 : 500,
                              },
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
            </Box>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: { width: DRAWER_WIDTH, borderRadius: '0 16px 16px 0' },
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
      }}
      slotProps={{
        paper: {
          sx: {
            width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            top: { sm: 64 },
            height: { sm: 'calc(100vh - 64px)' },
          },
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
