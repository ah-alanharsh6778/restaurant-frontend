import { Paper, Grid, Box, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const PurchaseOrderSummaryCard = ({ purchaseOrders = [] }) => {
  const totalPOs = purchaseOrders.length;

  const pendingPOs = purchaseOrders.filter((po) =>
    ['PENDING', 'ORDERED'].includes(String(po.status).toUpperCase())
  ).length;

  const receivedPOs = purchaseOrders.filter((po) =>
    String(po.status).toUpperCase() === 'RECEIVED'
  ).length;

  const totalSpend = purchaseOrders
    .filter((po) => String(po.status).toUpperCase() !== 'CANCELLED')
    .reduce((sum, po) => sum + Number(po.totalAmount || 0), 0);

  const statItems = [
    {
      title: 'Total Purchase Orders',
      value: totalPOs,
      icon: <ShoppingCartIcon color="primary" />,
      bgcolor: 'primary.light',
    },
    {
      title: 'Pending Procurement',
      value: pendingPOs,
      icon: <PendingActionsIcon sx={{ color: '#F97316' }} />,
      bgcolor: '#FFEDD5',
    },
    {
      title: 'Received Deliveries',
      value: receivedPOs,
      icon: <LocalShippingIcon sx={{ color: '#10B981' }} />,
      bgcolor: '#D1FAE5',
    },
    {
      title: 'Total Procurement Spend',
      value: `$${totalSpend.toFixed(2)}`,
      icon: <AttachMoneyIcon sx={{ color: '#8B5CF6' }} />,
      bgcolor: '#EDE9FE',
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {statItems.map((item, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 3.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: item.bgcolor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                {item.title}
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                {item.value}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default PurchaseOrderSummaryCard;
