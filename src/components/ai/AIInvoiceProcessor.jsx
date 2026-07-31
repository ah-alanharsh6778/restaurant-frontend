import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import TableViewIcon from '@mui/icons-material/TableView';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

import aiService from '../../services/ai.service';
import expenseService from '../../services/expense.service';

const DEFAULT_INITIAL_INVOICES = [
  {
    id: '1',
    invoiceNumber: 'INV-2026-9918',
    supplierName: 'Sun Valley Organic Produce Inc.',
    invoiceDate: '2026-07-26',
    categoryName: 'Raw Ingredients',
    subtotal: 420.00,
    taxAmount: 33.60,
    totalAmount: 453.60,
    paymentStatus: 'Pending',
    ocrConfidence: '98.4% (Vision AI)',
    type: 'Printed PDF Invoice',
    lineItems: [
      { description: 'Organic Cherry Tomatoes (5kg box)', quantity: 4, unitPrice: 32.50, total: 130.00 },
      { description: 'Extra Virgin Olive Oil 5L', quantity: 2, unitPrice: 65.00, total: 130.00 },
      { description: 'Fresh Italian Basil Bunches', quantity: 10, unitPrice: 16.00, total: 160.00 },
    ],
  },
  {
    id: '2',
    invoiceNumber: 'HW-8812-METRO',
    supplierName: 'Metro Dairy Foods',
    invoiceDate: '2026-07-25',
    categoryName: 'Dairy & Cheese',
    subtotal: 212.50,
    taxAmount: 17.00,
    totalAmount: 229.50,
    paymentStatus: 'Paid',
    ocrConfidence: '94.1% (Handwritten AI recognized)',
    type: 'Handwritten Receipt Scan',
    lineItems: [
      { description: 'Fresh Mozzarella Blocks', quantity: 10, unitPrice: 15.00, total: 150.00 },
      { description: 'Heavy Whipping Cream 1L', quantity: 5, unitPrice: 12.50, total: 62.50 },
    ],
  },
];

export const AIInvoiceProcessor = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [extractedInvoices, setExtractedInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('restaurantos_extracted_invoices');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved invoices', e);
    }
    return DEFAULT_INITIAL_INVOICES;
  });

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      toast.info(`Selected ${files.length} invoice file(s) for AI processing.`);
    }
  };

  const handleProcessInvoices = async () => {
    if (selectedFiles.length === 0) {
      toast.warning('Please select one or more supplier invoices (PDFs or Images) first.');
      return;
    }

    setProcessing(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('invoices', file));

      const res = await aiService.processInvoiceAI(formData);
      if (res && res.data) {
        const newInvoices = Array.isArray(res.data) ? res.data : [res.data];
        setExtractedInvoices((prev) => {
          const updated = [...newInvoices, ...prev];
          try {
            localStorage.setItem('restaurantos_extracted_invoices', JSON.stringify(updated));
          } catch (e) {
            console.error('Failed to save to localStorage', e);
          }
          return updated;
        });
        toast.success(`Successfully analyzed & extracted ${newInvoices.length} unique invoice(s) using Vision AI OCR!`);
        setSelectedFiles([]);
      }
    } catch (err) {
      toast.error('Failed to process invoices with AI.');
    } finally {
      setProcessing(false);
    }
  };

  const handleStoreInPostgres = async (invoice) => {
    try {
      await expenseService.createExpense({
        invoiceNumber: invoice.invoiceNumber,
        supplierName: invoice.supplierName,
        expenseDate: invoice.invoiceDate,
        amount: invoice.totalAmount,
        categoryName: invoice.categoryName,
        status: invoice.paymentStatus,
        notes: `AI Extracted OCR (${invoice.ocrConfidence})`,
      });
      toast.success(`Invoice #${invoice.invoiceNumber} stored cleanly in PostgreSQL database!`);
    } catch (err) {
      toast.error('Failed to store invoice in PostgreSQL database');
    }
  };

  const handleGenerateExcelRegister = () => {
    try {
      const worksheetData = extractedInvoices.map((inv) => ({
        'Invoice Number': inv.invoiceNumber,
        'Supplier Name': inv.supplierName,
        'Invoice Date': inv.invoiceDate,
        'Category': inv.categoryName,
        'Subtotal ($)': inv.subtotal,
        'Tax ($)': inv.taxAmount,
        'Total Amount ($)': inv.totalAmount,
        'Payment Status': inv.paymentStatus,
        'OCR Confidence': inv.ocrConfidence,
        'Document Type': inv.type,
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Expense Register');

      XLSX.writeFile(workbook, `Expense_Register_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success('Expense Register Excel spreadsheet generated!');
    } catch (err) {
      toast.error('Failed to generate Excel Expense Register');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Banner */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3.5, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 46, height: 46 }}>
              <AutoAwesomeIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                AI-Powered Supplier Invoice & OCR Processing
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload printed or handwritten PDFs & images, extract telemetry, store in PostgreSQL, and export Excel registers
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="success"
            startIcon={<TableViewIcon />}
            onClick={handleGenerateExcelRegister}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Export Excel Expense Register
          </Button>
        </Box>
      </Paper>

      {/* Upload Dropzone */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3.5,
          border: '2px dashed',
          borderColor: selectedFiles.length > 0 ? 'primary.main' : 'divider',
          bgcolor: 'action.hover',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input
          type="file"
          id="ai-invoice-upload-input"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <label htmlFor="ai-invoice-upload-input" style={{ cursor: 'pointer' }}>
          <CloudUploadIcon sx={{ fontSize: 52, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {selectedFiles.length > 0
              ? `${selectedFiles.length} File(s) Selected for AI Processing`
              : 'Drop Printed or Handwritten Supplier Invoices Here'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Supports PDF, PNG, JPG, JPEG, WEBP (Multiple Supplier Documents)
          </Typography>
        </label>

        {selectedFiles.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleProcessInvoices}
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
            sx={{ borderRadius: 2, px: 4, py: 1, textTransform: 'none', fontWeight: 700 }}
          >
            {processing ? 'Extracting Invoice Telemetry with AI...' : 'Run Vision AI / OCR Extraction'}
          </Button>
        )}
      </Paper>

      {/* Extracted Invoices Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3.5, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Extracted Expense Register ({extractedInvoices.length} Invoices)
          </Typography>
          <Chip label="PostgreSQL Synced" color="info" size="small" sx={{ fontWeight: 700 }} />
        </Box>

        <Table container={Box} sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Invoice #</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Supplier Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>AI / OCR Confidence</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>PostgreSQL DB</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {extractedInvoices.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {row.invoiceNumber}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{row.supplierName}</TableCell>
                <TableCell>{row.invoiceDate}</TableCell>
                <TableCell>
                  <Chip label={row.categoryName} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }}>
                  ${Number(row.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Chip label={row.ocrConfidence} color="success" size="small" sx={{ fontWeight: 700, height: 20 }} />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<StorageIcon fontSize="small" />}
                    onClick={() => handleStoreInPostgres(row)}
                    sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                  >
                    Sync DB
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AIInvoiceProcessor;
