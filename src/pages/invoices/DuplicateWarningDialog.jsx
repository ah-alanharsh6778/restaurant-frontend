/**
 * DuplicateWarningDialog — Shown when backend returns HTTP 409 Conflict
 * Backend message: "Duplicate Invoice: Invoice #X from supplier 'Y' already exists."
 */
import React from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Box, Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { AlertTriangle, Copy } from 'lucide-react';

const DuplicateWarningDialog = ({ open, onClose, errorMessage }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          border: '1px solid rgba(245,158,11,0.25)',
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          overflow: 'visible',
        },
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        {/* Warning Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 12px 32px rgba(245,158,11,0.35)',
            }}
          >
            <Copy size={32} color="#fff" strokeWidth={2} />
          </Box>
        </motion.div>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.2rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            mb: 1,
          }}
        >
          Duplicate Invoice Detected
        </Typography>

        <Typography
          sx={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            mb: 2.5,
            lineHeight: 1.6,
          }}
        >
          This invoice has already been uploaded. Duplicate invoices are blocked to prevent double-counting expenses.
        </Typography>

        {/* Backend Error Message */}
        {errorMessage && (
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              backgroundColor: 'var(--color-warning-bg)',
              border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              textAlign: 'left',
              mb: 2,
            }}
          >
            <AlertTriangle size={16} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
            <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {errorMessage}
            </Typography>
          </Box>
        )}

        <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          If this is a different invoice, please verify the invoice number and supplier name, then resubmit.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, justifyContent: 'center' }}>
        <Box
          component="button"
          onClick={onClose}
          sx={{
            px: 4,
            py: '12px',
            borderRadius: '14px',
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 700,
            fontFamily: 'var(--font-family-sans)',
            boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(245,158,11,0.4)' },
          }}
        >
          Understood
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DuplicateWarningDialog;
