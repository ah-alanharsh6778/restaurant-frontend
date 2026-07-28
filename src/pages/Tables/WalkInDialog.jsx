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
import PeopleIcon from '@mui/icons-material/People';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';

export const WalkInDialog = ({ open, onClose, onSubmit, table, isSubmitting }) => {
  const [form, setForm] = useState({
    customerName: 'Walk-In Guest',
    phone: '+1 (555) 000-1122',
    guests: table?.capacity || 2,
    waiterName: 'Sarah Jenkins',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      tableId: table?.id,
      ...form,
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title={`Instant Walk-In Seating ${table ? `#${table.tableNumber || table.number}` : ''}`}
      subtitle="Assign table immediately and change status from Available to Occupied"
      icon={PeopleIcon}
      iconColor="error.main"
      actions={
        <>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="error" disabled={isSubmitting} sx={{ borderRadius: 2, px: 3 }}>
            Seat Party Now
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        <TextField fullWidth size="small" label="Customer Name / Guest Label" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
        <TextField fullWidth size="small" label="Guest Contact Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <TextField fullWidth type="number" size="small" label="Number of Guests" value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
        
        <FormControl fullWidth size="small">
          <InputLabel>Assign Lead Waiter</InputLabel>
          <Select value={form.waiterName} label="Assign Lead Waiter" onChange={(e) => setForm({ ...form, waiterName: e.target.value })}>
            <MenuItem value="Sarah Jenkins">Sarah Jenkins</MenuItem>
            <MenuItem value="Marcus Vance">Marcus Vance</MenuItem>
            <MenuItem value="Elena Rostova">Elena Rostova</MenuItem>
            <MenuItem value="David Miller">David Miller</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </ResponsiveDialog>
  );
};

export default WalkInDialog;
