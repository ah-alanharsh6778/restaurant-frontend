import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';

export const InvoicePreviewDialog = ({ open, onClose, filePath = null, invoiceNumber = 'N/A' }) => {
  if (!open) return null;

  // Format API URL if relative path
  let fullUrl = null;
  if (filePath) {
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      fullUrl = filePath;
    } else {
      // Normalize backslashes or local server upload path
      const cleanPath = filePath.replace(/\\/g, '/').replace(/^.*\/uploads\//, '/uploads/');
      fullUrl = `http://localhost:5000${cleanPath}`;
    }
  }

  const isPdf = fullUrl ? Boolean(fullUrl.toLowerCase().endsWith('.pdf')) : false;

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={`Invoice Document - ${invoiceNumber}`}
      subtitle="Embedded invoice file preview"
      icon={VisibilityIcon}
      iconColor="info.main"
      actions={
        <Button onClick={onClose} color="primary" variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
          Close Preview
        </Button>
      }
    >
      <Box sx={{ py: 1, minHeight: 450, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {fullUrl ? (
          isPdf ? (
            <Box sx={{ width: '100%', height: 500, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              <object data={fullUrl} type="application/pdf" width="100%" height="100%">
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    PDF preview not natively supported in browser.
                  </Typography>
                  <Button variant="contained" href={fullUrl} target="_blank" rel="noopener noreferrer">
                    Open PDF Document
                  </Button>
                </Box>
              </object>
            </Box>
          ) : (
            <Box
              component="img"
              src={fullUrl}
              alt={`Invoice ${invoiceNumber}`}
              sx={{
                maxWidth: '100%',
                maxHeight: 520,
                objectFit: 'contain',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
          )
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: '#FAFBFD',
              border: '1px dashed',
              borderColor: 'divider',
              width: '100%',
            }}
          >
            <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              No Document File Attached
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This expense entry was manually created without an uploaded invoice document file.
            </Typography>
          </Paper>
        )}
      </Box>
    </ResponsiveDialog>
  );
};

export default InvoicePreviewDialog;
