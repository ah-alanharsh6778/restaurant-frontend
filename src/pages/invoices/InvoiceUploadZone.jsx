/**
 * InvoiceUploadZone — Drag & Drop upload component
 *
 * Validates file type and size client-side before calling backend.
 * Accepted: PDF, PNG, JPG, JPEG — max 10 MB (matching multer config)
 * On submit: calls POST /api/invoices/upload via useUploadInvoice mutation.
 * On 409: triggers onDuplicate callback with error details.
 */
import React, { useCallback, useState, useRef } from 'react';
import { Box, Typography, LinearProgress, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useUploadInvoice } from '../../hooks/useInvoices';

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
const ACCEPTED_EXT = ['.pdf', '.png', '.jpg', '.jpeg'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const InvoiceUploadZone = ({ onSuccess, onDuplicate, onError }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutate: uploadInvoice, isPending: isUploading, isSuccess } = useUploadInvoice();

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXT.includes(ext)) {
      return 'Invalid file type. Only PDF, PNG, JPG, and JPEG are allowed.';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File too large. Maximum size is ${MAX_SIZE_MB} MB.`;
    }
    return null;
  };

  const handleFile = useCallback((file) => {
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      setSelectedFile(null);
      return;
    }
    setValidationError('');
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = () => setDragActive(false);

  const handleBrowse = () => inputRef.current?.click();

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setValidationError('');
    setUploadProgress(0);
  };

  const handleUpload = () => {
    if (!selectedFile || isUploading) return;
    setUploadProgress(0);

    uploadInvoice(
      {
        file: selectedFile,
        onUploadProgress: (event) => {
          const pct = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(pct);
        },
      },
      {
        onSuccess: (data) => {
          setSelectedFile(null);
          setUploadProgress(0);
          onSuccess?.(data?.data);
        },
        onError: (err) => {
          if (err?.status === 409) {
            onDuplicate?.(err);
          } else {
            onError?.(err);
          }
          setUploadProgress(0);
        },
      }
    );
  };

  return (
    <Box>
      {/* Drop Zone */}
      <motion.div
        animate={dragActive ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!selectedFile ? handleBrowse : undefined}
          sx={{
            border: `2px dashed ${dragActive ? 'var(--primary-500)' : validationError ? 'var(--color-danger)' : 'var(--border-default)'}`,
            borderRadius: '20px',
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            cursor: selectedFile ? 'default' : 'pointer',
            backgroundColor: dragActive
              ? 'rgba(99,102,241,0.04)'
              : 'var(--bg-subtle)',
            transition: 'all 0.2s ease',
            '&:hover': !selectedFile ? {
              borderColor: 'var(--primary-500)',
              backgroundColor: 'rgba(99,102,241,0.04)',
            } : {},
            minHeight: 220,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />

          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ textAlign: 'center' }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '18px',
                    background: dragActive
                      ? 'linear-gradient(135deg, var(--primary-600), var(--primary-800))'
                      : 'var(--bg-surface)',
                    border: '1px solid var(--border-subdued)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: dragActive ? 'var(--shadow-glow-primary)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <UploadCloud
                    size={28}
                    color={dragActive ? '#fff' : 'var(--primary-500)'}
                    strokeWidth={1.8}
                  />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', mb: 0.5 }}>
                  {dragActive ? 'Drop your invoice here' : 'Drag & drop invoice file'}
                </Typography>
                <Typography sx={{ fontSize: '0.83rem', color: 'var(--text-secondary)', mb: 1.5 }}>
                  or{' '}
                  <Box component="span" sx={{ color: 'var(--primary-500)', fontWeight: 700, cursor: 'pointer' }}>
                    browse files
                  </Box>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {ACCEPTED_EXT.map((ext) => (
                    <Box
                      key={ext}
                      sx={{
                        px: 1.5,
                        py: 0.4,
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subdued)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      {ext}
                    </Box>
                  ))}
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.4,
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subdued)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                    }}
                  >
                    max {MAX_SIZE_MB}MB
                  </Box>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ width: '100%', maxWidth: 420 }}
              >
                <Box
                  sx={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subdued)',
                    borderRadius: '16px',
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={20} color="#fff" strokeWidth={2} />
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mb: 0.3,
                      }}
                    >
                      {selectedFile.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      {formatFileSize(selectedFile.size)} •{' '}
                      {selectedFile.type.split('/')[1]?.toUpperCase()}
                    </Typography>
                    {isUploading && (
                      <Box sx={{ mt: 1.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'var(--bg-subtle)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, var(--primary-500), var(--secondary-500))',
                              borderRadius: 3,
                            },
                          }}
                        />
                        <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-secondary)', mt: 0.5 }}>
                          Uploading… {uploadProgress}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {!isUploading && (
                    <Box
                      component="button"
                      onClick={handleRemove}
                      sx={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        p: 0.5,
                        borderRadius: '8px',
                        color: 'var(--text-muted)',
                        flexShrink: 0,
                        '&:hover': { color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-bg)' },
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <X size={16} />
                    </Box>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>

      {/* Validation Error */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                borderRadius: '12px',
                backgroundColor: 'var(--color-danger-bg)',
                border: '1px solid rgba(239,68,68,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AlertCircle size={16} color="var(--color-danger)" />
              <Typography sx={{ fontSize: '0.82rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                {validationError}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      {selectedFile && !isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            component="button"
            onClick={handleUpload}
            sx={{
              mt: 2,
              width: '100%',
              py: '14px',
              px: 3,
              borderRadius: '14px',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'var(--font-family-sans)',
              boxShadow: 'var(--shadow-glow-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(99,102,241,0.45)',
              },
              '&:active': { transform: 'translateY(0)' },
            }}
          >
            <UploadCloud size={20} strokeWidth={2} />
            Upload & Process Invoice
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default InvoiceUploadZone;
