import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import PageHeader from '../../components/layout/PageHeader';

export const Settings = () => {
  const [restaurantName, setRestaurantName] = useState('RestaurantOS Fine Dining');
  const [currency, setCurrency] = useState('USD ($)');
  const [taxRate, setTaxRate] = useState(8.5);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    toast.success('System settings saved successfully');
  };

  return (
    <Box>
      <PageHeader
        title="System Settings & Preferences"
        subtitle="Configure restaurant profile, tax rates, receipts, and system alerts."
        breadcrumbs={['Settings']}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3.5 }}>
            <Typography variant="h6" fontWeight={800} mb={3}>
              Restaurant General Profile
            </Typography>

            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Standard Sales Tax Rate (%)"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField fullWidth label="Support Email" defaultValue="support@restaurantos.com" />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={700} gutterBottom>
              Notification & Alert System
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  color="primary"
                />
              }
              label="Enable Low Stock & Live Order Alerts"
            />

            <Box mt={4} display="flex" justifyContent="flex-end">
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} size="large">
                Save System Settings
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
