/**
 * InvoiceDetailDrawer — Full invoice detail slide-in panel
 * Data from GET /api/invoices/:id (includes items + expense + supplier)
 */
import React, { useState } from 'react';
import {
  Drawer, Box, Typography, IconButton,
  Divider, Tabs, Tab, CircularProgress,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, FileText, List, ReceiptText, RefreshCw,
  Trash2, Calendar, Building2, Hash, Globe,
  User, Percent, DollarSign, DownloadCloud,
} from 'lucide-react';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import InvoiceItemsTable from './InvoiceItemsTable';
import InvoiceExpensePanel from './InvoiceExpensePanel';
import { useInvoiceDetail, useReprocessInvoice } from '../../hooks/useInvoices';
import { useRole } from '../../hooks/usePermission';

const fmt = (val, currency = 'USD') => {
  if (!val && val !== 0) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(val);
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const MetaRow = ({ icon: Icon, label, value, mono = false }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1, borderBottom: '1px solid var(--border-subdued)', '&:last-child': { borderBottom: 'none' } }}>
    <Box sx={{ width: 28, height: 28, borderRadius: '8px', backgroundColor: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}>
      <Icon size={13} color="var(--primary-500)" strokeWidth={2} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: mono ? 'var(--font-family-mono)' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mt: 0.2 }} title={String(value || '')}>
        {value ?? '—'}
      </Typography>
    </Box>
  </Box>
);

const TabPanel = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 2 }}>
    {value === index && children}
  </Box>
);

const InvoiceDetailDrawer = ({ invoiceId, onClose, onDelete, onReprocessed }) => {
  const [tab, setTab] = useState(0);
  const isManager = useRole(['ADMIN', 'MANAGER']);
  const { data: invoice, isLoading } = useInvoiceDetail(invoiceId);
  const { mutate: reprocess, isPending: reprocessing } = useReprocessInvoice();

  const handleReprocess = () => {
    if (!invoiceId || reprocessing) return;
    reprocess(invoiceId, { onSuccess: (data) => onReprocessed?.(data?.data) });
  };

  return (
    <Drawer
      anchor="right"
      open={!!invoiceId}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 520, md: 600 },
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-subdued)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
          color: '#fff',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FileText size={20} color="#fff" strokeWidth={2} />
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
              Invoice Detail
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isManager && invoice?.status === 'FAILED' && (
              <Tooltip title="Reprocess with OCR + AI">
                <IconButton
                  onClick={handleReprocess}
                  disabled={reprocessing}
                  size="small"
                  sx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}
                >
                  {reprocessing ? <CircularProgress size={16} color="inherit" /> : <RefreshCw size={16} />}
                </IconButton>
              </Tooltip>
            )}
            {isManager && (
              <Tooltip title="Delete Invoice">
                <IconButton
                  onClick={() => onDelete?.(invoice)}
                  size="small"
                  sx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Tooltip>
            )}
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}
            >
              <X size={18} />
            </IconButton>
          </Box>
        </Box>

        {/* Invoice summary */}
        {invoice && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-family-mono)' }}>
              #{invoice.invoiceNumber || invoice.id?.slice(0, 8)}
            </Typography>
            <InvoiceStatusBadge status={invoice.status} />
            {invoice.totalAmount > 0 && (
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', ml: 'auto' }}>
                {fmt(invoice.totalAmount, invoice.currency)}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={36} sx={{ color: 'var(--primary-500)', mb: 2 }} />
            <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Loading invoice…
            </Typography>
          </Box>
        </Box>
      )}

      {/* Content */}
      {!isLoading && invoice && (
        <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <Box sx={{ px: 3, borderBottom: '1px solid var(--border-subdued)', flexShrink: 0 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                '& .MuiTab-root': { fontSize: '0.82rem', fontWeight: 700, textTransform: 'none', minHeight: 44, color: 'var(--text-secondary)' },
                '& .Mui-selected': { color: 'var(--primary-600)' },
                '& .MuiTabs-indicator': { backgroundColor: 'var(--primary-600)', height: 3, borderRadius: '3px 3px 0 0' },
              }}
            >
              <Tab icon={<FileText size={14} />} iconPosition="start" label="Details" />
              <Tab icon={<List size={14} />} iconPosition="start" label={`Items (${invoice.items?.length || 0})`} />
              <Tab icon={<ReceiptText size={14} />} iconPosition="start" label="Expense" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 3, pb: 3 }}>
            {/* Tab 0: Details */}
            <TabPanel value={tab} index={0}>
              {/* Financials */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.03) 100%)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  mb: 2.5,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 2,
                }}
              >
                {[
                  { label: 'Subtotal', value: fmt(invoice.subtotal, invoice.currency) },
                  { label: 'Tax', value: fmt(invoice.taxAmount, invoice.currency) },
                  { label: 'Discount', value: fmt(invoice.discount, invoice.currency) },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, mb: 0.5 }}>{label}</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-family-mono)' }}>{value}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Total Highlight */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2.5,
                  boxShadow: 'var(--shadow-glow-primary)',
                }}
              >
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>Total Amount</Typography>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-family-mono)' }}>
                  {fmt(invoice.totalAmount, invoice.currency)}
                </Typography>
              </Box>

              {/* Metadata */}
              <MetaRow icon={Hash} label="Invoice Number" value={invoice.invoiceNumber} />
              <MetaRow icon={Calendar} label="Invoice Date" value={formatDate(invoice.invoiceDate)} />
              <MetaRow icon={Building2} label="Supplier" value={invoice.supplierName} />
              <MetaRow icon={Hash} label="Supplier Tax ID" value={invoice.supplierTaxId} mono />
              <MetaRow icon={User} label="Client" value={invoice.clientName} />
              <MetaRow icon={Hash} label="Client Tax ID" value={invoice.clientTaxId} mono />
              <MetaRow icon={Globe} label="Currency" value={invoice.currency} />
              <MetaRow icon={Calendar} label="Uploaded At" value={formatDate(invoice.createdAt)} />

              {/* View / Download Original File Button */}
              {invoice.filePath && (
                <Box sx={{ mt: 2.5 }}>
                  <Box
                    component="a"
                    href={invoice.filePath.startsWith('http') ? invoice.filePath : `/${invoice.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      width: '100%',
                      py: 1.5,
                      px: 2,
                      borderRadius: '12px',
                      border: '1px solid var(--border-subdued)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--primary-600)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(99,102,241,0.08)',
                        borderColor: 'var(--primary-500)',
                      },
                    }}
                  >
                    <DownloadCloud size={16} />
                    View / Download Original Invoice File
                  </Box>
                </Box>
              )}
            </TabPanel>

            {/* Tab 1: Line Items */}
            <TabPanel value={tab} index={1}>
              <InvoiceItemsTable items={invoice.items || []} currency={invoice.currency} />
            </TabPanel>

            {/* Tab 2: Expense */}
            <TabPanel value={tab} index={2}>
              <InvoiceExpensePanel expense={invoice.expense} currency={invoice.currency} />
            </TabPanel>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default InvoiceDetailDrawer;
