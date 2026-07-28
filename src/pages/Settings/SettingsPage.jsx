import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import { toast } from 'react-toastify';

import PageContainer from '../../layout/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import FormSection from '../../components/common/FormSection';
import { useAuth } from '../../hooks/useAuth';

export const SettingsPage = () => {
  const { user } = useAuth();

  // Settings State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    lowStockAlerts: true,
    orderSoundAlerts: true,
    dailyReports: false,
  });

  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'RestaurantOS Master Kitchen',
    taxId: 'GST-99201948102',
    phone: '+1 555-019-2831',
    email: 'contact@restaurantos.com',
    address: '100 Enterprise Way, Suite 400, Austin TX',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveSettings = () => {
    toast.success('System settings saved successfully!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    toast.success('Password updated successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <PageContainer maxWidth={false}>
      {/* Page Header */}
      <PageHeader
        title="Application & System Settings"
        subtitle="Manage notification channels, restaurant profile details, and security credentials"
        breadcrumbs={[
          { label: 'RestaurantOS', path: '/dashboard' },
          { label: 'Settings', path: '/settings' },
        ]}
        primaryAction={{
          label: 'Save Preferences',
          onClick: handleSaveSettings,
          icon: <SaveIcon />,
        }}
      />

      <Grid container spacing={3}>
        {/* Left Column: Notifications & Localization */}
        <Grid item xs={12} md={6}>
          {/* Notification Preferences */}
          <FormSection title="Notification Preferences" subtitle="Control automated email and audio telemetry alerts">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.emailAlerts}
                    onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                  />
                }
                label="Email Alerts for Low Stock & System Faults"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.lowStockAlerts}
                    onChange={(e) => setNotifications({ ...notifications, lowStockAlerts: e.target.checked })}
                  />
                }
                label="Real-time Inventory Low Stock Toast Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.orderSoundAlerts}
                    onChange={(e) => setNotifications({ ...notifications, orderSoundAlerts: e.target.checked })}
                  />
                }
                label="POS Audio Chime on New Order Receipt"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.dailyReports}
                    onChange={(e) => setNotifications({ ...notifications, dailyReports: e.target.checked })}
                  />
                }
                label="Daily Financial Summary Email Report"
              />
            </Box>
          </FormSection>

          {/* Localization & Region */}
          <FormSection title="Localization & Currency" subtitle="Set system default language and currency symbols">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="language-label">Language</InputLabel>
                  <Select
                    labelId="language-label"
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <MenuItem value="en">English (US)</MenuItem>
                    <MenuItem value="es">Spanish (Español)</MenuItem>
                    <MenuItem value="fr">French (Français)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="currency-label">Currency Symbol</InputLabel>
                  <Select
                    labelId="currency-label"
                    value={currency}
                    label="Currency Symbol"
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                    <MenuItem value="INR">INR (₹)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </FormSection>
        </Grid>

        {/* Right Column: Restaurant Profile & Password Change */}
        <Grid item xs={12} md={6}>
          {/* Restaurant Profile */}
          <FormSection title="Restaurant Profile Details" subtitle="Primary organizational identity and contact record">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Restaurant Legal Name"
                  value={restaurantInfo.name}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tax / GST Registration Number"
                  value={restaurantInfo.taxId}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, taxId: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Contact Phone Number"
                  value={restaurantInfo.phone}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Contact Email Address"
                  value={restaurantInfo.email}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  label="Physical Store Address"
                  value={restaurantInfo.address}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                />
              </Grid>
            </Grid>
          </FormSection>

          {/* User Account & Security */}
          <FormSection title="User Account Security" subtitle="Update account authentication credentials">
            <form onSubmit={handlePasswordChange}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    label="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    label="New Password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    label="Confirm New Password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SecurityIcon />}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                  >
                    Update Security Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormSection>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default SettingsPage;
