import React from 'react';
import { Box, Typography, Grid, Divider, Avatar, Stack } from '@mui/material';
import { MdPerson, MdEmail, MdPhone, MdStar, MdCalendarToday } from 'react-icons/md';
import { Modal, Badge, Button } from '../../components/ui';

export const CustomerDetailsDialog = ({ open, onClose, customer }) => {
  if (!customer) return null;

  const points = customer.loyaltyPoints || 0;
  const getTier = (pts) => {
    if (pts >= 200) return { label: 'Gold VIP Member', variant: 'warning' };
    if (pts >= 100) return { label: 'Silver Preferred Member', variant: 'info' };
    if (pts > 0) return { label: 'Bronze Member', variant: 'success' };
    return { label: 'Standard Member', variant: 'neutral' };
  };

  const tier = getTier(points);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Customer Profile & Loyalty Details"
      subtitle={`Detailed telemetry for ${customer.fullName}`}
      maxWidth="sm"
    >
      <Box display="flex" alignItems="center" gap={2.5} mb={3}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            fontSize: '1.5rem',
            fontWeight: 800,
            backgroundColor: 'var(--primary-600)',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-glow-primary)',
          }}
        >
          {customer.fullName ? customer.fullName.slice(0, 2).toUpperCase() : 'CU'}
        </Avatar>

        <Box>
          <Typography variant="h6" fontWeight={800}>
            {customer.fullName}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            <Badge label={tier.label} variant={tier.variant} dot />
            <Typography variant="caption" color="var(--text-secondary)">
              {points} Points
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 3, borderColor: 'var(--border-subdued)' }} />

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="var(--text-secondary)" display="block">
            Email Address
          </Typography>
          <Typography variant="body2" fontWeight={700} color="var(--text-primary)">
            {customer.email || 'No email provided'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="var(--text-secondary)" display="block">
            Phone Number
          </Typography>
          <Typography variant="body2" fontWeight={700} color="var(--text-primary)">
            {customer.phone || 'No phone provided'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="var(--text-secondary)" display="block">
            Loyalty Balance
          </Typography>
          <Typography variant="body2" fontWeight={800} color="var(--primary-600)">
            {points} Loyalty Points
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="var(--text-secondary)" display="block">
            Account Created
          </Typography>
          <Typography variant="body2" fontWeight={700} color="var(--text-primary)">
            {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
          </Typography>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button variant="contained" onClick={onClose}>
          Close Profile
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomerDetailsDialog;
