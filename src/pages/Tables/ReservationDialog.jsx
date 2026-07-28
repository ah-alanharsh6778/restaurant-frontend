import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import dayjs from 'dayjs';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';

export const ReservationDialog = ({ open, onClose, onSubmit, table, isSubmitting }) => {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    guests: table?.capacity || 2,
    reservationDate: dayjs().format('YYYY-MM-DD'),
    reservationTime: '19:00',
    duration: '90 Mins',
    occasion: 'Standard Dining',
    specialRequest: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerName || !form.phone) return;
    onSubmit({
      tableId: table?.id,
      tableNumber: table?.tableNumber || table?.number,
      ...form,
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={`Book Table Reservation ${table ? `#${table.tableNumber || table.number}` : ''}`}
      subtitle="Enter customer details, occasion, and reservation time slot"
      icon={TableBarIcon}
      iconColor="primary.main"
      actions={
        <>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting} sx={{ borderRadius: 2, px: 3 }}>
            Confirm Reservation
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth required size="small" label="Customer Full Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth required size="small" label="Mobile Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth required type="number" size="small" label="Number of Guests" value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth required type="date" size="small" label="Reservation Date" value={form.reservationDate} onChange={(e) => setForm({ ...form, reservationDate: e.target.value })} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth required type="time" size="small" label="Reservation Time" value={form.reservationTime} onChange={(e) => setForm({ ...form, reservationTime: e.target.value })} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Occasion</InputLabel>
              <Select value={form.occasion} label="Occasion" onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
                <MenuItem value="Standard Dining">Standard Dining</MenuItem>
                <MenuItem value="Birthday">Birthday Celebration</MenuItem>
                <MenuItem value="Anniversary">Anniversary</MenuItem>
                <MenuItem value="Business Meeting">Business Meeting</MenuItem>
                <MenuItem value="VIP Guest">VIP Guest</MenuItem>
                <MenuItem value="Walk-in">Walk-in Priority</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Duration</InputLabel>
              <Select value={form.duration} label="Duration" onChange={(e) => setForm({ ...form, duration: e.target.value })}>
                <MenuItem value="60 Mins">60 Minutes</MenuItem>
                <MenuItem value="90 Mins">90 Minutes</MenuItem>
                <MenuItem value="120 Mins">120 Minutes</MenuItem>
                <MenuItem value="180 Mins">180 Minutes (VIP)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={2} size="small" label="Special Requests / Dietary Notes" value={form.specialRequest} onChange={(e) => setForm({ ...form, specialRequest: e.target.value })} />
          </Grid>
        </Grid>
      </Box>
    </ResponsiveDialog>
  );
};

export default ReservationDialog;
