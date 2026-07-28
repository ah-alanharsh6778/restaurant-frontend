/**
 * InvoiceStatusBadge — Reusable status chip
 * Status values from backend: UPLOADED | PROCESSING | PROCESSED | FAILED
 */
import React from 'react';
import { Chip } from '@mui/material';
import {
  CheckCircle,
  Clock,
  XCircle,
  Upload,
} from 'lucide-react';

const STATUS_CONFIG = {
  PROCESSED: {
    label: 'Processed',
    color: 'var(--color-success)',
    bg: 'var(--color-success-bg)',
    border: 'rgba(16,185,129,0.25)',
    Icon: CheckCircle,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'var(--color-info)',
    bg: 'var(--color-info-bg)',
    border: 'rgba(59,130,246,0.25)',
    Icon: Clock,
  },
  UPLOADED: {
    label: 'Uploaded',
    color: 'var(--text-secondary)',
    bg: 'var(--bg-subtle)',
    border: 'var(--border-subdued)',
    Icon: Upload,
  },
  FAILED: {
    label: 'Failed',
    color: 'var(--color-danger)',
    bg: 'var(--color-danger-bg)',
    border: 'rgba(239,68,68,0.25)',
    Icon: XCircle,
  },
};

const InvoiceStatusBadge = ({ status, size = 'small' }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.UPLOADED;
  const { Icon } = cfg;

  return (
    <Chip
      size={size}
      label={cfg.label}
      icon={<Icon size={12} strokeWidth={2.5} />}
      sx={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.7rem' : '0.78rem',
        letterSpacing: 0.3,
        height: size === 'small' ? 24 : 28,
        '& .MuiChip-icon': {
          color: cfg.color,
          marginLeft: '6px',
        },
        '& .MuiChip-label': {
          paddingLeft: '4px',
        },
      }}
    />
  );
};

export default InvoiceStatusBadge;
