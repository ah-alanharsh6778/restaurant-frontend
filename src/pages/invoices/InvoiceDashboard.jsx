/**
 * InvoiceDashboard — Stats overview cards
 * All data from real backend: GET /api/invoices
 */
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  CalendarCheck,
} from 'lucide-react';
import { useInvoiceStats } from '../../hooks/useInvoices';
import { InvoiceStatSkeleton } from './InvoiceSkeleton';

const STAT_CARDS = [
  {
    key: 'total',
    label: 'Total Invoices',
    Icon: FileText,
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
    glow: 'rgba(99,102,241,0.3)',
  },
  {
    key: 'processed',
    label: 'Processed',
    Icon: CheckCircle,
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    key: 'pending',
    label: 'Pending',
    Icon: Clock,
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    glow: 'rgba(245,158,11,0.3)',
  },
  {
    key: 'failed',
    label: 'Failed',
    Icon: XCircle,
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    glow: 'rgba(239,68,68,0.3)',
  },
  {
    key: 'todayUploads',
    label: "Today's Uploads",
    Icon: CalendarCheck,
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    glow: 'rgba(6,182,212,0.3)',
  },
];

const StatCard = ({ stat, value, delay }) => {
  const { Icon, label, gradient, glow } = stat;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{ height: '100%', width: '100%' }}
    >
      <Box
        sx={{
          p: 2.5,
          height: '100%',
          minHeight: 125,
          borderRadius: '4px',
          border: '1px solid var(--border-subdued)',
          backgroundColor: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.25s ease',
          boxSizing: 'border-box',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: 'var(--primary-500)',
            boxShadow: `var(--shadow-lg), 0 0 24px ${glow}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: gradient,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography
            sx={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {label}
          </Typography>

          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '4px',
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${glow}`,
              flexShrink: 0,
            }}
          >
            <Icon size={20} color="#fff" strokeWidth={2} />
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: '1.85rem',
            fontWeight: 800,
            lineHeight: 1,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-family-sans)',
          }}
        >
          {value ?? 0}
        </Typography>
      </Box>
    </motion.div>
  );
};

const InvoiceDashboard = () => {
  const { data: stats, isLoading } = useInvoiceStats();

  if (isLoading) {
    return (
      <Grid container spacing={2.5}>
        {STAT_CARDS.map((_, i) => (
          <Grid xs={6} sm={6} md={4} lg={2.4} key={i}>
            <InvoiceStatSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {STAT_CARDS.map((stat, i) => (
        <Grid xs={6} sm={6} md={4} lg={2.4} key={stat.key}>
          <StatCard
            stat={stat}
            value={stats?.[stat.key] ?? 0}
            delay={i * 0.06}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default InvoiceDashboard;
