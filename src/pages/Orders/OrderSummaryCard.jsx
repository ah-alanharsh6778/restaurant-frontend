import { Paper, Grid, Box, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const OrderSummaryCard = ({ orders = [] }) => {
  const totalOrders = orders.length;

  const activeOrders = orders.filter((o) =>
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(String(o.status).toUpperCase())
  ).length;

  const completedOrders = orders.filter((o) =>
    ['SERVED', 'COMPLETED'].includes(String(o.status).toUpperCase())
  ).length;

  const totalRevenue = orders
    .filter((o) => String(o.status).toUpperCase() !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const statItems = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ReceiptLongIcon color="primary" />,
      bgcolor: 'primary.light',
    },
    {
      title: 'Active Orders',
      value: activeOrders,
      icon: <PendingActionsIcon sx={{ color: '#F97316' }} />,
      bgcolor: '#FFEDD5',
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: <CheckCircleIcon sx={{ color: '#10B981' }} />,
      bgcolor: '#D1FAE5',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
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

export default OrderSummaryCard;
