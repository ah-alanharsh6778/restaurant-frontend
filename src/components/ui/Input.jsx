import React from 'react';
import { TextField, Box, Typography, InputAdornment } from '@mui/material';

/**
 * RestaurantOS Input Component
 * Text input field with top label, start/end adornment icons, helper text, error state, glass styling, and focus glow ring.
 */
export const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error = false,
  helperText,
  startIcon,
  endIcon,
  fullWidth = true,
  disabled = false,
  multiline = false,
  rows = 3,
  size = 'medium',
  sx = {},
  ...props
}) => {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', mb: 1 }}>
      {label && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 700,
            mb: 0.8,
            color: error ? 'var(--color-danger)' : 'var(--text-primary)',
            fontSize: '0.8125rem',
          }}
        >
          {label}
        </Typography>
      )}

      <TextField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        disabled={disabled}
        multiline={multiline}
        rows={rows}
        size={size}
        slotProps={{
          input: {
            startAdornment: startIcon ? (
              <InputAdornment position="start" sx={{ color: 'var(--text-secondary)' }}>
                {startIcon}
              </InputAdornment>
            ) : null,
            endAdornment: endIcon ? (
              <InputAdornment position="end" sx={{ color: 'var(--text-secondary)' }}>
                {endIcon}
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'var(--border-default)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--primary-400)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--primary-500)',
              borderWidth: '1.5px',
            },
            '&.Mui-focused': {
              boxShadow: 'var(--shadow-glow-primary)',
            },
          },
          ...sx,
        }}
        {...props}
      />
    </Box>
  );
};

export default Input;
