/**
 * InvoiceExpensePanel — Displays the linked expense from backend
 * Data from InvoiceDTO.expense (includes supplier + category)
 */
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import {
  ReceiptText, Building2, Tag, Calendar, DollarSign,
  ArrowUpRight, Percent,
} from 'lucide-react';

const fmt = (val, currency = 'USD') => {
  if (!val && val !== 0) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(val);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const STATUS_COLORS = {
  PAID: { color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
  PENDING: { color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  OVERDUE: { color: 'var(--color-danger)', bg: 'var(--color-danger-bg)' },
};

const Row = ({ icon: Icon, label, value, mono = false }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
      py: 1.2,
      borderBottom: '1px solid var(--border-subdued)',
      '&:last-child': { borderBottom: 'none' },
    }}
  >
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: '8px',
        backgroundColor: 'rgba(99,102,241,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        mt: 0.2,
      }}
    >
      <Icon size={14} color="var(--primary-500)" strokeWidth={2} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, mb: 0.2 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: mono ? 'var(--font-family-mono)' : 'inherit',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={String(value || '')}
      >
        {value || '—'}
      </Typography>
    </Box>
  </Box>
);

const InvoiceExpensePanel = ({ expense, currency = 'USD' }) => {
  if (!expense) {
    return (
      <Box
        sx={{
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          color: 'var(--text-muted)',
        }}
      >
        <ReceiptText size={32} strokeWidth={1.5} />
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
          No linked expense
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Expense is created automatically after successful processing
        </Typography>
      </Box>
    );
  }

  const statusCfg = STATUS_COLORS[expense.status] || STATUS_COLORS.PAID;

  return (
    <Box>
      {/* Header with Expense ID */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid var(--border-subdued)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1, #4338CA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-primary)',
            }}
          >
            <ReceiptText size={18} color="#fff" strokeWidth={2} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Linked Expense
            </Typography>
            <Typography
              sx={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-family-mono)',
                mt: 0.2,
              }}
            >
              #{expense.id?.slice(0, 8)}…
            </Typography>
          </Box>
        </Box>
        <Chip
          label={expense.status || 'PAID'}
          size="small"
          sx={{
            backgroundColor: statusCfg.bg,
            color: statusCfg.color,
            fontWeight: 700,
            fontSize: '0.7rem',
            height: 22,
          }}
        />
      </Box>

      {/* Fields */}
      <Box>
        <Row icon={DollarSign} label="Amount (excl. Tax)" value={fmt(expense.amount, currency)} mono />
        <Row icon={Percent} label="Tax" value={fmt(expense.tax, currency)} mono />
        <Row icon={DollarSign} label="Total" value={fmt(expense.total, currency)} mono />
        <Row icon={Calendar} label="Invoice Date" value={formatDate(expense.invoiceDate)} />
        {expense.supplier && (
          <Row icon={Building2} label="Supplier" value={expense.supplier.name} />
        )}
        {expense.category && (
          <Row icon={Tag} label="Category" value={expense.category.name} />
        )}
        {expense.remarks && (
          <Row icon={ArrowUpRight} label="Remarks" value={expense.remarks} />
        )}
      </Box>
    </Box>
  );
};

export default InvoiceExpensePanel;
