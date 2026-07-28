/**
 * InvoiceSkeleton — Shimmer loading states for list + cards
 */
import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const InvoiceCardSkeleton = () => (
  <Box
    sx={{
      p: 2.5,
      borderRadius: '16px',
      border: '1px solid var(--border-subdued)',
      backgroundColor: 'var(--bg-surface)',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
      <Skeleton variant="text" width={140} height={20} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rounded" width={80} height={22} sx={{ borderRadius: 12 }} />
    </Box>
    <Skeleton variant="text" width={200} height={16} sx={{ mb: 0.5 }} />
    <Skeleton variant="text" width={120} height={16} sx={{ mb: 1.5 }} />
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Skeleton variant="text" width={80} height={16} />
      <Skeleton variant="text" width={60} height={16} />
    </Box>
  </Box>
);

export const InvoiceStatSkeleton = () => (
  <Box
    sx={{
      p: 3,
      borderRadius: '20px',
      border: '1px solid var(--border-subdued)',
      backgroundColor: 'var(--bg-surface)',
    }}
  >
    <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: '12px', mb: 2 }} />
    <Skeleton variant="text" width={80} height={36} sx={{ mb: 0.5 }} />
    <Skeleton variant="text" width={120} height={18} />
  </Box>
);

export const InvoiceRowSkeleton = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 100px',
      gap: 2,
      px: 2.5,
      py: 2,
      alignItems: 'center',
      borderBottom: '1px solid var(--border-subdued)',
    }}
  >
    {[140, 180, 100, 90, 80, 70].map((w, i) => (
      <Skeleton key={i} variant="text" width={w} height={16} />
    ))}
  </Box>
);

export const InvoiceTableSkeleton = ({ rows = 8 }) => (
  <Box>
    {Array.from({ length: rows }).map((_, i) => (
      <InvoiceRowSkeleton key={i} />
    ))}
  </Box>
);

export default InvoiceTableSkeleton;
