import { Grid, Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OrderStatusChip from './OrderStatusChip';

export const KitchenStatus = ({ orders = [], onUpdateStatus }) => {
  const activeOrders = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING' || o.status === 'READY'
  );

  const defaultKitchenTickets = [
    {
      id: 'k1',
      orderNumber: '#ORD-104',
      tableNumber: 'Table 7',
      status: 'PREPARING',
      items: [
        { name: 'Margherita Pizza', quantity: 2 },
        { name: 'Iced Latte', quantity: 2 },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'k2',
      orderNumber: '#ORD-105',
      tableNumber: 'Table 2',
      status: 'READY',
      items: [
        { name: 'Truffle Pasta', quantity: 1 },
        { name: 'Crispy Calamari', quantity: 1 },
      ],
      createdAt: new Date().toISOString(),
    },
  ];

  const tickets = activeOrders.length > 0 ? activeOrders : defaultKitchenTickets;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <KitchenIcon color="primary" fontSize="large" />
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Live Kitchen Display System (KDS)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time ticket queue for chef and kitchen staff workflow
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {tickets.map((ticket) => (
          <Grid xs={12} sm={6} md={4} key={ticket.id || ticket._id}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 3.5,
                borderTop: (theme) =>
                  ticket.status === 'READY'
                    ? `5px solid ${theme.palette.success.main}`
                    : `5px solid ${theme.palette.warning.main}`,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography variant="h6" fontWeight={800}>
                    {ticket.orderNumber || `#ORD-${ticket.id?.slice(0, 5)}`}
                  </Typography>
                  <Chip
                    label={ticket.table?.tableNumber || ticket.tableNumber || 'Takeout'}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 800 }}
                  />
                </Box>

                <Box mb={2}>
                  <OrderStatusChip status={ticket.status} />
                </Box>

                <Box mb={2.5} sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={800} display="block" mb={0.5}>
                    TICKET ITEMS
                  </Typography>
                  {ticket.items && ticket.items.length > 0 ? (
                    ticket.items.map((it, idx) => (
                      <Typography key={idx} variant="body2" fontWeight={600}>
                        {it.quantity || 1}x {it.name || it.menuItem?.name || 'Dish Item'}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" fontWeight={600}>
                      Standard Meal Combo x 1
                    </Typography>
                  )}
                </Box>

                {ticket.status === 'PREPARING' || ticket.status === 'PENDING' ? (
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<CheckCircleIcon />}
                    onClick={() => onUpdateStatus(ticket.id || ticket._id, 'READY')}
                  >
                    Mark Ready for Serving
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => onUpdateStatus(ticket.id || ticket._id, 'SERVED')}
                  >
                    Mark Served to Table
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KitchenStatus;
