/**
 * InvoiceList — Searchable, filterable, paginated invoice table
 * GET /api/invoices?status&search&page&limit
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, InputAdornment,
  Select, MenuItem, FormControl, Pagination,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip,
  Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Trash2, RefreshCw, FileText, SlidersHorizontal } from 'lucide-react';
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
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder="Search by invoice #, supplier, or client…"
          value={search}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, minWidth: 220 }}
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

        <FormControl size="small" sx={{ minWidth: 150 }}>
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
              '&:hover': { color: 'var(--primary-500)', borderColor: 'var(--primary-500)' },
            }}
          >
            <RefreshCw size={15} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
          {error?.message || 'Failed to load invoices. Please try again.'}
        </Alert>
      )}

      {/* Table */}
      <Box
        sx={{
          borderRadius: '16px',
          border: '1px solid var(--border-subdued)',
          backgroundColor: 'var(--bg-surface)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {isLoading ? (
          <InvoiceTableSkeleton rows={PAGE_SIZE} />
        ) : invoices.length === 0 ? (
          <EmptyState search={debouncedSearch} status={status} />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{
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
                }}>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Items</TableCell>
                  <TableCell align="center">Actions</TableCell>
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
                      style={{ display: 'table-row' }}
                    >
                      <TableCell sx={{ borderBottom: '1px solid var(--border-subdued)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{
                            width: 30, height: 30, borderRadius: '8px',
                            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
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
                      <TableCell align="center" sx={{ borderBottom: '1px solid var(--border-subdued)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => onView?.(invoice)}
                              sx={{
                                borderRadius: '8px',
                                color: 'var(--primary-500)',
                                '&:hover': { backgroundColor: 'rgba(99,102,241,0.08)' },
                              }}
                            >
                              <Eye size={15} />
                            </IconButton>
                          </Tooltip>
                          {isManager && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => onDelete?.(invoice)}
                                sx={{
                                  borderRadius: '8px',
                                  color: 'var(--text-muted)',
                                  '&:hover': { color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-bg)' },
                                }}
                              >
                                <Trash2 size={15} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        {!isLoading && pagination && pagination.totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2.5,
              py: 1.5,
              borderTop: '1px solid var(--border-subdued)',
              backgroundColor: 'var(--bg-subtle)',
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
      </Box>

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
