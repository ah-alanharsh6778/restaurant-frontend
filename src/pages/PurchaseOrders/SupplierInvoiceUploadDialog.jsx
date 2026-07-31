import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export const SupplierInvoiceUploadDialog = ({
  open,
  onClose,
  onSubmit,
  purchaseOrder = null,
  loading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = () => {
    if (!selectedFile || !purchaseOrder) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    onSubmit(formData);
  };

  if (!purchaseOrder) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CloudUploadIcon color="primary" />
        Upload Supplier Invoice OCR ({purchaseOrder.poNumber})
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload supplier invoice PDF or image. AI OCR will process text extraction and automatically record an Expense entry in PostgreSQL.
        </Typography>

        {/* Drag & Drop Upload Zone */}
        <Paper
          elevation={0}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: (theme) => `2px dashed ${dragOver ? theme.palette.primary.main : theme.palette.divider}`,
            background: (theme) => (dragOver ? theme.palette.action.hover : theme.palette.background.default),
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <input
            accept=".pdf,image/png,image/jpeg,image/jpg"
            style={{ display: 'none' }}
            id="po-invoice-file-input"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="po-invoice-file-input" style={{ cursor: 'pointer' }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={700}>
              Click or drag invoice file to upload
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              Supports PDF, PNG, JPG, JPEG (Max 10MB)
            </Typography>
          </label>
        </Paper>

        {/* Selected File Details */}
        {selectedFile && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.success.main}`,
              background: (theme) => theme.palette.action.selected,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <InsertDriveFileIcon color="success" />
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </Box>
            </Box>
            <Button size="small" color="error" onClick={() => setSelectedFile(null)}>
              Remove
            </Button>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          disabled={loading || !selectedFile}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          sx={{ px: 3, fontWeight: 800 }}
        >
          {loading ? 'Processing OCR & Expense...' : 'Upload & Process Expense'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierInvoiceUploadDialog;
