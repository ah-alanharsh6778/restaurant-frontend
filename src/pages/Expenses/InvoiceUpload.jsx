import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { toast } from 'react-toastify';
import InvoiceDropzone from './InvoiceDropzone';
import OCRPreview from './OCRPreview';
import { invoiceService } from '../../services/invoice.service';
import expenseService from '../../services/expense.service';

export const InvoiceUpload = ({ onExpenseCreated }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState(null);

  const handleFileSelected = async (file) => {
    setUploading(true);
    setProgress(20);

    try {
      const res = await invoiceService.uploadInvoice(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      });

      setUploading(false);
      setProgress(100);

      const invoiceData = res?.data || res;
      setOcrResult({
        supplierName: invoiceData.supplierName || 'Extracted Vendor',
        invoiceNumber: invoiceData.invoiceNumber || `INV-${Date.now()}`,
        invoiceDate: invoiceData.invoiceDate ? new Date(invoiceData.invoiceDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        gstNumber: invoiceData.gstNumber || 'N/A',
        subtotal: invoiceData.subtotal || invoiceData.totalAmount || 0,
        taxAmount: invoiceData.taxAmount || 0,
        totalAmount: invoiceData.totalAmount || 0,
        confidenceScore: invoiceData.confidenceScore || 95.0,
      });

      toast.success(res.message || 'AI OCR Extraction completed successfully!');
    } catch (error) {
      setUploading(false);
      setProgress(0);
      const msg = error.response?.data?.message || error.message || 'Failed to extract OCR data from invoice';
      toast.error(msg);
    }
  };

  const handleSaveExpense = async (formData) => {
    try {
      await expenseService.createExpense({
        title: `Invoice #${formData.invoiceNumber} - ${formData.supplierName}`,
        supplierName: formData.supplierName,
        invoiceNumber: formData.invoiceNumber,
        invoiceDate: formData.invoiceDate,
        amount: Number(formData.subtotal),
        taxAmount: Number(formData.taxAmount),
        status: 'PROCESSED',
      });
      toast.success('OCR Invoice converted to Expense Record!');
      setOcrResult(null);
      if (onExpenseCreated) onExpenseCreated();
    } catch (error) {
      toast.error('Failed to save expense record');
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <AutoAwesomeIcon color="primary" fontSize="large" />
        <Box>
          <Typography variant="h5" fontWeight={800}>
            AI Automated Invoice OCR Processor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload PDF/Image receipts to extract vendor details, line items, and taxes automatically
          </Typography>
        </Box>
      </Box>

      {!ocrResult ? (
        <InvoiceDropzone
          onFileSelected={handleFileSelected}
          uploading={uploading}
          uploadProgress={progress}
        />
      ) : (
        <OCRPreview
          ocrData={ocrResult}
          onSaveExpense={handleSaveExpense}
          onCancel={() => setOcrResult(null)}
        />
      )}
    </Box>
  );
};

export default InvoiceUpload;
