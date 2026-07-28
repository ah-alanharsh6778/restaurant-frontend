import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Stack,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  MdLightMode,
  MdDarkMode,
  MdAutoAwesome,
  MdCheckCircle,
  MdWarning,
  MdError,
  MdInfo,
  MdPlayArrow,
  MdRefresh,
  MdPalette,
  MdTextFields,
  MdLineWeight,
  MdRoundedCorner,
  MdAnimation,
  MdLayers
} from 'react-icons/md';
import { useColorMode } from '../../context/ThemeContext';
import { designTokens } from '../../styles/designTokens';

export const DesignSystemShowcase = () => {
  const { mode, toggleColorMode } = useColorMode();
  const isDark = mode === 'dark';
  const [animTrigger, setAnimTrigger] = useState(0);

  const colors = designTokens.colors;

  const triggerAnimations = () => {
    setAnimTrigger((prev) => prev + 1);
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 10, pt: 4, px: { xs: 2, sm: 4, md: 6 } }}>
      <Container maxWidth="xl">
        {/* Header Banner */}
        <Paper
          className="glass-panel animate-slide-up"
          sx={{
            p: { xs: 3, md: 5 },
            mb: 6,
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden',
            background: isDark
              ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(99, 102, 241, 0.15) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(99, 102, 241, 0.08) 100%)',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={3}>
            <Box>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <Chip
                  icon={<MdAutoAwesome color="#6366F1" />}
                  label="STEP 1 — DESIGN SYSTEM SPECIFICATION"
                  size="small"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                    color: '#6366F1',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, tracking: '-0.03em' }}>
                Restaurant<span className="gradient-text-primary">OS</span> Design System
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 640 }}>
                Original high-performance luxury design system tokenized for scale. Supports dual-mode theme engine, glassmorphism, fluid typography, spring transitions, and custom shadow glows.
              </Typography>
            </Box>

            {/* Theme Toggle Widget */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '16px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <MdLightMode color={!isDark ? '#F59E0B' : '#9CA3AF'} size={20} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {mode.toUpperCase()} MODE
                </Typography>
                <MdDarkMode color={isDark ? '#6366F1' : '#9CA3AF'} size={20} />
              </Box>
              <Switch checked={isDark} onChange={toggleColorMode} color="primary" />
            </Paper>
          </Box>
        </Paper>

        {/* Section 1: Color Palette */}
        <Box mb={8}>
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <MdPalette size={26} color="#6366F1" />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              1. Color Palette
            </Typography>
          </Box>

          {/* Primary & Secondary */}
          <Grid container spacing={3} mb={4}>
            {/* Primary Swatches */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: '20px' }}>
                <Typography variant="h6" fontWeight={800} mb={0.5}>
                  Primary Palette (Electric Indigo)
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                  Used for primary brand actions, CTA buttons, active states & primary accents.
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(colors.primary).map(([step, hex]) => {
                    if (step === 'contrastText') return null;
                    return (
                      <Grid item xs={2.4} key={`primary-${step}`}>
                        <Tooltip title={`Primary ${step}: ${hex}`} arrow>
                          <Box
                            sx={{
                              height: 64,
                              borderRadius: '10px',
                              backgroundColor: hex,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-end',
                              p: 1,
                              color: parseInt(step) >= 500 ? '#fff' : '#0f172a',
                              transition: 'transform 0.2s ease',
                              '&:hover': { transform: 'scale(1.08)', zIndex: 2 }
                            }}
                          >
                            <Typography variant="caption" fontWeight={800} fontSize="0.7rem">
                              {step}
                            </Typography>
                            <Typography variant="caption" fontSize="0.65rem" opacity={0.85}>
                              {hex}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>
              </Card>
            </Grid>

            {/* Secondary Swatches */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: '20px' }}>
                <Typography variant="h6" fontWeight={800} mb={0.5}>
                  Secondary Palette (Cyan Tech)
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                  Operational POS counters, kitchen status feeds, order progression tags.
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(colors.secondary).map(([step, hex]) => {
                    if (step === 'contrastText') return null;
                    return (
                      <Grid item xs={2.4} key={`secondary-${step}`}>
                        <Tooltip title={`Secondary ${step}: ${hex}`} arrow>
                          <Box
                            sx={{
                              height: 64,
                              borderRadius: '10px',
                              backgroundColor: hex,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-end',
                              p: 1,
                              color: parseInt(step) >= 500 ? '#fff' : '#0f172a',
                              transition: 'transform 0.2s ease',
                              '&:hover': { transform: 'scale(1.08)', zIndex: 2 }
                            }}
                          >
                            <Typography variant="caption" fontWeight={800} fontSize="0.7rem">
                              {step}
                            </Typography>
                            <Typography variant="caption" fontSize="0.65rem" opacity={0.85}>
                              {hex}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>
              </Card>
            </Grid>
          </Grid>

          {/* Accent & Status Palette */}
          <Grid container spacing={3}>
            {/* Accent Coral & Amber */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: '20px' }}>
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Accent Palette (Rose Coral & Amber Flame)
                </Typography>
                <Stack spacing={2}>
                  <Box display="flex" gap={1.5}>
                    {Object.entries(colors.accent.rose).map(([step, hex]) => (
                      <Box
                        key={`rose-${step}`}
                        flex={1}
                        sx={{
                          height: 54,
                          borderRadius: '10px',
                          backgroundColor: hex,
                          color: '#fff',
                          p: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end'
                        }}
                      >
                        <Typography variant="caption" fontWeight={800}>Rose {step}</Typography>
                        <Typography variant="caption" fontSize="0.65rem">{hex}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box display="flex" gap={1.5}>
                    {Object.entries(colors.accent.amber).map(([step, hex]) => (
                      <Box
                        key={`amber-${step}`}
                        flex={1}
                        sx={{
                          height: 54,
                          borderRadius: '10px',
                          backgroundColor: hex,
                          color: '#fff',
                          p: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end'
                        }}
                      >
                        <Typography variant="caption" fontWeight={800}>Amber {step}</Typography>
                        <Typography variant="caption" fontSize="0.65rem">{hex}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Stack>
              </Card>
            </Grid>

            {/* Status Colors */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: '20px' }}>
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Status Colors (Success, Warning, Danger, Info)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        backgroundColor: 'var(--color-success-bg)',
                        border: '1px solid var(--color-success)',
                        textAlign: 'center'
                      }}
                    >
                      <MdCheckCircle color="var(--color-success)" size={24} />
                      <Typography variant="subtitle2" fontWeight={800} color="var(--color-success)">
                        Success
                      </Typography>
                      <Typography variant="caption" color="text.secondary">#10B981</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        backgroundColor: 'var(--color-warning-bg)',
                        border: '1px solid var(--color-warning)',
                        textAlign: 'center'
                      }}
                    >
                      <MdWarning color="var(--color-warning)" size={24} />
                      <Typography variant="subtitle2" fontWeight={800} color="var(--color-warning)">
                        Warning
                      </Typography>
                      <Typography variant="caption" color="text.secondary">#F59E0B</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        backgroundColor: 'var(--color-danger-bg)',
                        border: '1px solid var(--color-danger)',
                        textAlign: 'center'
                      }}
                    >
                      <MdError color="var(--color-danger)" size={24} />
                      <Typography variant="subtitle2" fontWeight={800} color="var(--color-danger)">
                        Danger
                      </Typography>
                      <Typography variant="caption" color="text.secondary">#EF4444</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        backgroundColor: 'var(--color-info-bg)',
                        border: '1px solid var(--color-info)',
                        textAlign: 'center'
                      }}
                    >
                      <MdInfo color="var(--color-info)" size={24} />
                      <Typography variant="subtitle2" fontWeight={800} color="var(--color-info)">
                        Info
                      </Typography>
                      <Typography variant="caption" color="text.secondary">#3B82F6</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Section 2: Glassmorphism & Background Layers */}
        <Box mb={8}>
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <MdLayers size={26} color="#06B6D4" />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              2. Backgrounds & Glassmorphism System
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box className="glass-panel" sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={800} mb={1}>
                  Standard Glass Panel
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Uses <code style={{ color: '#6366F1' }}>backdrop-filter: blur(16px)</code> with ultra-clean border transparency.
                </Typography>
                <Button variant="contained" color="primary">
                  Glass Action
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box className="glass-card" sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={800} mb={1}>
                  Hover Glass Card
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Lifts smoothly on hover with a high-end ambient primary glow.
                </Typography>
                <Chip label="Hover over me" color="secondary" size="small" sx={{ fontWeight: 700 }} />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%)',
                  color: '#fff',
                  boxShadow: 'var(--shadow-glow-primary)',
                }}
              >
                <Typography variant="h6" fontWeight={800} mb={1}>
                  Vibrant Mesh Gradient
                </Typography>
                <Typography variant="body2" opacity={0.9} mb={3}>
                  Used for hero widgets, high-value POS statistics, and VIP callouts.
                </Typography>
                <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }}>
                  Explore Feature
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Section 3: Typography System */}
        <Box mb={8}>
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <MdTextFields size={26} color="#EC4899" />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              3. Typography Hierarchy
            </Typography>
          </Box>

          <Card sx={{ p: 4, borderRadius: '20px' }}>
            <Stack spacing={2.5} divider={<Divider />}>
              <Box display="flex" alignItems="baseline" flexWrap="wrap" gap={3}>
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontWeight: 700 }}>
                  Display (44px / 800)
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '2.75rem', letterSpacing: '-0.03em' }}>
                  Restaurant Operating System
                </Typography>
              </Box>

              <Box display="flex" alignItems="baseline" flexWrap="wrap" gap={3}>
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontWeight: 700 }}>
                  Heading 1 (36px / 800)
                </Typography>
                <Typography variant="h1">
                  POS & Inventory Analytics
                </Typography>
              </Box>

              <Box display="flex" alignItems="baseline" flexWrap="wrap" gap={3}>
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontWeight: 700 }}>
                  Heading 2 (28px / 700)
                </Typography>
                <Typography variant="h2">
                  Kitchen Execution & Order Feeds
                </Typography>
              </Box>

              <Box display="flex" alignItems="baseline" flexWrap="wrap" gap={3}>
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontWeight: 700 }}>
                  Heading 3 (22px / 700)
                </Typography>
                <Typography variant="h3">
                  Supplier Purchase Orders & Receipts
                </Typography>
              </Box>

              <Box display="flex" alignItems="baseline" flexWrap="wrap" gap={3}>
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontWeight: 700 }}>
                  Body Large (18px / 400)
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.125rem' }}>
                  Manage tables, guest reservations, and automatic billing in real-time.
                </Typography>
              </Box>

              <Box display="flex" alignItems="baseline" flexWrap="wrap" gap={3}>
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontWeight: 700 }}>
                  Body Medium (15px / 400)
                </Typography>
                <Typography variant="body2">
                  Standard body copy for tables, forms, inputs, and modal dialogs.
                </Typography>
              </Box>

              <Box display="flex" alignItems="baseline" flexWrap="wrap" gap={3}>
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontWeight: 700 }}>
                  Monospace Code
                </Typography>
                <code>const orderTotal = calculateTax(items, 0.18);</code>
              </Box>
            </Stack>
          </Card>
        </Box>

        {/* Section 4: Radius, Spacing & Shadows */}
        <Box mb={8}>
          <Grid container spacing={4}>
            {/* Radius System */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <MdRoundedCorner size={26} color="#F59E0B" />
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  4. Border Radius System
                </Typography>
              </Box>
              <Card sx={{ p: 3, borderRadius: '20px' }}>
                <Grid container spacing={2}>
                  {[
                    { label: 'SM (6px)', radius: 'var(--radius-sm)' },
                    { label: 'MD (10px)', radius: 'var(--radius-md)' },
                    { label: 'LG (14px)', radius: 'var(--radius-lg)' },
                    { label: 'XL (20px)', radius: 'var(--radius-xl)' },
                    { label: '2XL (28px)', radius: 'var(--radius-2xl)' },
                    { label: 'FULL (9999px)', radius: 'var(--radius-full)' }
                  ].map((item) => (
                    <Grid item xs={6} key={item.label}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: item.radius,
                          border: '2px dashed var(--primary-500)',
                          background: 'var(--bg-subtle)',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={800}>
                          {item.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>

            {/* Shadow & Glow System */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <MdAutoAwesome size={26} color="#10B981" />
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  5. Shadows & Ambient Glows
                </Typography>
              </Box>
              <Card sx={{ p: 3, borderRadius: '20px' }}>
                <Grid container spacing={2}>
                  {[
                    { label: 'Shadow MD', shadow: 'var(--shadow-md)' },
                    { label: 'Shadow LG', shadow: 'var(--shadow-lg)' },
                    { label: 'Primary Glow', shadow: 'var(--shadow-glow-primary)', bg: 'var(--primary-600)', color: '#fff' },
                    { label: 'Accent Glow', shadow: 'var(--shadow-glow-accent)', bg: 'var(--accent-rose)', color: '#fff' },
                    { label: 'Success Glow', shadow: 'var(--shadow-glow-success)', bg: 'var(--color-success)', color: '#fff' },
                    { label: 'Danger Glow', shadow: 'var(--shadow-glow-danger)', bg: 'var(--color-danger)', color: '#fff' }
                  ].map((item) => (
                    <Grid item xs={6} key={item.label}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          boxShadow: item.shadow,
                          backgroundColor: item.bg || 'var(--bg-surface)',
                          color: item.color || 'var(--text-primary)',
                          textAlign: 'center',
                          fontWeight: 700
                        }}
                      >
                        {item.label}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Section 6: Animation Playground */}
        <Box mb={6}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <MdAnimation size={26} color="#6366F1" />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                6. Micro-Animation System
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<MdRefresh />}
              onClick={triggerAnimations}
              sx={{ borderRadius: '12px' }}
            >
              Re-trigger Animations
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                key={`anim-fade-${animTrigger}`}
                className="animate-fade-in"
                sx={{ p: 3, borderRadius: '16px', textAlign: 'center', background: 'var(--bg-surface)' }}
              >
                <Typography variant="h6" fontWeight={800} color="primary" mb={1}>
                  Fade In
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Smooth 250ms opacity transition
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                key={`anim-up-${animTrigger}`}
                className="animate-slide-up"
                sx={{ p: 3, borderRadius: '16px', textAlign: 'center', background: 'var(--bg-surface)' }}
              >
                <Typography variant="h6" fontWeight={800} color="secondary" mb={1}>
                  Slide Up Spring
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cubic-bezier spring physics
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                key={`anim-scale-${animTrigger}`}
                className="animate-scale-in"
                sx={{ p: 3, borderRadius: '16px', textAlign: 'center', background: 'var(--bg-surface)' }}
              >
                <Typography variant="h6" fontWeight={800} color="var(--accent-rose)" mb={1}>
                  Scale In
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Modal & popover entrance
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                className="animate-pulse-glow"
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  textAlign: 'center',
                  background: 'var(--primary-600)',
                  color: '#fff',
                  boxShadow: 'var(--shadow-glow-primary)'
                }}
              >
                <Typography variant="h6" fontWeight={800} mb={1}>
                  Pulse Glow
                </Typography>
                <Typography variant="caption" opacity={0.9}>
                  Live kitchen order notification
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default DesignSystemShowcase;
