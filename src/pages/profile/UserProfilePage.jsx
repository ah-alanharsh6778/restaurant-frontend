import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import PageContainer from '../../layout/PageContainer';
import userService from '../../services/user.service';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/ui';

export const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser, hasRole } = useAuth();

  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  // Fetch real profile from GET /api/users/profile
  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getUserProfile();
      const pData = res?.data || res;
      setProfile(pData);
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load live profile from backend');
      if (authUser) {
        setProfile(authUser);
      }
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  // Fetch real active sessions from GET /api/sessions/my-sessions
  const loadSessionsData = useCallback(async () => {
    try {
      setSessionsLoading(true);
      const res = await userService.getMySessions();
      setSessions(res?.data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch active sessions');
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  // Fetch real activity logs from GET /api/activity-logs
  const loadActivityLogsData = useCallback(async () => {
    try {
      setActivityLoading(true);
      const res = await userService.getActivityLogs();
      setActivityLogs(res?.data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setActivityLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
    loadSessionsData();
    loadActivityLogsData();
  }, [loadProfileData, loadSessionsData, loadActivityLogsData]);

  // Handle revoking single session via DELETE /api/sessions/:id
  const handleRevokeSession = async (sessionId) => {
    try {
      await userService.revokeSession(sessionId);
      toast.success('Session revoked successfully');
      loadSessionsData();
    } catch (error) {
      console.error('Error revoking session:', error);
      toast.error(error?.response?.data?.message || 'Failed to revoke session');
    }
  };

  // Handle revoking all other sessions via POST /api/sessions/revoke-all
  const handleRevokeAllSessions = async () => {
    try {
      await userService.revokeAllSessions();
      toast.success('All other user sessions revoked successfully!');
      loadSessionsData();
    } catch (error) {
      console.error('Error revoking all sessions:', error);
      toast.error(error?.response?.data?.message || 'Failed to revoke sessions');
    }
  };

  // Extract display information
  const userObj = profile || authUser || {};
  const displayName = userObj?.fullName || userObj?.name || 'User Profile';
  const displayEmail = userObj?.email || 'N/A';
  const displayPhone = userObj?.phone || 'Not Provided';
  const roleName =
    typeof userObj?.role === 'object' && userObj?.role !== null
      ? userObj.role.name
      : userObj?.role || 'USER';
  const isActive = userObj?.isActive !== false;
  const memberSince = userObj?.createdAt
    ? dayjs(userObj.createdAt).format('MMMM DD, YYYY')
    : dayjs().format('MMMM DD, YYYY');
  const lastUpdated = userObj?.updatedAt
    ? dayjs(userObj.updatedAt).format('MMM DD, YYYY • hh:mm A')
    : 'N/A';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <PageContainer
      title="User Profile & Security"
      subtitle="View your account details, active sessions, and security specifications"
      breadcrumbs={[{ label: 'Profile' }]}
      actions={
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={() => {
            loadProfileData();
            loadSessionsData();
            loadActivityLogsData();
          }}
        >
          Refresh Data
        </Button>
      }
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Loader size="large" />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Header Card */}
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 4,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
                  : 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
              color: '#FFFFFF',
              boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: { xs: 72, sm: 88 },
                    height: { xs: 72, sm: 88 },
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    fontSize: { xs: '1.8rem', sm: '2.2rem' },
                    fontWeight: 800,
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {initials}
                </Avatar>
              </Grid>

              <Grid item xs={12} sm>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
                  <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em">
                    {displayName}
                  </Typography>
                  <Chip
                    label={roleName}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.25)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                    }}
                  />
                  <Chip
                    icon={<CheckCircleIcon style={{ color: '#10B981', fontSize: 16 }} />}
                    label={isActive ? 'ACTIVE ACCOUNT' : 'INACTIVE'}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.2)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  {displayEmail} {displayPhone !== 'Not Provided' ? `• ${displayPhone}` : ''}
                </Typography>

                <Typography variant="caption" sx={{ opacity: 0.75, display: 'block' }}>
                  User ID: {userObj?.id || 'N/A'} • Member Since: {memberSince}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Navigation Tabs */}
          <Paper
            elevation={1}
            sx={{
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={currentTab}
                onChange={(_, val) => setCurrentTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.925rem',
                    minHeight: 48,
                  },
                }}
              >
                <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="Account Specifications" />
                <Tab icon={<DevicesIcon fontSize="small" />} iconPosition="start" label={`Active Sessions (${sessions.length})`} />
                <Tab icon={<HistoryIcon fontSize="small" />} iconPosition="start" label="Activity Audit Logs" />
                <Tab icon={<SecurityIcon fontSize="small" />} iconPosition="start" label="Security & RBAC" />
              </Tabs>
            </Box>

            {/* Tab 0: Account Specifications */}
            {currentTab === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={800}>
                  Profile Attributes & Identification
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={displayName}
                      slotProps={{ input: { readOnly: true } }}
                      variant="outlined"
                      size="small"
                      helperText="Verified identity"
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={displayEmail}
                      slotProps={{ input: { readOnly: true } }}
                      variant="outlined"
                      size="small"
                      helperText="Primary email identifier"
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={displayPhone}
                      slotProps={{ input: { readOnly: true } }}
                      variant="outlined"
                      size="small"
                      helperText="Contact phone"
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Assigned System Role"
                      value={roleName}
                      slotProps={{ input: { readOnly: true } }}
                      variant="outlined"
                      size="small"
                      helperText="Role Name (Prisma Enum)"
                      InputProps={{
                        startAdornment: <AdminPanelSettingsIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account Created Date"
                      value={memberSince}
                      slotProps={{ input: { readOnly: true } }}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Profile Update"
                      value={lastUpdated}
                      slotProps={{ input: { readOnly: true } }}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <HistoryIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>
                </Grid>

                <Alert severity="info" sx={{ borderRadius: 3, mt: 1 }}>
                  User account attributes and role permissions are managed centrally by system administrators.
                  {hasRole(['ADMIN', 'MANAGER']) && (
                    <Box sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate('/users')}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                      >
                        Manage Users Directory
                      </Button>
                    </Box>
                  )}
                </Alert>
              </Box>
            )}

            {/* Tab 1: Active Sessions */}
            {currentTab === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>
                      Active User Sessions & Connected Devices
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Real-time JWT sessions from GET /api/sessions/my-sessions
                    </Typography>
                  </Box>

                  {sessions.length > 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={handleRevokeAllSessions}
                      sx={{ textTransform: 'none', fontWeight: 700 }}
                    >
                      Revoke All Other Sessions
                    </Button>
                  )}
                </Box>

                {sessionsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Loader />
                  </Box>
                ) : sessions.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 3 }}>
                    No active sessions found for this user account.
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {sessions.map((sess, idx) => {
                      const isExpired = sess.isExpired || dayjs(sess.expiresAt).isBefore(dayjs());
                      return (
                        <Paper
                          key={sess.id || idx}
                          elevation={0}
                          sx={{
                            p: 2.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: isExpired ? 'error.light' : 'primary.light',
                                color: isExpired ? 'error.main' : 'primary.main',
                              }}
                            >
                              <DevicesIcon />
                            </Avatar>

                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" fontWeight={800}>
                                  {sess.device || sess.browser || 'Web Client'}
                                </Typography>
                                {idx === 0 && (
                                  <Chip label="Current" color="success" size="small" sx={{ fontWeight: 800, height: 20, fontSize: '0.65rem' }} />
                                )}
                              </Box>

                              <Typography variant="caption" color="text.secondary" display="block">
                                IP: {sess.ipAddress || 'Internal'} • Agent: {sess.userAgent || sess.browser || 'Browser API'}
                              </Typography>

                              <Typography variant="caption" color="text.secondary" display="block">
                                Created: {dayjs(sess.createdAt).format('MMM DD, YYYY hh:mm A')} • Expires:{' '}
                                {dayjs(sess.expiresAt).format('MMM DD, YYYY hh:mm A')}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Chip
                              label={isExpired ? 'EXPIRED' : 'ACTIVE'}
                              color={isExpired ? 'error' : 'success'}
                              variant="outlined"
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />

                            <Tooltip title="Revoke Session">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleRevokeSession(sess.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}

            {/* Tab 2: Activity History */}
            {currentTab === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={800}>
                  System Audit Trail & Recent Activity Logs
                </Typography>

                {activityLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Loader />
                  </Box>
                ) : activityLogs.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 3 }}>
                    No system activity logs registered yet.
                  </Alert>
                ) : (
                  <List disablePadding>
                    {activityLogs.slice(0, 15).map((log, idx) => (
                      <React.Fragment key={log.id || idx}>
                        <ListItem sx={{ py: 1.5, px: 1 }}>
                          <ListItemIcon>
                            <HistoryIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography variant="subtitle2" fontWeight={800}>
                                  {log.action}
                                </Typography>
                                <Chip label={log.module} size="small" variant="outlined" sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }} />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="text.secondary" component="span" display="block">
                                  {log.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" component="span" display="block">
                                  {dayjs(log.createdAt).format('MMM DD, YYYY • hh:mm A')} • IP: {log.ipAddress || 'N/A'}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {idx < activityLogs.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            )}

            {/* Tab 3: Security & RBAC Specs */}
            {currentTab === 3 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={800}>
                  Security Specifications & Token Authentication
                </Typography>

                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.neutral' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Authentication Framework
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        JWT Bearer Token (Stateless)
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Token Lifespan
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        Access Token: 24h • Refresh Token: 7 Days
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Security Enforcement
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        Helmet HTTP Headers & Rate Limiting
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        RBAC Permission Model
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        Granular Action/Resource Role Permissions
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {hasRole('ADMIN') && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<KeyIcon />}
                      onClick={() => navigate('/roles')}
                      sx={{ textTransform: 'none', fontWeight: 700 }}
                    >
                      Manage Roles & RBAC Matrix
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<AdminPanelSettingsIcon />}
                      onClick={() => navigate('/users')}
                      sx={{ textTransform: 'none', fontWeight: 700 }}
                    >
                      User Accounts Management
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      )}
    </PageContainer>
  );
};

export default UserProfilePage;
