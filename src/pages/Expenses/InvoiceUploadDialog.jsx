import React, { useState, useRef } from 'react';
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import expenseService from '../../services/expense.service';

export const InvoiceUploadDialog = ({ open, onClose, onSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  const maxFiles = 20;

  const handleFileChange = (files) => {
    const validFiles = Array.from(files).filter((file) => {
      const isAllowed = allowedTypes.includes(file.type) || /\.(pdf|png|jpe?g)$/i.test(file.name);
      if (!isAllowed) {
        toast.error(`File "${file.name}" is not a supported format (PDF, PNG, JPG).`);
      }
      return isAllowed;
    });

    if (selectedFiles.length + validFiles.length > maxFiles) {
      toast.error(`Maximum limit is ${maxFiles} files per upload.`);
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one invoice file to upload.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('invoices', file);
    });

    try {
      setUploading(true);
      setProgress(30);

      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 15 : prev));
      }, 300);

      const res = await expenseService.uploadInvoices(formData);
      clearInterval(interval);
      setProgress(100);

      toast.success(res.message || `Successfully processed ${selectedFiles.length} invoice(s) with AI OCR!`);
      setSelectedFiles([]);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Invoice upload error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to upload and process invoices.';
      toast.error(msg);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Upload Invoices (AI OCR)"
      subtitle="Drag & drop invoice PDFs or images to automatically extract OCR data"
      icon={CloudUploadIcon}
      iconColor="info.main"
      actions={
        <>
          <Button onClick={onClose} disabled={uploading} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            color="primary"
            disabled={uploading || selectedFiles.length === 0}
            startIcon={<CloudUploadIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            Process {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''} Invoices
          </Button>
        </>
      }
    >
      <Box sx={{ py: 1 }}>
        {/* Drag & Drop Area */}
        <Paper
          elevation={0}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: dragOver ? 'primary.main' : 'divider',
            bgcolor: dragOver ? 'primary.50' : 'background.paper',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleFileChange(e.target.files)}
          />

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'primary.100',
              color: 'primary.main',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 32 }} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Drag & Drop Invoices Here
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            or click to browse files from your computer
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mt: 1.5 }}>
            <Chip label="PDF" size="small" variant="outlined" color="primary" />
            <Chip label="PNG" size="small" variant="outlined" color="primary" />
            <Chip label="JPG / JPEG" size="small" variant="outlined" color="primary" />
            <Chip label="Max 20 Files" size="small" variant="outlined" color="default" />
          </Box>
        </Paper>

        {/* Progress Bar */}
        {uploading && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                AI OCR Processing Invoices...
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 2 }} />
          </Box>
        )}

        {/* File Preview List */}
        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Selected Files ({selectedFiles.length}):
            </Typography>
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, maxHeight: 180, overflowY: 'auto' }}>
              <List disablePadding dense>
                {selectedFiles.map((file, idx) => (
                  <ListItem
                    key={idx}
                    secondaryAction={
                      <IconButton edge="end" size="small" color="error" onClick={() => handleRemoveFile(idx)} disabled={uploading}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                    sx={{ borderBottom: idx === selectedFiles.length - 1 ? 'none' : '1px solid', borderColor: 'divider' }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {file.type === 'application/pdf' ? (
                        <PictureAsPdfIcon color="error" fontSize="small" />
                      ) : (
                        <ImageIcon color="primary" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(1)} KB`}
                      slotProps={{
                        primary: { fontSize: '0.875rem', fontWeight: 600, noWrap: true },
                        secondary: { fontSize: '0.75rem' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        )}
      </Box>
    </ResponsiveDialog>
  );
};

export default InvoiceUploadDialog;
