import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Link,
  Container,
  Paper,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';

export const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = (data) => {
    setSubmitted(true);
    toast.info(`Password reset instructions sent to ${data.email}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
            : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #2563EB 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={12}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={2}>
              <Paper
                elevation={3}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RestaurantIcon fontSize="medium" />
              </Paper>
              <Typography variant="h5" fontWeight={800} color="primary">
                RestaurantOS
              </Typography>
            </Box>

            <Box textAlign="center" mb={4}>
              <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em">
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {submitted
                  ? 'Check your inbox for password recovery instructions'
                  : 'Enter your registered email address to receive reset instructions'}
              </Typography>
            </Box>

            {!submitted ? (
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoFocus
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ py: 1.5, fontSize: '1rem', fontWeight: 800, borderRadius: 3 }}
                >
                  Send Reset Link
                </Button>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setSubmitted(false)}
                sx={{ py: 1.5, fontWeight: 700, mb: 2 }}
              >
                Resend Link
              </Button>
            )}

            <Box textAlign="center" mt={3}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                fontWeight={700}
                color="primary"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8 }}
                underline="hover"
              >
                <ArrowBackIcon fontSize="small" /> Back to Sign In
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
