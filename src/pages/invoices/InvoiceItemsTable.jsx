/**
 * InvoiceItemsTable — Line items from backend InvoiceDTO.items[]
 * Fields: description, quantity, unitPrice, amount
 */
import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField,
  InputAdornment, Divider,
} from '@mui/material';
import { Search, Package } from 'lucide-react';

const fmt = (val, currency = 'USD') => {
  if (!val && val !== 0) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(val);
};

const fmtQty = (val) => {
  if (!val && val !== 0) return '—';
  return Number(val).toLocaleString('en-US', { maximumFractionDigits: 2 });
};

const InvoiceItemsTable = ({ items = [], currency = 'USD' }) => {
  const [search, setSearch] = useState('');

  const filtered = items.filter((item) =>
    !search.trim() ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const subtotal = items.reduce((sum, i) => sum + (i.amount || 0), 0);

  if (!items.length) {
    return (
      <Box
        sx={{
          py: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          color: 'var(--text-muted)',
        }}
      >
        <Package size={36} strokeWidth={1.5} />
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
          No line items extracted
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search */}
      {items.length > 3 && (
        <Box sx={{ mb: 2 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={15} color="var(--text-muted)" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '0.85rem',
                '& fieldset': { border: '1px solid var(--border-subdued)' },
              },
            }}
          />
        </Box>
      )}

      <TableContainer
        sx={{
          borderRadius: '14px',
          border: '1px solid var(--border-subdued)',
          backgroundColor: 'var(--bg-surface)',
          overflow: 'hidden',
        }}
      >
        <Table size="small">
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
                  py: 1.5,
                },
              }}
            >
              <TableCell>#</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item, idx) => (
              <TableRow
                key={item.id || idx}
                hover
                sx={{
                  '& td': {
                    fontSize: '0.83rem',
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border-subdued)',
                    py: 1.5,
                  },
                  '&:last-child td': { borderBottom: 'none' },
                  '&:hover': { backgroundColor: 'rgba(99,102,241,0.03)' },
                }}
              >
                <TableCell sx={{ color: 'var(--text-muted) !important', width: 36, fontWeight: 600 }}>
                  {idx + 1}
                </TableCell>
                <TableCell sx={{ fontWeight: 500, maxWidth: 280 }}>
                  <Typography
                    sx={{
                      fontSize: '0.83rem',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={item.description}
                  >
                    {item.description || '—'}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {fmtQty(item.quantity)}
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: 'var(--font-family-mono) !important' }}>
                  {fmt(item.unitPrice, currency)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: '700 !important',
                    fontFamily: 'var(--font-family-mono) !important',
                    color: 'var(--primary-600) !important',
                  }}
                >
                  {fmt(item.amount, currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Totals Footer */}
      <Box
        sx={{
          mt: 1.5,
          p: 2,
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subdued)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, minWidth: 200 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Items ({filtered.length})
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-family-mono)' }}>
              {fmt(subtotal, currency)}
            </Typography>
          </Box>
          {search && items.length !== filtered.length && (
            <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Showing {filtered.length} of {items.length} items
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default InvoiceItemsTable;
