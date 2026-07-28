import { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const OCRPreview = ({ ocrData = null, onSaveExpense, onCancel }) => {
  const defaultOCR = ocrData || {
    supplierName: 'Fresh Produce Direct Inc.',
    invoiceNumber: 'INV-2026-8801',
    invoiceDate: new Date().toISOString().slice(0, 10),
    gstNumber: 'GST-992018273',
    subtotal: 450.00,
    taxAmount: 38.25,
    totalAmount: 488.25,
    confidenceScore: 96.8,
  };

  const [form, setForm] = useState(defaultOCR);

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    onSaveExpense(form);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3.5, border: (theme) => `1px solid ${theme.palette.primary.main}` }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <AutoAwesomeIcon color="primary" />
          <Typography variant="h6" fontWeight={800}>
            AI OCR Extracted Data
          </Typography>
        </Box>
        <Chip
          label={`Confidence: ${form.confidenceScore || 96.8}%`}
          color="success"
          size="small"
          sx={{ fontWeight: 800 }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Review and verify automatically extracted invoice fields before adding to General Ledger.
      </Typography>

      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Extracted Supplier / Vendor"
            value={form.supplierName}
            onChange={(e) => handleChange('supplierName', e.target.value)}
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Invoice Number"
            value={form.invoiceNumber}
            onChange={(e) => handleChange('invoiceNumber', e.target.value)}
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Invoice Date"
            InputLabelProps={{ shrink: true }}
            value={form.invoiceDate}
            onChange={(e) => handleChange('invoiceDate', e.target.value)}
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="GST / Tax ID Number"
            value={form.gstNumber}
            onChange={(e) => handleChange('gstNumber', e.target.value)}
          />
        </Grid>

        <Grid xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Subtotal ($)"
            value={form.subtotal}
            onChange={(e) => handleChange('subtotal', e.target.value)}
          />
        </Grid>

        <Grid xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Tax Amount ($)"
            value={form.taxAmount}
            onChange={(e) => handleChange('taxAmount', e.target.value)}
          />
        </Grid>

        <Grid xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Grand Total ($)"
            value={form.totalAmount}
            onChange={(e) => handleChange('totalAmount', e.target.value)}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2.5 }} />

      <Box display="flex" justifyContent="flex-end" gap={1.5}>
        <Button color="inherit" onClick={onCancel}>
          Discard
        </Button>
        <Button
          variant="contained"
          startIcon={<CheckCircleIcon />}
          onClick={handleSave}
          sx={{ fontWeight: 700 }}
        >
          Confirm & Save Expense
        </Button>
      </Box>
    </Paper>
  );
};

export default OCRPreview;
