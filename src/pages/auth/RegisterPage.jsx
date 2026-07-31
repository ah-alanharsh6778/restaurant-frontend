import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Typography,
  IconButton,
  Alert,
  Paper,
  Container,
  Grid,
} from '@mui/material';
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdRestaurant,
  MdArrowForward,
  MdCheckCircle,
} from 'react-icons/md';

import { useAuth } from '../../hooks/useAuth';
import { useColorMode } from '../../context/ThemeContext';
import { registerSchema } from '../../utils/auth.validation';
import { Button, Input, Select } from '../../components/ui';

// Roles available for public self-registration (ADMIN, MANAGER & INVENTORY MANAGER excluded)
const PUBLIC_REGISTRATION_ROLES = [
  { label: 'Dining Waiter (WAITER)', value: 'WAITER' },
  { label: 'Executive Chef (CHEF)', value: 'CHEF' },
  { label: 'General Staff (STAFF)', value: 'STAFF' },
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      roleId: 'WAITER', // Default: Dining Waiter
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setBackendError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        roleId: data.roleId,
        phone: data.phone || null,
      };

      const res = await registerAuth(payload);

      if (res?.success) {
        setSuccessMessage('Account registered successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } else {
        setBackendError(res?.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to register account. Please check inputs.';
      setBackendError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
        px: { xs: 2, sm: 3 },
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 10% 90%, rgba(6, 182, 212, 0.15) 0%, transparent 40%), var(--bg-canvas)'
          : 'radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 10% 90%, rgba(6, 182, 212, 0.08) 0%, transparent 40%), var(--bg-canvas)',
      }}
    >
      <Container maxWidth="sm" disableGutters>
        <Paper
          elevation={0}
          className="animate-scale-in"
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: '4px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subdued)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '4px',
                backgroundColor: 'var(--primary-600)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow-primary)',
                mb: 1.5,
              }}
            >
              <MdRestaurant size={30} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Register Restaurant<span className="gradient-text-primary">OS</span> Account
            </Typography>
            <Typography variant="body2" color="var(--text-secondary)" sx={{ mt: 0.5 }}>
              Create a new user profile to access order service & staff features
            </Typography>
          </Box>

          {/* Feedback Banners */}
          {backendError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '4px',
                backgroundColor: 'var(--color-danger-bg)',
                color: 'var(--color-danger)',
                border: '1px solid var(--color-danger)',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              {backendError}
            </Alert>
          )}

          {successMessage && (
            <Alert
              severity="success"
              icon={<MdCheckCircle size={20} />}
              sx={{
                mb: 3,
                borderRadius: '4px',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                border: '1px solid var(--color-success)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {successMessage}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  startIcon={<MdPerson size={20} />}
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName?.message}
                  {...register('fullName')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Input
                  label="Email Address"
                  placeholder="john@restaurant.com"
                  type="email"
                  startIcon={<MdEmail size={20} />}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  {...register('email')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Input
                  label="Phone Number (Optional)"
                  placeholder="+1-555-0199"
                  startIcon={<MdPhone size={20} />}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                  {...register('phone')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="roleId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Assign Staff Role"
                      value={field.value}
                      onChange={field.onChange}
                      options={PUBLIC_REGISTRATION_ROLES}
                      error={Boolean(errors.roleId)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Input
                  label="Password"
                  placeholder="Min 6 characters"
                  type={showPassword ? 'text' : 'password'}
                  startIcon={<MdLock size={20} />}
                  endIcon={
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'var(--text-secondary)', borderRadius: '4px' }}
                    >
                      {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </IconButton>
                  }
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  {...register('password')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Input
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  startIcon={<MdLock size={20} />}
                  endIcon={
                    <IconButton
                      size="small"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: 'var(--text-secondary)', borderRadius: '4px' }}
                    >
                      {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </IconButton>
                  }
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </Grid>
            </Grid>

            <Box mt={3.5}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                loading={isSubmitting}
                glow
                endIcon={<MdArrowForward />}
                sx={{ py: '12px', borderRadius: '4px', fontSize: '0.95rem' }}
              >
                Create Account in RestaurantOS
              </Button>
            </Box>
          </form>

          {/* Footer Navigation */}
          <Box sx={{ textAlign: 'center', mt: 3.5, pt: 2.5, borderTop: '1px solid var(--border-subdued)' }}>
            <Typography variant="body2" color="var(--text-secondary)">
              Already registered?{' '}
              <Typography
                component={Link}
                to="/login"
                sx={{
                  color: 'var(--primary-500)',
                  fontWeight: 800,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign in to your account
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
