import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Button, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HistoryIcon from '@mui/icons-material/History';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import PageContainer from '../../layout/PageContainer';
import InvoiceDashboard from './InvoiceDashboard';
import InvoiceUploadZone from './InvoiceUploadZone';
import InvoiceUploadProgress from './InvoiceUploadProgress';
import InvoiceList from './InvoiceList';
import InvoiceDetailDrawer from './InvoiceDetailDrawer';
import DeleteInvoiceDialog from './DeleteInvoiceDialog';
import DuplicateWarningDialog from './DuplicateWarningDialog';
import { useAuth } from '../../hooks/useAuth';
import { useUploadInvoice, invoiceKeys } from '../../hooks/useInvoices';

const TabPanel = ({ children, value, index }) => (
  <AnimatePresence mode="wait">
    {value === index && (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const InvoicesPage = () => {
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const isManager = hasRole('ADMIN') || hasRole('MANAGER');

  const [activeTab, setActiveTab] = useState(0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [duplicateError, setDuplicateError] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  const { isPending: isUploading, isSuccess: uploadSuccess, isError: uploadFailed } = useUploadInvoice();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    toast.success('Invoice telemetry refreshed');
  };

  const handleUploadSuccess = (data) => {
    setUploadResult(data);
    toast.success('Invoice uploaded and processed with OCR & AI parsing!');
    setTimeout(() => {
      setActiveTab(2);
      setUploadResult(null);
    }, 2500);
  };

  const handleDuplicate = (err) => {
    const msg = err?.originalError?.response?.data?.message || err?.message || 'Duplicate invoice detected.';
    setDuplicateError(msg);
  };

  const handleUploadError = (err) => {
    if (err?.status === 409 || err?.response?.status === 409) {
      handleDuplicate(err);
    } else {
      setUploadError(err?.response?.data?.message || err?.message || 'Upload failed. Please try again.');
    }
  };

  return (
    <PageContainer
      title="AI Invoice OCR & Expense Pipeline"
      subtitle="Upload supplier invoices for automatic OCR extraction, AI data parsing, duplicate detection, and expense entry creation"
      breadcrumbs={[{ label: 'Invoice OCR' }]}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto', alignItems: 'center' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          {isManager && (
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setActiveTab(1)}
              sx={{ fontWeight: 700 }}
            >
              Upload Invoice
            </Button>
          )}
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Navigation Tabs Header */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            px: 2,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            indicatorColor="primary"
            textColor="primary"
            sx={{
              minHeight: 48,
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.875rem',
                textTransform: 'none',
                minHeight: 48,
              },
            }}
          >
            <Tab icon={<DashboardIcon fontSize="small" />} iconPosition="start" label="Dashboard & Telemetry" />
            {isManager && <Tab icon={<CloudUploadIcon fontSize="small" />} iconPosition="start" label="Upload New Invoice" />}
            <Tab icon={<HistoryIcon fontSize="small" />} iconPosition="start" label="Invoice History & Audit" />
          </Tabs>
        </Paper>

        {/* Tab 0: Dashboard */}
        <TabPanel value={activeTab} index={0}>
          <InvoiceDashboard />
        </TabPanel>

        {/* Tab 1: Upload (ADMIN / MANAGER only) */}
        {isManager && (
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ maxWidth: 720, mx: 'auto' }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={800} color="text.primary">
                    Upload Supplier Invoice File
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported formats: PDF, PNG, JPG, JPEG (Max 10 MB). Backend OCR & AI will automatically extract line items and record the expense.
                  </Typography>
                </Box>

                <InvoiceUploadZone
                  onSuccess={handleUploadSuccess}
                  onDuplicate={handleDuplicate}
                  onError={handleUploadError}
                />

                {/* Upload Timeline Progress */}
                <AnimatePresence>
                  {(isUploading || uploadSuccess || uploadFailed) && (
                    <InvoiceUploadProgress
                      isProcessing={isUploading}
                      isSuccess={!!uploadResult}
                      isError={uploadFailed && !uploadResult}
                      result={uploadResult}
                      errorMsg={uploadError}
                    />
                  )}
                </AnimatePresence>
              </Paper>
            </Box>
          </TabPanel>
        )}

        {/* Tab 2: History & List */}
        <TabPanel value={activeTab} index={2}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <InvoiceList
              onView={(inv) => setSelectedInvoiceId(inv.id)}
              onDelete={(inv) => setInvoiceToDelete(inv)}
            />
          </Paper>
        </TabPanel>
      </Box>

      {/* Invoice Detail Drawer */}
      <InvoiceDetailDrawer
        invoiceId={selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        onDelete={(inv) => {
          setSelectedInvoiceId(null);
          setInvoiceToDelete(inv);
        }}
        onReprocessed={() => {
          setSelectedInvoiceId(null);
          queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
        }}
      />

      {/* Delete Invoice Dialog */}
      <DeleteInvoiceDialog
        open={!!invoiceToDelete}
        invoice={invoiceToDelete}
        onClose={(deleted) => {
          setInvoiceToDelete(null);
          if (deleted) {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
            setActiveTab(2);
          }
        }}
      />

      {/* Duplicate Warning Modal (HTTP 409 Conflict) */}
      <DuplicateWarningDialog
        open={!!duplicateError}
        errorMessage={duplicateError}
        onClose={() => setDuplicateError(null)}
      />
    </PageContainer>
  );
};

export default InvoicesPage;
