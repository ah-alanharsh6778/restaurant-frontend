import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';

export const MergeSplitTableDialog = ({ open, onClose, mode = 'MERGE', tables = [], onMerge, onSplit }) => {
  const [selectedTableIds, setSelectedTableIds] = useState([]);
  const [mergedTableName, setMergedTableName] = useState('Combined Table 1+2');

  const handleMergeSubmit = (e) => {
    e.preventDefault();
    if (selectedTableIds.length < 2) return;
    onMerge(selectedTableIds, mergedTableName);
  };

  const handleSplitSubmit = (e) => {
    e.preventDefault();
    onSplit(tables[0]?.id);
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title={mode === 'MERGE' ? 'Merge Tables for Large Party' : 'Split Merged Party Table'}
      subtitle={mode === 'MERGE' ? 'Combine 2 or more tables into a single party billing unit' : 'Separate merged tables back to original seating layout'}
      icon={TableBarIcon}
      iconColor="primary.main"
      actions={
        <>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button
            onClick={mode === 'MERGE' ? handleMergeSubmit : handleSplitSubmit}
            variant="contained"
            disabled={mode === 'MERGE' && selectedTableIds.length < 2}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {mode === 'MERGE' ? 'Merge Tables' : 'Split Tables'}
          </Button>
        </>
      }
    >
      {mode === 'MERGE' ? (
        <Box component="form" onSubmit={handleMergeSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
          <TextField fullWidth size="small" label="Combined Table Label" value={mergedTableName} onChange={(e) => setMergedTableName(e.target.value)} />

          <FormControl fullWidth size="small">
            <InputLabel>Select Tables to Combine</InputLabel>
            <Select
              multiple
              value={selectedTableIds}
              onChange={(e) => setSelectedTableIds(e.target.value)}
              input={<OutlinedInput label="Select Tables to Combine" />}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const found = tables.find((t) => String(t.id) === String(id));
                    return found ? `Table ${found.tableNumber || found.number}` : id;
                  })
                  .join(', ')
              }
            >
              {tables.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  <Checkbox checked={selectedTableIds.indexOf(t.id) > -1} />
                  <ListItemText primary={`Table ${t.tableNumber || t.number} (Cap: ${t.capacity})`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to split combined party table back into individual seating units?
          </Typography>
        </Box>
      )}
    </ResponsiveDialog>
  );
};

export default MergeSplitTableDialog;
