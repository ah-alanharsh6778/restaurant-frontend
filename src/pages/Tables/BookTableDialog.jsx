import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Alert,
  Typography,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import dayjs from 'dayjs';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';

export const BookTableDialog = ({ open, onClose, onSubmit, table, isSubmitting }) => {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    guests: 2,
    bookingDate: dayjs().format('YYYY-MM-DD'),
    bookingTime: '19:30',
    specialNotes: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (table) {
      setForm({
        customerName: table.customer?.fullName || '',
        phone: table.customer?.phone || '',
        email: table.customer?.email || '',
        guests: Math.min(table.capacity || 4, Math.max(1, table.booking?.guests || 2)),
        bookingDate: table.booking?.date ? dayjs(table.booking.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        bookingTime: table.booking?.time || '19:30',
        specialNotes: table.booking?.specialNotes || '',
      });
    } else {
      setForm({
        customerName: '',
        phone: '',
        email: '',
        guests: 2,
        bookingDate: dayjs().format('YYYY-MM-DD'),
        bookingTime: '19:30',
        specialNotes: '',
      });
    }
    setErrorMsg('');
  }, [table, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.customerName.trim()) {
      setErrorMsg('Customer Name is required.');
      return;
    }

    if (!form.phone.trim()) {
      setErrorMsg('Phone Number is required.');
      return;
    }

    const guestNum = parseInt(form.guests, 10);
    if (!guestNum || guestNum <= 0) {
      setErrorMsg('Number of Guests must be greater than 0.');
      return;
    }

    const statusUpper = String(table?.status || '').toUpperCase();
    if (statusUpper === 'MAINTENANCE') {
      setErrorMsg('Table is currently under maintenance and cannot be booked.');
      return;
    }
    if (statusUpper === 'OCCUPIED') {
      setErrorMsg('Table is currently occupied and cannot be booked.');
      return;
    }

    onSubmit(table?.id, form);
  };

  const tableNum = table?.tableNumber || table?.number || (table?.id ? `#${table.id.substring(0, 4)}` : '');

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={`Book Table ${tableNum ? `#${tableNum}` : ''}`}
      subtitle={`Enter customer details to reserve Table ${tableNum} (Max Capacity: ${table?.capacity || 4} Guests)`}
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
        <>
          <Button
            onClick={onClose}
            sx={{
              color: '#9CA3AF',
              borderRadius: '12px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              borderRadius: '12px',
              backgroundColor: '#7C6CFF',
              color: '#FFFFFF',
              px: 3.5,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 8px 20px rgba(124, 108, 255, 0.35)',
              '&:hover': {
                backgroundColor: '#6854FF',
              },
            }}
          >
            {isSubmitting ? 'Booking...' : 'Book Table'}
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
        {errorMsg && (
          <Alert
            severity="error"
            sx={{
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </Alert>
        )}

        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.05em' }}>
          CUSTOMER INFORMATION
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              required
              size="small"
              label="Customer Name *"
              placeholder="e.g. John Smith"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#7C6CFF' },
                },
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiInputLabel-root': { color: '#9CA3AF' },
              }}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              required
              size="small"
              label="Phone Number *"
              placeholder="e.g. +91 9876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#7C6CFF' },
                },
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiInputLabel-root': { color: '#9CA3AF' },
              }}
            />
          </Grid>

          <Grid xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Email Address (Optional)"
              placeholder="e.g. john.smith@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#7C6CFF' },
                },
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiInputLabel-root': { color: '#9CA3AF' },
              }}
            />
          </Grid>
        </Grid>

        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.05em', mt: 1 }}>
          BOOKING & RESERVATION DETAILS
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="number"
              size="small"
              label="Number of Guests *"
              slotProps={{
                htmlInput: { min: 1, max: table?.capacity || 20 },
                helperText: { sx: { color: '#9CA3AF' } },
              }}
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
              helperText={`Max: ${table?.capacity || 4} Guests`}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#7C6CFF' },
                },
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiInputLabel-root': { color: '#9CA3AF' },
              }}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="date"
              size="small"
              label="Booking Date *"
              value={form.bookingDate}
              onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#7C6CFF' },
                },
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiInputLabel-root': { color: '#9CA3AF' },
              }}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="time"
              size="small"
              label="Booking Time *"
              value={form.bookingTime}
              onChange={(e) => setForm({ ...form, bookingTime: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#7C6CFF' },
                },
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiInputLabel-root': { color: '#9CA3AF' },
              }}
            />
          </Grid>

          <Grid xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label="Special Request / Notes"
              placeholder="e.g. Birthday celebration, window seating preference"
              value={form.specialNotes}
              onChange={(e) => setForm({ ...form, specialNotes: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#7C6CFF' },
                },
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiInputLabel-root': { color: '#9CA3AF' },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </ResponsiveDialog>
  );
};

export default BookTableDialog;
