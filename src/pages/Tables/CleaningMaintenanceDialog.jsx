import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import BuildIcon from '@mui/icons-material/Build';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';

export const CleaningMaintenanceDialog = ({ open, onClose, mode = 'CLEANING', table, onSubmit, isSubmitting }) => {
  const [cleanerName, setCleanerName] = useState('Carlos D.');
  const [cleaningNotes, setCleaningNotes] = useState('Sanitized table top and chairs');

  const [issueType, setIssueType] = useState('Broken Chair');
  const [maintenanceNotes, setMaintenanceNotes] = useState('Chair leg wobbly; sent for carpentry repair');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'CLEANING') {
      onSubmit(table?.id, { cleanerName, cleaningNotes, action: 'CLEAN' });
    } else {
      onSubmit(table?.id, { issueType, maintenanceNotes, action: 'MAINTENANCE' });
    }
  };

  const tableNum = table?.tableNumber || table?.number || `#${table?.id}`;

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title={mode === 'CLEANING' ? `Cleaning Management - Table ${tableNum}` : `Log Maintenance Issue - Table ${tableNum}`}
      subtitle={mode === 'CLEANING' ? 'Track sanitization, table prep, and cleaner logging' : 'Report broken fixtures, electrical issues, or block table'}
      icon={mode === 'CLEANING' ? CleaningServicesIcon : BuildIcon}
      iconColor={mode === 'CLEANING' ? 'info.main' : 'warning.main'}
      actions={
        <>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color={mode === 'CLEANING' ? 'info' : 'warning'} disabled={isSubmitting} sx={{ borderRadius: 2, px: 3 }}>
            {mode === 'CLEANING' ? 'Mark Table Clean' : 'Block & Log Maintenance'}
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        {mode === 'CLEANING' ? (
          <>
            <TextField fullWidth size="small" label="Cleaner / Busser Name" value={cleanerName} onChange={(e) => setCleanerName(e.target.value)} />
            <TextField fullWidth multiline rows={2} size="small" label="Cleaning & Sanitization Notes" value={cleaningNotes} onChange={(e) => setCleaningNotes(e.target.value)} />
          </>
        ) : (
          <>
            <FormControl fullWidth size="small">
              <InputLabel>Maintenance Issue Type</InputLabel>
              <Select value={issueType} label="Maintenance Issue Type" onChange={(e) => setIssueType(e.target.value)}>
                <MenuItem value="Broken Chair">Broken Chair / Seating Fixture</MenuItem>
                <MenuItem value="Electrical Issue">Electrical / Lighting Issue</MenuItem>
                <MenuItem value="Spill Deep Clean Required">Spill Deep Clean Required</MenuItem>
                <MenuItem value="Table Surface Scratch">Table Surface Scratch / Damage</MenuItem>
                <MenuItem value="Out of Service Blocked">Out of Service Blocked</MenuItem>
              </Select>
            </FormControl>

            <TextField fullWidth multiline rows={2} size="small" label="Maintenance Notes & Maintenance Tech" value={maintenanceNotes} onChange={(e) => setMaintenanceNotes(e.target.value)} />
          </>
        )}
      </Box>
    </ResponsiveDialog>
  );
};

export default CleaningMaintenanceDialog;
