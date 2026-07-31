import React from 'react';
import { Box, Typography, Grid, Divider, Avatar, Paper, Chip } from '@mui/material';
import { MdEvent, MdReceipt } from 'react-icons/md';
import dayjs from 'dayjs';
import { Modal, Badge, Button } from '../../components/ui';

export const CustomerDetailsDialog = ({ open, onClose, customer, onEdit, onDelete, canManage = true }) => {
  if (!customer) return null;

  const points = customer.loyaltyPoints || 0;
  const getTier = (pts) => {
    if (pts >= 200) return { label: 'Gold VIP Member', variant: 'warning' };
    if (pts >= 100) return { label: 'Silver Preferred Member', variant: 'info' };
    if (pts > 0) return { label: 'Bronze Member', variant: 'success' };
    return { label: 'Standard Member', variant: 'neutral' };
  };

  const tier = getTier(points);

  const tablesList = Array.isArray(customer.tables) ? customer.tables : [];
  const reservationsList = Array.isArray(customer.reservations) ? customer.reservations : [];
  const ordersList = Array.isArray(customer.orders) ? customer.orders : [];

  const activeTable = tablesList.length > 0 ? tablesList[0] : null;
  const activeReservation = reservationsList.length > 0 ? reservationsList[0] : null;
  const totalOrders = ordersList.length;
  const totalSpent = ordersList.reduce((sum, o) => sum + Number(o.finalAmount || o.totalAmount || 0), 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Customer Profile & Booking History"
      subtitle={`Detailed telemetry & active seating for ${customer.fullName}`}
      maxWidth="md"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
        <Avatar
          variant="square"
          sx={{
            width: 64,
            height: 64,
            fontSize: '1.5rem',
            fontWeight: 800,
            backgroundColor: 'var(--primary-600)',
            color: '#FFFFFF',
            borderRadius: '4px',
            boxShadow: 'var(--shadow-glow-primary)',
          }}
        >
          {customer.fullName ? customer.fullName.slice(0, 2).toUpperCase() : 'CU'}
        </Avatar>

        <Box>
          <Typography variant="h6" fontWeight={800}>
            {customer.fullName}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Badge label={tier.label} variant={tier.variant} dot />
            <Typography variant="caption" color="var(--text-secondary)">
              {points} Loyalty Points
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 3, borderColor: 'var(--border-subdued)' }} />

      {/* Grid Specs & Telemetry */}
      <Grid container spacing={2.5} mb={3}>
        <Grid xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '4px', border: '1px solid var(--border-subdued)', bgcolor: 'var(--bg-subtle)' }}>
            <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block' }}>
              Phone Number
            </Typography>
            <Typography variant="body2" fontWeight={800} color="var(--text-primary)" mt={0.5}>
              {customer.phone || 'No phone provided'}
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '4px', border: '1px solid var(--border-subdued)', bgcolor: 'var(--bg-subtle)' }}>
            <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block' }}>
              Email Address
            </Typography>
            <Typography variant="body2" fontWeight={700} color="var(--text-primary)" mt={0.5} noWrap>
              {customer.email || 'No email provided'}
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '4px', border: '1px solid var(--border-subdued)', bgcolor: 'var(--bg-subtle)' }}>
            <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block' }}>
              Current Table
            </Typography>
            <Typography variant="body2" fontWeight={800} color="var(--primary-600)" mt={0.5}>
              {activeTable ? `Table #${activeTable.tableNumber}` : activeReservation?.table ? `Table #${activeReservation.table.tableNumber}` : 'Unseated'}
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '4px', border: '1px solid var(--border-subdued)', bgcolor: 'var(--bg-subtle)' }}>
            <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block' }}>
              Total Spend
            </Typography>
            <Typography variant="body2" fontWeight={800} color="var(--color-success)" mt={0.5}>
              ${totalSpent.toFixed(2)} ({totalOrders} {totalOrders === 1 ? 'Order' : 'Orders'})
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Reservation History */}
      <Box mb={3}>
        <Typography variant="subtitle2" fontWeight={800} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MdEvent size={18} color="var(--primary-500)" /> Active Reservation & Booking History
        </Typography>

        {activeReservation ? (
          <Paper elevation={0} sx={{ p: 2, borderRadius: '4px', border: '1px solid var(--border-subdued)', bgcolor: 'var(--bg-canvas)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight={800}>
                Table #{activeReservation.table?.tableNumber || 'N/A'} • Party of {activeReservation.guestCount || 2} Guests
              </Typography>
              <Chip label={activeReservation.status || 'CONFIRMED'} color="primary" size="small" sx={{ fontWeight: 800, borderRadius: '4px' }} />
            </Box>
            <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block' }}>
              Booking Slot: {activeReservation.bookingDate ? dayjs(activeReservation.bookingDate).format('MMM DD, YYYY') : 'Today'} at {activeReservation.bookingTime || '19:30'}
            </Typography>
          </Paper>
        ) : (
          <Typography variant="body2" color="var(--text-secondary)" fontStyle="italic">
            No active table reservations recorded for this customer.
          </Typography>
        )}
      </Box>

      {/* Recent Orders History */}
      <Box mb={3}>
        <Typography variant="subtitle2" fontWeight={800} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MdReceipt size={18} color="var(--primary-500)" /> Recent POS Orders
        </Typography>

        {totalOrders > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {ordersList.slice(0, 3).map((ord) => {
              const orderIdStr = ord.id || ord._id || '';
              const orderNum = ord.orderNumber || (orderIdStr ? String(orderIdStr).substring(0, 8) : 'N/A');
              return (
                <Paper key={orderIdStr || Math.random()} elevation={0} sx={{ p: 1.5, borderRadius: '4px', border: '1px solid var(--border-subdued)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={800}>
                      Order #{orderNum}
                    </Typography>
                    <Typography variant="caption" color="var(--text-secondary)">
                      {ord.createdAt ? dayjs(ord.createdAt).format('MMM DD, YYYY HH:mm') : 'Recent'}
                    </Typography>
                  </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight={800} color="var(--primary-600)">
                    ${Number(ord.finalAmount || 0).toFixed(2)}
                  </Typography>
                  <Chip label={ord.status} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.675rem', borderRadius: '4px' }} />
                </Box>
              </Paper>
              );
            })}
          </Box>
        ) : (
          <Typography variant="body2" color="var(--text-secondary)" fontStyle="italic">
            No previous dining orders recorded.
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 4 }}>
        {onEdit && (
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              onEdit(customer);
            }}
          >
            Edit Profile
          </Button>
        )}
        {canManage && onDelete && (
          <Button
            variant="danger"
            onClick={() => {
              onClose();
              onDelete(customer);
            }}
          >
            Delete Profile
          </Button>
        )}
        <Button variant="contained" onClick={onClose}>
          Close Profile
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomerDetailsDialog;
