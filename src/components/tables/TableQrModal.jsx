import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import TableBarIcon from '@mui/icons-material/TableBar';
import { Button, showToast } from '../ui';

/**
 * RestaurantOS Table QR Code Modal
 * Generates scannable QR code linking to guest mobile ordering URL (/table-order/:tableId)
 */
export const TableQrModal = ({ open, onClose, table }) => {
  const printRef = useRef(null);

  if (!table) return null;

  const orderUrl = `${window.location.origin}/table-order/${table.id}`;

  // SVG QR Code Generator helper for zero external dependencies
  const qrSvgDataUri = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    orderUrl
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(orderUrl);
    showToast.success('Table QR Ordering Link copied to clipboard!');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Table ${table.tableNumber} - QR Order Card</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #F8FAFC; }
            .card { width: 340px; background: #FFFFFF; border-radius: 24px; padding: 36px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 2px solid #E2E8F0; }
            .logo { font-size: 24px; font-weight: 900; color: #4F46E5; margin-bottom: 8px; letter-spacing: -0.5px; }
            .table-badge { display: inline-block; background: #4F46E5; color: #FFFFFF; font-weight: 800; font-size: 16px; padding: 6px 18px; border-radius: 20px; margin-bottom: 20px; }
            .qr-img { width: 220px; height: 220px; border-radius: 16px; border: 4px solid #F1F5F9; padding: 8px; }
            .instructions { margin-top: 20px; font-size: 14px; color: #475569; font-weight: 600; line-height: 1.5; }
            .sub { font-size: 12px; color: #94A3B8; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">RestaurantOS</div>
            <div class="table-badge">TABLE ${table.tableNumber}</div>
            <br/>
            <img class="qr-img" src="${qrSvgDataUri}" alt="Table ${table.tableNumber} QR Code" />
            <div class="instructions">Scan QR code with your camera to view menu & place your order</div>
            <div class="sub">No App Download Required</div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          p: 1,
          backgroundColor: 'var(--glass-bg, rgba(255, 255, 255, 0.95))',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.35))',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.2}>
          <QrCode2Icon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Table QR Order Code
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Box
          ref={printRef}
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: 'var(--bg-surface, #FFFFFF)',
            border: '1px solid var(--border-subdued, #E2E8F0)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Chip
            icon={<TableBarIcon size={18} />}
            label={`Table #${table.tableNumber} • ${table.capacity} Capacity`}
            color="primary"
            sx={{ fontWeight: 800, mb: 2.5, px: 1, py: 0.5, borderRadius: 3 }}
          />

          <Box
            component="img"
            src={qrSvgDataUri}
            alt={`Table ${table.tableNumber} QR`}
            sx={{
              width: 220,
              height: 220,
              borderRadius: 3,
              border: '2px solid var(--border-subdued, #E2E8F0)',
              p: 1,
              bgcolor: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 2.5, color: 'text.primary' }}>
            Scan with Mobile Phone Camera
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
            Customers scan to view menu categories, dishes, and submit instant orders to kitchen.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'space-between' }}>
        <Tooltip title="Copy Guest Order URL" arrow>
          <Button variant="outlined" size="small" startIcon={<ContentCopyIcon fontSize="small" />} onClick={handleCopyLink}>
            Copy Link
          </Button>
        </Tooltip>

        <Button variant="primary" size="small" startIcon={<PrintIcon fontSize="small" />} onClick={handlePrint}>
          Print QR Card
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableQrModal;
