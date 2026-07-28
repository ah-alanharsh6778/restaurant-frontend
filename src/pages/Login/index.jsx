import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
  Grid,
  Link as MuiLink,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  RestaurantMenu as RestaurantMenuIcon,
  CheckCircle as CheckIcon,
  LockOutlined as LockIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'harsh@gmail.com',
      password: 'Password@123',
      rememberMe: true,
    },
  });

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      toast.success('Welcome back to RestaurantOS!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your registered email address');
      return;
    }
    toast.success(`Password reset instructions sent to ${forgotEmail}`);
    setForgotOpen(false);
    setForgotEmail('');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', backgroundColor: '#090D16', overflow: 'hidden' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Left Side: Enterprise Showcase Hero (Desktop & Laptop) */}
        <Grid
          xs={12}
          md={6}
          lg={7}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: { md: 6, lg: 8 },
            background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.25) 0%, rgba(9, 13, 22, 1) 90%)',
            position: 'relative',
          }}
        >
          {/* Top Brand Header */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              }}
            >
              <RestaurantMenuIcon fontSize="medium" />
            </Box>
            <Typography variant="h5" color="#FFFFFF" fontWeight={800} letterSpacing="-0.02em">
              RestaurantOS
            </Typography>
            <Chip label="ENTERPRISE 3.0" size="small" color="primary" sx={{ ml: 1, fontWeight: 800, fontSize: '0.65rem' }} />
          </Box>

          {/* Center Value Proposition & Live Cards */}
          <Box sx={{ my: 'auto', maxWidth: 560 }}>
            <Typography variant="h3" color="#FFFFFF" fontWeight={800} gutterBottom sx={{ lineHeight: 1.15 }}>
              The Operating System for Modern Restaurants.
            </Typography>
            <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 4, lineHeight: 1.6 }}>
              Streamline POS ticketing, table occupancy, inventory stock-out tracking, supplier purchase orders, and financial profit analytics in one unified dashboard.
            </Typography>

            {/* Glowing Metric Cards Preview */}
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <TrendingUpIcon sx={{ color: '#10B981', fontSize: 20 }} />
                    <Typography variant="caption" color="rgba(255, 255, 255, 0.6)" fontWeight={700}>
                      REAL-TIME REVENUE
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={800}>
                    $128,450.00
                  </Typography>
                  <Typography variant="caption" color="#10B981" fontWeight={700}>
                    +18.4% this month
                  </Typography>
                </Paper>
              </Grid>

              <Grid xs={6}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <SpeedIcon sx={{ color: '#6366F1', fontSize: 20 }} />
                    <Typography variant="caption" color="rgba(255, 255, 255, 0.6)" fontWeight={700}>
                      AVG TICKET SPEED
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={800}>
                    12.4 Mins
                  </Typography>
                  <Typography variant="caption" color="#6366F1" fontWeight={700}>
                    Optimal Kitchen Flow
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Bottom Footer Credits */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box display="flex" alignItems="center" gap={0.8}>
              <SecurityIcon sx={{ color: '#10B981', fontSize: 18 }} />
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                SOC2 Type II Certified
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.8}>
              <CheckIcon sx={{ color: '#6366F1', fontSize: 18 }} />
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                99.99% SLA Uptime
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right Side: Split Glassmorphism Login Form */}
        <Grid
          xs={12}
          md={6}
          lg={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2.5, sm: 4, md: 6 },
            backgroundColor: '#0F172A',
          }}
        >
          <Container maxWidth="xs" disableGutters>
            <Box sx={{ mb: 4, display: { xs: 'block', md: 'none' }, textAlign: 'center' }}>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                  <RestaurantMenuIcon />
                </Avatar>
                <Typography variant="h5" fontWeight={800} color="#FFFFFF">
                  RestaurantOS
                </Typography>
              </Box>
            </Box>

            <Card
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 4,
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              }}
            >
              <Box mb={3.5}>
                <Typography variant="h4" fontWeight={800} color="#FFFFFF" gutterBottom>
                  Sign in
                </Typography>
                <Typography variant="body2" color="#94A3B8">
                  Enter your executive credentials to access the POS & SaaS control center.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Box mb={2.5}>
                  <Typography variant="caption" fontWeight={700} color="#94A3B8" sx={{ mb: 1, display: 'block' }}>
                    WORK EMAIL
                  </Typography>
                  <TextField
                    fullWidth
                    id="email"
                    placeholder="name@restaurant.com"
                    autoComplete="email"
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        color: '#FFFFFF',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&:hover fieldset': { borderColor: '#6366F1' },
                      },
                    }}
                    {...register('email', {
                      required: 'Work email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address format',
                      },
                    })}
                  />
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption" fontWeight={700} color="#94A3B8">
                      PASSWORD
                    </Typography>
                    <MuiLink
                      component="button"
                      type="button"
                      variant="caption"
                      color="primary.light"
                      fontWeight={700}
                      underline="hover"
                      onClick={() => setForgotOpen(true)}
                    >
                      Forgot password?
                    </MuiLink>
                  </Box>
                  <TextField
                    fullWidth
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              sx={{ color: '#94A3B8' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        color: '#FFFFFF',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&:hover fieldset': { borderColor: '#6366F1' },
                      },
                    }}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                </Box>

                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register('rememberMe')}
                        defaultChecked
                        sx={{
                          color: '#94A3B8',
                          '&.Mui-checked': { color: '#6366F1' },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" color="#94A3B8">
                        Remember this session
                      </Typography>
                    }
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2.5,
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in to Dashboard'}
                </Button>
              </Box>
            </Card>
          </Container>
        </Grid>
      </Grid>

      {/* Forgot Password Modal */}
      <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Reset Account Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your account email address and we'll send you password recovery instructions.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="forgot-email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setForgotOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleForgotSubmit} variant="contained">
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
