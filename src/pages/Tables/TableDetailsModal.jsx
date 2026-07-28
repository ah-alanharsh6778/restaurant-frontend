import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import dayjs from 'dayjs';

import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import TableStatusChip from './TableStatusChip';

export const TableDetailsModal = ({ open, onClose, table, onToggleOpenClose }) => {
  if (!table) return null;

  const tableNum = table.tableNumber || table.number || `#${table.id}`;
  const isOpen = table.isOpen !== false;
  const statusUpper = String(table.status || 'AVAILABLE').toUpperCase();
  const isOccupied = statusUpper === 'OCCUPIED';
  const isReserved = statusUpper === 'RESERVED';

  const currentOrder = table.currentOrder || (isOccupied ? { orderNumber: 'ORD-9918', amount: 84.50, status: 'Open', paymentStatus: 'Pending' } : null);
  const booking = table.booking || (isReserved ? { customerName: 'David Miller', phone: '+1 (555) 443-8899', guests: 4, date: '2026-07-26', time: '19:30' } : null);

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={`Table ${tableNum} Specifications`}
      subtitle={`Detailed telemetry, owner status, active order, and booking information`}
      icon={TableBarIcon}
      iconColor="primary.main"
      actions={
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2, px: 3 }}>
          Close Specifications
        </Button>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        {/* Owner Toggle & Status Header */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableStatusChip status={table.status} size="medium" />
            {!isOpen && <Chip label="CLOSED" color="default" size="small" sx={{ fontWeight: 800 }} />}
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={isOpen}
                onChange={(e) => onToggleOpenClose(table.id, e.target.checked)}
                color="success"
              />
            }
            label={
              <Typography variant="caption" sx={{ fontWeight: 800, color: isOpen ? 'success.main' : 'text.secondary' }}>
                {isOpen ? 'Table OPEN' : 'Table CLOSED'}
              </Typography>
            }
          />
        </Paper>

        {/* Specs Grid */}
        <Grid container spacing={2}>
          <Grid xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Table Number</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{tableNum}</Typography>
            </Paper>
          </Grid>
          <Grid xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Max Capacity</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{table.capacity || 4} Guests</Typography>
            </Paper>
          </Grid>
          <Grid xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Current Guests</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>{isOccupied ? (table.currentGuests || table.capacity || 4) : 0}</Typography>
            </Paper>
          </Grid>
          <Grid xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Created Date</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>{dayjs(table.createdAt || Date.now()).format('MMM DD, YYYY')}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Booking Details Section */}
        {booking && (
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EventIcon color="warning" fontSize="small" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Active Reservation Booking
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Customer: {booking.customerName} ({booking.phone})
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Guests: {booking.guests} • Time: {booking.date} at {booking.time}
            </Typography>
            {booking.specialNotes && (
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                Notes: "{booking.specialNotes}"
              </Typography>
            )}
          </Paper>
        )}

        {/* Active Order & Payment Status */}
        {isOccupied && currentOrder && (
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon color="error" fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Active Order Details
                </Typography>
              </Box>
              <Chip
                label={currentOrder.paymentStatus || 'Pending'}
                color={currentOrder.paymentStatus === 'Paid' ? 'success' : 'warning'}
                size="small"
                sx={{ fontWeight: 800 }}
              />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
              Order #{currentOrder.orderNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Amount: ${Number(currentOrder.amount).toFixed(2)} • Order Status: {currentOrder.status}
            </Typography>
          </Paper>
        )}
      </Box>
    </ResponsiveDialog>
  );
};

export default TableDetailsModal;
