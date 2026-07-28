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
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';

export const WaitlistDialog = ({ open, onClose, waitlist = [], onAddWaitlist, onAssignWaitlist }) => {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    guests: 2,
    priority: 'Normal',
    estimatedWait: '15 Mins',
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.customerName || !form.phone) return;
    onAddWaitlist(form);
    setForm({ customerName: '', phone: '', guests: 2, priority: 'Normal', estimatedWait: '15 Mins' });
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title="Restaurant Waitlist & Seating Queue"
      subtitle="Manage waiting guests, assign priority levels, and auto-seat when tables free up"
      icon={HourglassTopIcon}
      iconColor="warning.main"
      actions={<Button onClick={onClose} color="inherit">Close Queue</Button>}
    >
      <Grid container spacing={3} sx={{ py: 1 }}>
        {/* Left Column: Add Waiting Guest Form */}
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
            Add Guest to Waitlist
          </Typography>
          <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField fullWidth required size="small" label="Customer Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            <TextField fullWidth required size="small" label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <TextField fullWidth required type="number" size="small" label="Party Size (Guests)" value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
            
            <FormControl fullWidth size="small">
              <InputLabel>Priority Tier</InputLabel>
              <Select value={form.priority} label="Priority Tier" onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <MenuItem value="Normal">Normal Queue</MenuItem>
                <MenuItem value="VIP">VIP Priority</MenuItem>
                <MenuItem value="Reservation Delay">Reservation Delay</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Estimated Wait Time</InputLabel>
              <Select value={form.estimatedWait} label="Estimated Wait Time" onChange={(e) => setForm({ ...form, estimatedWait: e.target.value })}>
                <MenuItem value="10 Mins">10 Minutes</MenuItem>
                <MenuItem value="15 Mins">15 Minutes</MenuItem>
                <MenuItem value="25 Mins">25 Minutes</MenuItem>
                <MenuItem value="40 Mins">40 Minutes</MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="warning" sx={{ borderRadius: 2, fontWeight: 700, mt: 1 }}>
              Add to Waitlist Queue
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Waiting Guests List */}
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
            Waiting Queue ({waitlist.length} Parties)
          </Typography>

          <Box sx={{ maxHeight: 360, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1, bgcolor: '#FFFFFF' }}>
            {waitlist.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No guests currently waiting in queue.
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {waitlist.map((item, idx) => (
                  <React.Fragment key={item.id || idx}>
                    <ListItem sx={{ py: 1, px: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {item.customerName} ({item.guests} Guests)
                          </Typography>
                          <Chip label={item.priority || 'Normal'} color={item.priority === 'VIP' ? 'error' : 'default'} size="small" sx={{ fontWeight: 700, height: 20 }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Phone: {item.phone} • Est. Wait: {item.estimatedWait || '15 Mins'}
                        </Typography>
                      </Box>
                      <Button size="small" variant="outlined" color="primary" onClick={() => onAssignWaitlist(item)} sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}>
                        Assign Table
                      </Button>
                    </ListItem>
                    {idx < waitlist.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Grid>
      </Grid>
    </ResponsiveDialog>
  );
};

export default WaitlistDialog;
