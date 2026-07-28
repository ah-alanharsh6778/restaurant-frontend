import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Alert,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import dayjs from 'dayjs';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';

export const BookTableDialog = ({ open, onClose, onSubmit, table, isSubmitting }) => {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    guests: 2,
    bookingDate: dayjs().format('YYYY-MM-DD'),
    bookingTime: '19:00',
    specialNotes: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (table) {
      setForm((prev) => ({
        ...prev,
        guests: Math.min(prev.guests || 2, table.capacity || 4),
      }));
    }
    setErrorMsg('');
  }, [table, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.customerName.trim() || !form.phone.trim()) {
      setErrorMsg('Customer Name and Phone Number are required.');
      return;
    }

    if (table && Number(form.guests) > Number(table.capacity)) {
      setErrorMsg(`Number of guests (${form.guests}) cannot exceed table capacity (${table.capacity}).`);
      return;
    }

    onSubmit(table?.id, form);
  };

  const tableNum = table?.tableNumber || table?.number || `#${table?.id}`;

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={`Book Table ${tableNum}`}
      subtitle={`Enter booking details for Table ${tableNum} (Max Capacity: ${table?.capacity || 4} Guests)`}
      icon={TableBarIcon}
      iconColor="primary.main"
      actions={
        <>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting} sx={{ borderRadius: 2, px: 3 }}>
            Confirm Booking
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              required
              size="small"
              label="Customer Name"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              required
              size="small"
              label="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="number"
              size="small"
              label="Number of Guests"
              slotProps={{ htmlInput: { min: 1, max: table?.capacity || 20 } }}
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
              helperText={`Max: ${table?.capacity || 4} Guests`}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="date"
              size="small"
              label="Booking Date"
              value={form.bookingDate}
              onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="time"
              size="small"
              label="Booking Time"
              value={form.bookingTime}
              onChange={(e) => setForm({ ...form, bookingTime: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label="Special Notes / Requests"
              value={form.specialNotes}
              onChange={(e) => setForm({ ...form, specialNotes: e.target.value })}
            />
          </Grid>
        </Grid>
      </Box>
    </ResponsiveDialog>
  );
};

export default BookTableDialog;
