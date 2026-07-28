import { useState, useRef } from 'react';
import { Box, Typography, Button, LinearProgress, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export const InvoiceDropzone = ({ onFileSelected, uploading = false, uploadProgress = 0 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelected(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelected(file);
    }
  };

  return (
    <Paper
      elevation={2}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      sx={{
        p: 4,
        borderRadius: 4,
        textAlign: 'center',
        border: (theme) =>
          dragActive
            ? `2px dashed ${theme.palette.primary.main}`
            : `2px dashed ${theme.palette.divider}`,
        backgroundColor: (theme) =>
          dragActive
            ? theme.palette.mode === 'dark'
              ? 'rgba(37, 99, 235, 0.15)'
              : 'rgba(37, 99, 235, 0.05)'
            : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpeg,.jpg"
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      <CloudUploadIcon color="primary" sx={{ fontSize: 56, mb: 1 }} />

      <Typography variant="h6" fontWeight={800} gutterBottom>
        Drag & Drop Invoice File Here
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Supports PDF, PNG, JPEG, JPG invoices for AI OCR Extraction
      </Typography>

      <Button
        variant="contained"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        sx={{ borderRadius: 2.5, fontWeight: 700 }}
      >
        Browse File
      </Button>

      {selectedFile && (
        <Box mt={3} p={1.5} borderRadius={2} bgcolor="action.hover" display="flex" alignItems="center" gap={1.5}>
          <InsertDriveFileIcon color="primary" />
          <Box textAlign="left" flexGrow={1}>
            <Typography variant="subtitle2" fontWeight={700}>
              {selectedFile.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
        </Box>
      )}

      {uploading && (
        <Box mt={2}>
          <Typography variant="caption" color="primary" fontWeight={700} display="block" mb={0.5}>
            Uploading & Processing AI OCR... {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}
    </Paper>
  );
};

export default InvoiceDropzone;
