/**
 * InvoiceUploadProgress — Animated processing timeline
 * Shows the auto-processing stages from the backend:
 *   Upload → OCR Extraction → AI Parsing → Expense Created
 */
import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, ScanLine, Brain, CheckCircle, XCircle, ReceiptText } from 'lucide-react';

const STAGES = [
  {
    id: 'upload',
    label: 'Uploading File',
    desc: 'Securely transferring invoice to server',
    Icon: UploadCloud,
    color: '#6366F1',
    durationMs: 1200,
  },
  {
    id: 'ocr',
    label: 'OCR Text Extraction',
    desc: 'Reading invoice text with OCR engine',
    Icon: ScanLine,
    color: '#06B6D4',
    durationMs: 1800,
  },
  {
    id: 'ai',
    label: 'AI Data Parsing',
    desc: 'Extracting structured invoice fields with AI',
    Icon: Brain,
    color: '#F59E0B',
    durationMs: 1500,
  },
  {
    id: 'expense',
    label: 'Expense Created',
    desc: 'Invoice linked and expense entry recorded',
    Icon: ReceiptText,
    color: '#10B981',
    durationMs: 600,
  },
];

/**
 * @param {boolean} isProcessing - whether upload mutation is running
 * @param {boolean} isSuccess    - whether upload succeeded
 * @param {boolean} isError      - whether upload failed
 * @param {object}  result       - InvoiceDTO on success
 * @param {string}  errorMsg     - error message on failure
 * @param {number}  uploadProgress - 0-100 upload percentage
 */
const InvoiceUploadProgress = ({
  isProcessing,
  isSuccess,
  isError,
  result,
  errorMsg,
  uploadProgress = 0,
}) => {
  const [activeStage, setActiveStage] = useState(0);
  const [completedStages, setCompletedStages] = useState([]);

  useEffect(() => {
    if (!isProcessing) {
      setActiveStage(0);
      setCompletedStages([]);
      return;
    }
    // Simulate staged progress while backend processes
    let stage = 0;
    const advance = () => {
      if (stage >= STAGES.length - 1) return;
      setCompletedStages((prev) => [...prev, stage]);
      stage++;
      setActiveStage(stage);
      if (stage < STAGES.length - 1) {
        setTimeout(advance, STAGES[stage].durationMs);
      }
    };
    const t = setTimeout(advance, STAGES[0].durationMs);
    return () => clearTimeout(t);
  }, [isProcessing]);

  useEffect(() => {
    if (isSuccess) {
      setCompletedStages(STAGES.map((_, i) => i));
      setActiveStage(STAGES.length);
    }
  }, [isSuccess]);

  if (!isProcessing && !isSuccess && !isError) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      <Box
        sx={{
          mt: 3,
          p: 3,
          borderRadius: '20px',
          border: `1px solid ${isError ? 'rgba(239,68,68,0.25)' : isSuccess ? 'rgba(16,185,129,0.25)' : 'var(--border-subdued)'}`,
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          {isError ? (
            <XCircle size={22} color="var(--color-danger)" />
          ) : isSuccess ? (
            <CheckCircle size={22} color="var(--color-success)" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <ScanLine size={22} color="var(--primary-500)" />
            </motion.div>
          )}
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            {isError ? 'Processing Failed' : isSuccess ? 'Invoice Processed Successfully!' : 'Processing Invoice…'}
          </Typography>
        </Box>

        {/* Progress Bar */}
        {isProcessing && !isSuccess && (
          <LinearProgress
            variant={uploadProgress > 0 && uploadProgress < 100 ? 'determinate' : 'indeterminate'}
            value={uploadProgress}
            sx={{
              mb: 3,
              height: 5,
              borderRadius: 3,
              backgroundColor: 'var(--bg-subtle)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, var(--primary-500), var(--secondary-500))',
                borderRadius: 3,
              },
            }}
          />
        )}

        {/* Stage Timeline */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {STAGES.map((stage, idx) => {
            const isDone = completedStages.includes(idx) || isSuccess;
            const isActive = activeStage === idx && isProcessing && !isSuccess;
            const isPending = !isDone && !isActive;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {/* Step Icon */}
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      backgroundColor: isDone
                        ? 'rgba(16,185,129,0.12)'
                        : isActive
                        ? `${stage.color}15`
                        : 'var(--bg-subtle)',
                      border: `1px solid ${isDone ? 'rgba(16,185,129,0.3)' : isActive ? `${stage.color}40` : 'var(--border-subdued)'}`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isDone ? (
                      <CheckCircle size={16} color="var(--color-success)" strokeWidth={2.5} />
                    ) : (
                      <motion.div
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                      >
                        <stage.Icon
                          size={16}
                          color={isActive ? stage.color : 'var(--text-muted)'}
                          strokeWidth={2}
                        />
                      </motion.div>
                    )}
                  </Box>

                  {/* Step Text */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.84rem',
                        fontWeight: isDone || isActive ? 700 : 500,
                        color: isDone
                          ? 'var(--color-success)'
                          : isActive
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                        lineHeight: 1.2,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {stage.label}
                    </Typography>
                    {(isActive || isDone) && (
                      <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-secondary)', mt: 0.2 }}>
                        {stage.desc}
                      </Typography>
                    )}
                  </Box>

                  {/* Active pulse dot */}
                  {isActive && (
                    <Box sx={{ ml: 'auto' }}>
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: stage.color,
                          }}
                        />
                      </motion.div>
                    </Box>
                  )}
                </Box>
              </motion.div>
            );
          })}
        </Box>

        {/* Success Result Preview */}
        {isSuccess && result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Box
              sx={{
                mt: 2.5,
                p: 2,
                borderRadius: '14px',
                backgroundColor: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-success)', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Extracted Data
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.8 }}>
                {[
                  { label: 'Invoice #', value: result.invoiceNumber },
                  { label: 'Supplier', value: result.supplierName },
                  { label: 'Total', value: result.totalAmount ? `${result.currency} ${Number(result.totalAmount).toLocaleString()}` : '—' },
                  { label: 'Status', value: result.status },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {value || '—'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Error Detail */}
        {isError && errorMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: '12px',
                backgroundColor: 'var(--color-danger-bg)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <Typography sx={{ fontSize: '0.82rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                {errorMsg}
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default InvoiceUploadProgress;
