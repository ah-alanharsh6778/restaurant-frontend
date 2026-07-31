import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as FileIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import PageHeader from '../../components/layout/PageHeader';
import invoiceService from '../../services/invoice.service';
import aiService from '../../services/ai.service';

export const InvoiceUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warning('Please select at least one invoice file to upload');
      return;
    }

    setUploading(true);
    setProgress(30);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('invoices', file);
      });

      setProgress(60);
      const res = await aiService.processInvoiceAI(formData);
      setProgress(100);

      if (res && res.data) {
        const newInvoices = Array.isArray(res.data) ? res.data : [res.data];
        try {
          const stored = localStorage.getItem('restaurantos_extracted_invoices');
          const prev = stored ? JSON.parse(stored) : [];
          localStorage.setItem('restaurantos_extracted_invoices', JSON.stringify([...newInvoices, ...prev]));
        } catch (e) {
          console.error(e);
        }
      }

      toast.success(`${selectedFiles.length} invoice(s) uploaded & analyzed with Vision AI OCR!`);
      setSelectedFiles([]);
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleExportRegister = async () => {
    try {
      await invoiceService.exportRegister();
      toast.info('Invoice register exported successfully');
    } catch (error) {
      toast.error('Failed to export invoice register');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Invoice Dropzone & OCR Processing"
        subtitle="Upload vendor PDF invoices and receipts for automated expense parsing."
        breadcrumbs={['Invoice Upload']}
        actions={
          <Button variant="outlined" startIcon={<ExportIcon />} onClick={handleExportRegister}>
            Export Register
          </Button>
        }
      />

      <Paper
        elevation={2}
        sx={{
          p: 5,
          borderRadius: 4,
          border: (theme) => `2px dashed ${theme.palette.primary.main}`,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(59, 130, 246, 0.02)',
          textAlign: 'center',
          mb: 4,
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Drag & Drop Vendor Invoices
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Supports PDF, PNG, JPEG receipts (up to 20 files per batch)
        </Typography>

        <Button variant="contained" component="label" size="large">
          Browse Files
          <input type="file" multiple hidden accept="application/pdf,image/*" onChange={handleFileChange} />
        </Button>
      </Paper>

      {/* Selected File Queue */}
      {selectedFiles.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700}>
              Selected Batch Queue ({selectedFiles.length})
            </Typography>
            <Button
              variant="contained"
              color="primary"
              disabled={uploading}
              onClick={handleUpload}
              startIcon={<CloudUploadIcon />}
            >
              Start Processing Batch
            </Button>
          </Box>

          {uploading && <LinearProgress variant="determinate" value={progress} sx={{ mb: 2, height: 8, borderRadius: 4 }} />}

          <List>
            {selectedFiles.map((file, idx) => (
              <ListItem
                key={idx}
                secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => handleRemoveFile(idx)} disabled={uploading}>
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <ListItemIcon>
                  <FileIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(1)} KB`}
                />
                <Chip label="Ready" size="small" color="info" sx={{ mr: 2 }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default InvoiceUpload;
