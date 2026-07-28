import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';

export const TransferTableDialog = ({ open, onClose, onSubmit, currentTable, availableTables = [], isSubmitting }) => {
  const [targetTableId, setTargetTableId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetTableId) return;
    onSubmit(currentTable?.id, targetTableId);
  };

  const tableNum = currentTable?.tableNumber || currentTable?.number || `#${currentTable?.id}`;

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title={`Transfer Order & Party from Table ${tableNum}`}
      subtitle="Select a target available table to transfer the active order, guests, and billing"
      icon={SwapHorizIcon}
      iconColor="primary.main"
      actions={
        <>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!targetTableId || isSubmitting} sx={{ borderRadius: 2, px: 3 }}>
            Transfer Order Now
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Moving active order <strong>#ORD-1785091741399 ($84.50)</strong> from Table {tableNum}.
        </Typography>

        <FormControl fullWidth size="small" required>
          <InputLabel>Select Target Available Table</InputLabel>
          <Select value={targetTableId} label="Select Target Available Table" onChange={(e) => setTargetTableId(e.target.value)}>
            {availableTables.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                Table {t.tableNumber || t.number} (Cap: {t.capacity} Guests - {t.floor || 'Main Hall'})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </ResponsiveDialog>
  );
};

export default TransferTableDialog;
