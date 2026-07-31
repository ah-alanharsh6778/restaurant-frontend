import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import EventIcon from '@mui/icons-material/Event';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import dayjs from 'dayjs';

import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import TableStatusChip from './TableStatusChip';

export const TableDetailsModal = ({
  open,
  onClose,
  table,
  onCheckIn,
  onCancelBooking,
  onEditBooking,
  onCreateOrder,
  onEditTable,
  onDeleteTable,
  canManage = false,
}) => {
  if (!table) return null;

  const tableNum = table.tableNumber || table.number || (table.id ? `#${table.id.substring(0, 4)}` : '');
  const statusUpper = String(table.status || 'AVAILABLE').toUpperCase();
  const isAvailable = statusUpper === 'AVAILABLE';
  const isOccupied = statusUpper === 'OCCUPIED';
  const isReserved = statusUpper === 'RESERVED';

  const customerName = table.booking?.customerName || table.customer?.fullName || null;
  const customerPhone = table.booking?.phone || table.customer?.phone || null;
  const customerEmail = table.booking?.email || table.customer?.email || null;
  const bookingTime = table.booking?.time || '19:30';
  const bookingDate = table.booking?.date ? dayjs(table.booking.date).format('MMM DD, YYYY') : 'Today';
  const guestCount = table.booking?.guests || table.capacity || 4;
  const specialNotes = table.booking?.specialNotes || null;

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={`Table #${tableNum} Details & Operations`}
      subtitle={`Seating capacity: ${table.capacity || 4} Guests • Current Status: ${statusUpper}`}
      icon={TableBarIcon}
      iconColor="#7C6CFF"
      PaperProps={{
        sx: {
          backgroundColor: '#131A24',
          color: '#FFFFFF',
          borderRadius: { xs: '20px', sm: '24px' },
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      }}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end' }}>
          {canManage && onEditTable && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => {
                onClose();
                onEditTable(table);
              }}
              sx={{
                borderRadius: '12px',
                borderColor: 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
              }}
            >
              Edit Table
            </Button>
          )}

          {canManage && onDeleteTable && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                onClose();
                onDeleteTable(table);
              }}
              sx={{
                borderRadius: '12px',
                borderColor: 'rgba(239,68,68,0.3)',
                color: '#EF4444',
              }}
            >
              Delete
            </Button>
          )}

          <Button
            onClick={onClose}
            variant="contained"
            size="small"
            sx={{
              borderRadius: '12px',
              backgroundColor: '#7C6CFF',
              color: '#FFFFFF',
              px: 3,
              fontWeight: 700,
            }}
          >
            Close
          </Button>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
        {/* Status Header Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TableStatusChip status={table.status} size="medium" />
            <Typography variant="body2" sx={{ color: '#9CA3AF', fontWeight: 600 }}>
              Table #{tableNum}
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
            Capacity: {table.capacity || 4} Guests
          </Typography>
        </Paper>

        {/* Customer Information (If Reserved or Occupied) */}
        {(isReserved || isOccupied || customerName) && (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              backgroundColor: 'rgba(245, 158, 11, 0.06)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <EventIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '16px' }}>
                Customer & Reservation Details
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block' }}>
                  Customer Name
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: '15px' }}>
                  {customerName || 'Walk-in Guest'}
                </Typography>
              </Grid>

              <Grid xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block' }}>
                  Phone Number
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: '15px' }}>
                  {customerPhone || 'N/A'}
                </Typography>
              </Grid>

              {customerEmail && (
                <Grid xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block' }}>
                    Email Address
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: '14px' }}>
                    {customerEmail}
                  </Typography>
                </Grid>
              )}

              <Grid xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block' }}>
                  Guest Count
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#F59E0B', fontSize: '15px' }}>
                  {guestCount} Guests
                </Typography>
              </Grid>

              <Grid xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block' }}>
                  Booking Slot
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: '14px' }}>
                  {bookingTime} ({bookingDate})
                </Typography>
              </Grid>

              {specialNotes && (
                <Grid xs={12}>
                  <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block' }}>
                    Special Request / Notes
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', fontStyle: 'italic', fontSize: '14px' }}>
                    "{specialNotes}"
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}

        {/* Active Order Telemetry */}
        {isOccupied && table.currentOrder && (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              backgroundColor: 'rgba(239, 68, 68, 0.06)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon sx={{ color: '#EF4444', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  Active Order Details
                </Typography>
              </Box>
              <Chip
                label={table.currentOrder.paymentStatus || 'UNPAID'}
                color={table.currentOrder.paymentStatus === 'PAID' ? 'success' : 'error'}
                size="small"
                sx={{ fontWeight: 800 }}
              />
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 800, color: '#7C6CFF' }}>
              Order #{table.currentOrder.orderNumber || table.currentOrder.id}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
              Total Amount: ${Number(table.currentOrder.finalAmount || table.currentOrder.totalAmount || 0).toFixed(2)} • Status: {table.currentOrder.status}
            </Typography>
          </Paper>
        )}

        {/* Quick Action Operations Bar */}
        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.05em', mt: 1 }}>
          QUICK TABLE OPERATIONS
        </Typography>

        <Grid container spacing={1.5}>
          {isReserved && (
            <Grid xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  onClose();
                  onCheckIn && onCheckIn(table.id);
                }}
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  py: 1.2,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#059669' },
                }}
              >
                Check In Party
              </Button>
            </Grid>
          )}

          {isReserved && (
            <Grid xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => {
                  onClose();
                  onEditBooking && onEditBooking(table);
                }}
                sx={{
                  borderRadius: '12px',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  py: 1.2,
                  textTransform: 'none',
                  '&:hover': { borderColor: '#7C6CFF', color: '#7C6CFF' },
                }}
              >
                Edit Booking
              </Button>
            </Grid>
          )}

          {isReserved && (
            <Grid xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  onClose();
                  onCancelBooking && onCancelBooking(table.id);
                }}
                sx={{
                  borderRadius: '12px',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  color: '#EF4444',
                  py: 1.2,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444' },
                }}
              >
                Cancel Booking
              </Button>
            </Grid>
          )}

          {(isOccupied || isReserved || isAvailable) && (
            <Grid xs={12} sm={isReserved ? 6 : 12}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => {
                  onClose();
                  onCreateOrder && onCreateOrder(table);
                }}
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#7C6CFF',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  py: 1.2,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#6854FF' },
                }}
              >
                Create Order
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </ResponsiveDialog>
  );
};

export default TableDetailsModal;
