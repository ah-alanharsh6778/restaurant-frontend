import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, useNavigate } from 'react-router-dom';

export const Breadcrumbs = ({ items = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route map for human-readable breadcrumb labels
  const routeNameMap = {
    '/dashboard': 'Dashboard',
    '/tables': 'Tables',
    '/menu': 'Menu Items',
    '/menu/categories': 'Menu Categories',
    '/ingredients': 'Ingredients',
    '/recipes': 'Recipes',
    '/orders': 'Orders',
    '/suppliers': 'Suppliers',
    '/purchase-orders': 'Purchase Orders',
    '/inventory': 'Inventory Stock',
    '/expenses': 'Expenses',
    '/invoice-upload': 'Invoice Upload',
    '/reports': 'Reports',
    '/users': 'Users',
    '/settings': 'Settings',
  };

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 1 }}
    >
      <MuiLink
        underline="hover"
        color="inherit"
        onClick={() => navigate('/dashboard')}
        sx={{ display: 'flex', alignItems: 'center', fontSize: '0.825rem', cursor: 'pointer' }}
      >
        <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
        Home
      </MuiLink>

      {items.length > 0
        ? items.map((crumb, idx) => (
            <Typography key={idx} variant="caption" color="text.secondary" fontWeight={600}>
              {crumb}
            </Typography>
          ))
        : pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const label = routeNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1);

            return last ? (
              <Typography key={to} variant="caption" color="text.secondary" fontWeight={600}>
                {label}
              </Typography>
            ) : (
              <MuiLink
                key={to}
                underline="hover"
                color="inherit"
                onClick={() => navigate(to)}
                sx={{ fontSize: '0.825rem', cursor: 'pointer' }}
              >
                {label}
              </MuiLink>
            );
          })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
