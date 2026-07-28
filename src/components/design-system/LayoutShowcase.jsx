import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Button,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  MdDesktopWindows,
  MdTabletMac,
  MdSmartphone,
  MdViewSidebar,
  MdViewStream,
  MdGridOn,
  MdAspectRatio,
  MdStraighten,
  MdCheckCircle,
} from 'react-icons/md';
import PageContainer from '../../layout/PageContainer';
import { ResponsiveGrid, ResponsiveGridItem } from '../../layout/ResponsiveGrid';

export const LayoutShowcase = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // > 900px

  const [simulatedDevice, setSimulatedDevice] = useState('auto');

  const getActiveDeviceLabel = () => {
    if (simulatedDevice === 'mobile') return 'Mobile Device (< 600px)';
    if (simulatedDevice === 'tablet') return 'Tablet Device (600px - 900px)';
    if (simulatedDevice === 'desktop') return 'Desktop Viewport (> 900px)';
    if (isMobile) return 'Active: Mobile Viewport (< 600px)';
    if (isTablet) return 'Active: Tablet Viewport (600px - 900px)';
    return 'Active: Desktop Viewport (> 900px)';
  };

  return (
    <PageContainer
      title="STEP 2 — Global Layout System"
      subtitle="Comprehensive Layout Specs for Desktop, Tablet, & Mobile viewports, Responsive Grid, Sidebar, Navbar, and Container Padding."
      breadcrumbs={[{ label: 'Design System', path: '/design-system' }, { label: 'Layout Grid' }]}
    >
      {/* Active Device Breakpoint Indicator */}
      <Paper
        className="glass-panel animate-fade-in"
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid var(--primary-400)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '14px',
              backgroundColor: 'var(--primary-600)',
              color: '#fff',
              boxShadow: 'var(--shadow-glow-primary)',
            }}
          >
            {isMobile ? <MdSmartphone size={28} /> : isTablet ? <MdTabletMac size={28} /> : <MdDesktopWindows size={28} />}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {getActiveDeviceLabel()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Viewport Window Width: {window.innerWidth}px | Container Padding: {isMobile ? '16px' : isTablet ? '24px' : '32px'}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip
            icon={<MdSmartphone />}
            label="Mobile"
            color={isMobile ? 'primary' : 'default'}
            variant={isMobile ? 'filled' : 'outlined'}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            icon={<MdTabletMac />}
            label="Tablet"
            color={isTablet ? 'primary' : 'default'}
            variant={isTablet ? 'filled' : 'outlined'}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            icon={<MdDesktopWindows />}
            label="Desktop"
            color={isDesktop ? 'primary' : 'default'}
            variant={isDesktop ? 'filled' : 'outlined'}
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Paper>

      {/* Layout Specifications Matrix */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight={800} mb={3}>
          1. Global Layout Specifications & Dimensions
        </Typography>

        <Grid container spacing={3}>
          {/* Sidebar Width */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: '18px', height: '100%' }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <MdViewSidebar size={24} color="var(--primary-500)" />
                <Typography variant="h6" fontWeight={800}>Sidebar Width</Typography>
              </Box>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Expanded:</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="primary">260 px</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Collapsed:</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="secondary">72 px</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Mobile Drawer:</Typography>
                  <Typography variant="subtitle2" fontWeight={800}>280 px</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Navbar Height */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: '18px', height: '100%' }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <MdViewStream size={24} color="var(--secondary-500)" />
                <Typography variant="h6" fontWeight={800}>Navbar Height</Typography>
              </Box>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Desktop (&gt;900px):</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="primary">70 px</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Mobile (&lt;900px):</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="secondary">60 px</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Backdrop Blur:</Typography>
                  <Typography variant="subtitle2" fontWeight={800}>16 px</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Container Padding */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: '18px', height: '100%' }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <MdStraighten size={24} color="var(--accent-rose)" />
                <Typography variant="h6" fontWeight={800}>Container Padding</Typography>
              </Box>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Desktop (&gt;900px):</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="primary">32 px (2rem)</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Tablet (600-900px):</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="secondary">24 px (1.5rem)</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Mobile (&lt;600px):</Typography>
                  <Typography variant="subtitle2" fontWeight={800}>16 px (1rem)</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Max Content Width */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: '18px', height: '100%' }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <MdAspectRatio size={24} color="var(--color-success)" />
                <Typography variant="h6" fontWeight={800}>Content Max Width</Typography>
              </Box>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Standard Max Cap:</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="primary">1440 px</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Fluid Full Width:</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="secondary">100%</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Grid System:</Typography>
                  <Typography variant="subtitle2" fontWeight={800}>12 Columns</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* 12-Column Responsive Grid System Demonstration */}
      <Box mb={6}>
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <MdGridOn size={26} color="var(--primary-600)" />
          <Typography variant="h5" fontWeight={800}>
            2. 12-Column Responsive Grid Playground
          </Typography>
        </Box>

        <Card sx={{ p: 4, borderRadius: '24px' }}>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Resize your browser window or inspect on Mobile/Tablet to watch the cards below reflow dynamically according to 12-column grid rules.
          </Typography>

          <ResponsiveGrid spacing={{ xs: 1.5, sm: 2, md: 3 }}>
            {/* Span 12 on mobile, 6 on tablet, 4 on desktop */}
            <ResponsiveGridItem xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: 'var(--primary-50)',
                  border: '1px solid var(--primary-300)',
                  color: 'var(--primary-900)',
                  textAlign: 'center',
                }}
              >
                <Chip label="xs:12 | sm:6 | md:4" size="small" color="primary" sx={{ fontWeight: 800, mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={800}>
                  3-Column Card (Desktop)
                </Typography>
                <Typography variant="caption">1 of 3 columns on desktop, 1 of 2 on tablet, full width on mobile.</Typography>
              </Paper>
            </ResponsiveGridItem>

            <ResponsiveGridItem xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: 'var(--secondary-50)',
                  border: '1px solid var(--secondary-300)',
                  color: 'var(--secondary-900)',
                  textAlign: 'center',
                }}
              >
                <Chip label="xs:12 | sm:6 | md:4" size="small" color="secondary" sx={{ fontWeight: 800, mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={800}>
                  3-Column Card (Desktop)
                </Typography>
                <Typography variant="caption">1 of 3 columns on desktop, 1 of 2 on tablet, full width on mobile.</Typography>
              </Paper>
            </ResponsiveGridItem>

            <ResponsiveGridItem xs={12} sm={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success)',
                  color: 'var(--color-success-dark)',
                  textAlign: 'center',
                }}
              >
                <Chip label="xs:12 | sm:12 | md:4" size="small" sx={{ fontWeight: 800, mb: 1, bgcolor: 'var(--color-success)', color: '#fff' }} />
                <Typography variant="subtitle1" fontWeight={800}>
                  3-Column Card (Desktop)
                </Typography>
                <Typography variant="caption">Full width on mobile and tablet, 1 of 3 on desktop.</Typography>
              </Paper>
            </ResponsiveGridItem>

            {/* Split 8 / 4 Layout (Main Content + Sidebar Widget) */}
            <ResponsiveGridItem xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-default)',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Chip label="xs:12 | md:8 (8 Columns)" size="small" sx={{ width: 'fit-content', fontWeight: 800, mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={800}>
                  Primary Operational Viewport (2/3 Width)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Used for Live Kitchen Orders feed, DataGrids, Analytics Charts, and Table POS maps.
                </Typography>
              </Paper>
            </ResponsiveGridItem>

            <ResponsiveGridItem xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: 'var(--glass-bg)',
                  border: '1px solid var(--border-default)',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Chip label="xs:12 | md:4 (4 Columns)" size="small" color="secondary" sx={{ width: 'fit-content', fontWeight: 800, mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={800}>
                  Secondary Action Widget (1/3 Width)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Used for Order Cart Summary, Receipt Details, Quick Actions, and Status Panels.
                </Typography>
              </Paper>
            </ResponsiveGridItem>
          </ResponsiveGrid>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default LayoutShowcase;
