/**
 * InvoiceList — Searchable, filterable, paginated invoice table & mobile card view
 * GET /api/invoices?status&search&page&limit
 */
import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Typography, TextField, InputAdornment,
  Select, MenuItem, FormControl, Pagination,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip,
  Alert, Card, CardContent, Chip, Button,
  useTheme, useMediaQuery, Stack,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Trash2, RefreshCw, FileText, SlidersHorizontal, Calendar, Layers, Store } from 'lucide-react';
import { useInvoiceList } from '../../hooks/useInvoices';
import { useRole } from '../../hooks/usePermission';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { InvoiceTableSkeleton } from './InvoiceSkeleton';

// Native debounce hook — no extra dependency
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return [debounced];
};

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Status' },
  { value: 'PROCESSED', label: 'Processed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'UPLOADED', label: 'Uploaded' },
  { value: 'FAILED', label: 'Failed' },
];

const PAGE_SIZE = 10;

const fmt = (val, currency = 'USD') => {
  if (!val && val !== 0) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(val);
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const EmptyState = ({ search, status }) => (
  <Box
    sx={{
      py: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      color: 'var(--text-muted)',
    }}
  >
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: '18px',
        backgroundColor: 'var(--bg-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FileText size={28} strokeWidth={1.5} />
    </Box>
    <Box sx={{ textAlign: 'center' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', mb: 0.5 }}>
        {search || status !== 'ALL' ? 'No invoices found' : 'No invoices yet'}
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        {search || status !== 'ALL'
          ? 'Try adjusting your search or filter.'
          : 'Upload your first invoice to get started.'}
      </Typography>
    </Box>
  </Box>
);

const InvoiceList = ({ onView, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 350);
  const isManager = useRole(['ADMIN', 'MANAGER']);

  const filters = {
    page,
    limit: PAGE_SIZE,
    status: status !== 'ALL' ? status : undefined,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading, isError, error, refetch } = useInvoiceList(filters);
  const invoices = data?.invoices || [];
  const pagination = data?.pagination;

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mb: 2.5,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <TextField
          size="small"
          placeholder="Search by invoice #, supplier, or client…"
          value={search}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={15} color="var(--text-muted)" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              fontSize: '0.85rem',
              '& fieldset': { border: '1px solid var(--border-subdued)' },
              '&:hover fieldset': { borderColor: 'var(--primary-500)' },
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl size="small" sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 150 } }}>
            <Select
              value={status}
              onChange={handleStatusChange}
              startAdornment={<SlidersHorizontal size={14} color="var(--text-muted)" style={{ marginRight: 4 }} />}
              sx={{
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '0.85rem',
                '& fieldset': { border: '1px solid var(--border-subdued)' },
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.85rem' }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Refresh">
            <IconButton
              onClick={() => refetch()}
              size="small"
              sx={{
                borderRadius: '10px',
                border: '1px solid var(--border-subdued)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                flexShrink: 0,
                '&:hover': { color: 'var(--primary-500)', borderColor: 'var(--primary-500)' },
              }}
            >
              <RefreshCw size={15} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
          {error?.message || 'Failed to load invoices. Please try again.'}
        </Alert>
      )}

      {/* Main Container: Mobile Card Layout vs Desktop Table View */}
      {isLoading ? (
        <InvoiceTableSkeleton rows={PAGE_SIZE} />
      ) : invoices.length === 0 ? (
        <EmptyState search={debouncedSearch} status={status} />
      ) : isMobile ? (
        /* Modern Mobile Card View */
        <Stack spacing={2}>
          <AnimatePresence>
            {invoices.map((invoice, idx) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '16px',
                    border: '1px solid var(--border-subdued)',
                    backgroundColor: 'var(--bg-surface)',
                    p: 2,
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                    '&:hover': {
                      boxShadow: 'var(--shadow-md)',
                      borderColor: 'var(--primary-400)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    {/* Header: Invoice # & Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FileText size={15} color="#fff" strokeWidth={2} />
                        </Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-family-mono)' }}>
                          {invoice.invoiceNumber || `…${invoice.id?.slice(-6)}`}
                        </Typography>
                      </Box>
                      <InvoiceStatusBadge status={invoice.status} />
                    </Box>

                    {/* Content Details: Supplier & Date */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 2, bgcolor: 'var(--bg-subtle)', p: 1.5, borderRadius: '12px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Store size={14} color="var(--text-muted)" />
                          <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Supplier:</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {invoice.supplierName || '—'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Calendar size={14} color="var(--text-muted)" />
                          <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Date:</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {formatDate(invoice.invoiceDate || invoice.createdAt)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Layers size={14} color="var(--text-muted)" />
                          <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Items:</Typography>
                        </Box>
                        <Chip
                          label={`${invoice.items?.length ?? 0} items`}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'var(--bg-canvas)' }}
                        />
                      </Box>
                    </Box>

                    {/* Footer: Amount & Action Buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 0.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                          Total Amount
                        </Typography>
                        <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-600)', fontFamily: 'var(--font-family-mono)' }}>
                          {fmt(invoice.totalAmount, invoice.currency)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {isManager && onDelete && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(invoice);
                            }}
                            sx={{
                              color: 'var(--color-danger)',
                              borderRadius: '8px',
                              border: '1px solid var(--border-subdued)',
                              '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        )}
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Eye size={14} />}
                          onClick={() => onView?.(invoice)}
                          sx={{
                            borderRadius: '10px',
                            fontWeight: 700,
                            textTransform: 'none',
                            px: 2,
                            fontSize: '0.8rem',
                          }}
                        >
                          Details
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Stack>
      ) : (
        /* Desktop Table View */
        <Box
          sx={{
            borderRadius: '16px',
            border: '1px solid var(--border-subdued)',
            backgroundColor: 'var(--bg-surface)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: 'var(--bg-subtle)',
                    '& th': {
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: 0.6,
                      border: 'none',
                      borderBottom: '1px solid var(--border-subdued)',
                      py: 1.8,
                      whiteSpace: 'nowrap',
                    },
                  }}
                >
                  <TableCell align="center" sx={{ width: 60 }}>S.No.</TableCell>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {invoices.map((invoice, idx) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      style={{ display: 'table-row', cursor: 'pointer' }}
                      onClick={() => onView?.(invoice)}
                    >
                      <TableCell align="center" sx={{ borderBottom: '1px solid var(--border-subdued)' }}>
                        <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid var(--border-subdued)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <FileText size={13} color="#fff" strokeWidth={2} />
                          </Box>
                          <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-family-mono)' }}>
                            {invoice.invoiceNumber || `…${invoice.id?.slice(-6)}`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid var(--border-subdued)' }}>
                        <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {invoice.supplierName || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid var(--border-subdued)', whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {formatDate(invoice.invoiceDate || invoice.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid var(--border-subdued)' }}>
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary-600)', fontFamily: 'var(--font-family-mono)' }}>
                          {fmt(invoice.totalAmount, invoice.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid var(--border-subdued)' }}>
                        <InvoiceStatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid var(--border-subdued)' }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {invoice.items?.length ?? 0}
                        </Typography>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Pagination */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            mt: 2,
            borderRadius: '12px',
            border: '1px solid var(--border-subdued)',
            backgroundColor: 'var(--bg-subtle)',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, pagination.total)} of {pagination.total} invoices
          </Typography>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '8px',
                fontSize: '0.8rem',
                '&.Mui-selected': {
                  backgroundColor: 'var(--primary-600)',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'var(--primary-700)' },
                },
              },
            }}
          />
        </Box>
      )}

      {/* Result count */}
      {!isLoading && invoices.length > 0 && (
        <Typography sx={{ mt: 1.5, fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
          {pagination?.total ?? invoices.length} invoice{(pagination?.total ?? invoices.length) !== 1 ? 's' : ''} total
        </Typography>
      )}
    </Box>
  );
};

export default InvoiceList;

