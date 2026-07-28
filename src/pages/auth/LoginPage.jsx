import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Paper,
  Container,
} from '@mui/material';
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdRestaurant,
  MdArrowForward,
  MdAutoAwesome,
} from 'react-icons/md';

import { useAuth } from '../../hooks/useAuth';
import { useColorMode } from '../../context/ThemeContext';
import { loginSchema } from '../../utils/auth.validation';
import { Button, Input } from '../../components/ui';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const isDark = mode === 'dark';

  const [showPassword, setShowPassword] = useState(false);
  const [backendError, setBackendError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@restaurant.com',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setBackendError('');
    setIsSubmitting(true);

    try {
      await login(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login Error:', err);
      const msg = err?.message || err?.originalError?.response?.data?.message || 'Invalid email or password';
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
          ? 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 40%), var(--bg-canvas)'
          : 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 40%), var(--bg-canvas)',
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Paper
          elevation={0}
          className="glass-panel animate-scale-in"
          sx={{
            p: { xs: 3.5, sm: 4.5 },
            borderRadius: '24px',
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          {/* Brand Logo Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '16px',
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
              Welcome to Restaurant<span className="gradient-text-primary">OS</span>
            </Typography>
            <Typography variant="body2" color="var(--text-secondary)" sx={{ mt: 0.5 }}>
              Sign in to manage POS orders, inventory & analytics
            </Typography>
          </Box>

          {/* Backend Error Alert Banner */}
          {backendError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '12px',
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box mb={2.5}>
              <Input
                label="Email Address"
                placeholder="name@restaurant.com"
                type="email"
                startIcon={<MdEmail size={20} />}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register('email')}
              />
            </Box>

            <Box mb={3}>
              <Input
                label="Password"
                placeholder="Enter password"
                type={showPassword ? 'text' : 'password'}
                startIcon={<MdLock size={20} />}
                endIcon={
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'var(--text-secondary)' }}
                  >
                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </IconButton>
                }
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register('password')}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              loading={isSubmitting}
              glow
              endIcon={<MdArrowForward />}
              sx={{ py: '12px', borderRadius: '14px', fontSize: '0.95rem' }}
            >
              Sign In to RestaurantOS
            </Button>
          </form>

          {/* Footer Navigation */}
          <Box sx={{ textAlign: 'center', mt: 3.5, pt: 2.5, borderTop: '1px solid var(--border-subdued)' }}>
            <Typography variant="body2" color="var(--text-secondary)">
              Don't have an account yet?{' '}
              <Typography
                component={Link}
                to="/register"
                sx={{
                  color: 'var(--primary-500)',
                  fontWeight: 800,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Register Staff Account
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
