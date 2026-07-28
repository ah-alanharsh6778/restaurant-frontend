import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { title: 'Tables', subtitle: 'Manage dining layout', icon: <TableRestaurantIcon />, path: '/tables', color: '#2563EB' },
    { title: 'Orders', subtitle: 'POS ticketing register', icon: <PointOfSaleIcon />, path: '/orders', color: '#10B981' },
    { title: 'Inventory', subtitle: 'Stock ERP & Warehouses', icon: <InventoryIcon />, path: '/inventory', color: '#8B5CF6' },
    { title: 'Suppliers', subtitle: 'Vendor directory', icon: <LocalShippingIcon />, path: '/suppliers', color: '#F59E0B' },
    { title: 'Purchase Orders', subtitle: 'Stock procurement ledger', icon: <ReceiptLongIcon />, path: '/purchase-orders', color: '#EC4899' },
    { title: 'Expenses', subtitle: 'OCR & General ledger', icon: <AccountBalanceWalletIcon />, path: '/expenses', color: '#3B82F6' },
  ];

  return (
    <Box mb={4}>
      <Typography variant="h6" fontWeight={800} mb={2}>
        Quick Action Modules
      </Typography>

      <Grid container spacing={2}>
        {actions.map((act, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <Card
              elevation={2}
              onClick={() => navigate(act.path)}
              sx={{
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 8px 20px rgba(0,0,0,0.5)'
                      : '0 8px 20px rgba(37, 99, 235, 0.15)',
                  borderColor: act.color,
                },
                border: '1px solid transparent',
              }}
            >
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: `${act.color}15`,
                    color: act.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  {act.icon}
                </Box>
                <Typography variant="subtitle2" fontWeight={800} noWrap>
                  {act.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                  {act.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActions;
