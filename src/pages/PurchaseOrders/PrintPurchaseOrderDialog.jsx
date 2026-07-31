import { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import purchaseOrderService from '../../services/purchaseOrder.service';
import { toast } from 'react-toastify';

export const PrintPurchaseOrderDialog = ({ open, onClose, purchaseOrder = null }) => {
  const [loading, setLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    if (open && purchaseOrder?.id) {
      setLoading(true);
      purchaseOrderService
        .getPrintData(purchaseOrder.id)
        .then((res) => {
          const html = typeof res === 'string' ? res : res.html || res.data?.html || '';
          setHtmlContent(html);
        })
        .catch((err) => {
          toast.error('Failed to load printable Purchase Order document');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, purchaseOrder]);

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  if (!purchaseOrder) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5, height: '85vh' } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PrintIcon color="primary" />
        Print Purchase Order ({purchaseOrder.poNumber})
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, position: 'relative', height: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <iframe
            ref={iframeRef}
            title={`PO-${purchaseOrder.poNumber}`}
            srcDoc={htmlContent}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          startIcon={<PrintIcon />}
          disabled={loading || !htmlContent}
          sx={{ px: 3, fontWeight: 800 }}
        >
          Print Document
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintPurchaseOrderDialog;
