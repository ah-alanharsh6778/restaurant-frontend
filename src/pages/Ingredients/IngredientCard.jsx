import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import IngredientStatusChip from './IngredientStatusChip';

export const IngredientCard = ({ ingredient, onView }) => {
  const qty = Number(ingredient.quantity !== undefined ? ingredient.quantity : 0);
  const min = Number(ingredient.minimumStock !== undefined ? ingredient.minimumStock : (ingredient.minStock || 0));
  const isLowStock = qty <= min;

  return (
    <Card
      elevation={0}
      onClick={() => onView && onView(ingredient)}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: isLowStock ? 'warning.main' : 'divider',
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
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem' }}>
            {ingredient.name}
          </Typography>
          <IngredientStatusChip status={ingredient.status} isActive={ingredient.isActive} />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Quantity: <strong style={{ color: isLowStock ? '#D97706' : 'inherit' }}>{qty} {ingredient.unit || 'units'}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Minimum Threshold: {min} {ingredient.unit || 'units'}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Cost per Unit: ₹{Number(ingredient.costPerUnit || 0).toFixed(2)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 1.5,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Supplier: {ingredient.supplier?.name || ingredient.supplierName || '—'}
          </Typography>

          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
            Tap for Details & Actions →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IngredientCard;
