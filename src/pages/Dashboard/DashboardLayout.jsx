import { useMemo } from 'react';
import { Paper, Box, Typography, Avatar, Chip, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';

export const DashboardLayout = ({ profile, loading, error, onRetry, children }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const currentDateFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const userRoleName = useMemo(() => {
    if (!profile) return 'OWNER';
    if (typeof profile.role === 'string' && profile.role) return profile.role;
    if (typeof profile.role === 'object' && profile.role !== null) {
      return profile.role.name || profile.role.title || 'OWNER';
    }
    return 'OWNER';
  }, [profile]);

  return (
    <Box>
      {/* Top Welcome Header Card */}
      <Paper
        elevation={3}
        sx={{
          p: 3.5,
          mb: 4,
          borderRadius: 4,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
              : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.4rem',
            }}
          >
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'A'}
          </Avatar>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em">
                {greeting}, {profile?.fullName || 'Executive Manager'}
              </Typography>
              <Chip
                label={userRoleName}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              RestaurantOS Control Center | Real-Time Live Backend Feed
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(0, 0, 0, 0.15)',
              px: 2,
              py: 1,
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <CalendarTodayIcon fontSize="small" sx={{ opacity: 0.8 }} />
            <Typography variant="subtitle2" fontWeight={700}>
              {currentDateFormatted}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            disabled={loading}
            sx={{ color: 'primary.main', fontWeight: 800, bgcolor: '#FFFFFF', '&:hover': { bgcolor: '#F8FAFC' } }}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Main Content Body */}
      {children}
    </Box>
  );
};

export default DashboardLayout;
