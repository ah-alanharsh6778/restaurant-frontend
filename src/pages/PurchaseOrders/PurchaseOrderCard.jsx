import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import PurchaseOrderStatusChip from './PurchaseOrderStatusChip';

export const PurchaseOrderCard = ({
  po,
  onView,
}) => {
  const supplierName = typeof po.supplier === 'object' ? po.supplier?.name : (po.supplierName || '—');
  const itemsCount = Array.isArray(po.purchaseItems) ? po.purchaseItems.length : (Array.isArray(po.items) ? po.items.length : 0);
  const totalAmount = Number(po.grandTotal || po.totalAmount || 0).toFixed(2);

  return (
    <Card
      elevation={0}
      onClick={() => onView && onView(po)}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1rem' }}>
            {po.poNumber || `PO #${po.id?.slice(0, 8)}`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <PurchaseOrderStatusChip status={po.status} />
            <Chip
              label={po.paymentStatus || 'PENDING'}
              size="small"
              color={po.paymentStatus === 'PAID' ? 'success' : po.paymentStatus === 'PARTIAL' ? 'warning' : 'default'}
              sx={{ fontWeight: 800 }}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Supplier: <strong>{supplierName}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Line Items: {itemsCount} items
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'success.main', mt: 0.5 }}>
            Grand Total: ${totalAmount}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 1.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Date: {po.createdAt ? new Date(po.createdAt).toLocaleDateString() : '—'}
          </Typography>
          <Typography variant="caption" color="primary.main" fontWeight={700}>
            Tap for Details & Actions →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderCard;
