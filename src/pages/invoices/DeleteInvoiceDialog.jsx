/**
 * DeleteInvoiceDialog — Confirm deletion of an invoice
 * Calls DELETE /api/invoices/:id on confirm.
 */
import React from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Box, Typography, CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useDeleteInvoice } from '../../hooks/useInvoices';

const DeleteInvoiceDialog = ({ open, onClose, invoice }) => {
  const { mutate: deleteInvoice, isPending } = useDeleteInvoice();

  const handleConfirm = () => {
    if (!invoice?.id || isPending) return;
    deleteInvoice(invoice.id, {
      onSuccess: () => {
        onClose(true); // true = deleted
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isPending && onClose(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          border: '1px solid rgba(239,68,68,0.2)',
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        },
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        >
          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 12px 32px rgba(239,68,68,0.35)',
            }}
          >
            <Trash2 size={28} color="#fff" strokeWidth={2} />
          </Box>
        </motion.div>

        <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', mb: 1 }}>
          Delete Invoice?
        </Typography>

        <Typography sx={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, mb: 2 }}>
          You are about to permanently delete invoice{' '}
          {invoice?.invoiceNumber && (
            <Box component="span" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              #{invoice.invoiceNumber}
            </Box>
          )}{' '}
          from <Box component="span" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {invoice?.supplierName || 'Unknown Supplier'}
          </Box>.
        </Typography>

        <Box
          sx={{
            p: 1.5,
            borderRadius: '10px',
            backgroundColor: 'var(--color-danger-bg)',
            border: '1px solid rgba(239,68,68,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textAlign: 'left',
          }}
        >
          <AlertTriangle size={14} color="var(--color-danger)" style={{ flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.78rem', color: 'var(--color-danger)', fontWeight: 600 }}>
            This action cannot be undone. The linked expense record will remain.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, gap: 1.5 }}>
        <Box
          component="button"
          onClick={() => !isPending && onClose(false)}
          disabled={isPending}
          sx={{
            flex: 1,
            py: '12px',
            borderRadius: '14px',
            border: '1px solid var(--border-default)',
            cursor: isPending ? 'not-allowed' : 'pointer',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: 700,
            fontFamily: 'var(--font-family-sans)',
            opacity: isPending ? 0.6 : 1,
            transition: 'all 0.2s ease',
            '&:hover': !isPending ? { backgroundColor: 'var(--bg-surface)' } : {},
          }}
        >
          Cancel
        </Box>

        <Box
          component="button"
          onClick={handleConfirm}
          disabled={isPending}
          sx={{
            flex: 1,
            py: '12px',
            borderRadius: '14px',
            border: 'none',
            cursor: isPending ? 'not-allowed' : 'pointer',
            background: isPending
              ? 'rgba(239,68,68,0.4)'
              : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 700,
            fontFamily: 'var(--font-family-sans)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            boxShadow: isPending ? 'none' : '0 6px 18px rgba(239,68,68,0.3)',
            transition: 'all 0.2s ease',
            '&:hover': !isPending ? { transform: 'translateY(-1px)', boxShadow: '0 10px 28px rgba(239,68,68,0.4)' } : {},
          }}
        >
          {isPending ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <>
              <Trash2 size={16} strokeWidth={2.5} />
              Delete
            </>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteInvoiceDialog;
