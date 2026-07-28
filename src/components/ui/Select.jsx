import React from 'react';
import { FormControl, Select as MuiSelect, MenuItem, Box, Typography, Chip, OutlinedInput } from '@mui/material';

/**
 * RestaurantOS Select Component
 * Form select dropdown supporting single/multiple selection, chip tags, clearable options, and glass styling.
 */
export const Select = ({
  label,
  value,
  onChange,
  options = [], // Array of { label, value, color } or strings
  placeholder = 'Select option...',
  multiple = false,
  fullWidth = true,
  disabled = false,
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
            color: 'var(--text-primary)',
            fontSize: '0.8125rem',
          }}
        >
          {label}
        </Typography>
      )}

      <FormControl fullWidth={fullWidth} size={size}>
        <MuiSelect
          multiple={multiple}
          value={value}
          onChange={onChange}
          displayEmpty
          disabled={disabled}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (!selected || (Array.isArray(selected) && selected.length === 0)) {
              return <Typography color="var(--text-muted)" fontSize="0.875rem">{placeholder}</Typography>;
            }

            if (multiple && Array.isArray(selected)) {
              return (
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {selected.map((val) => {
                    const opt = options.find((o) => (typeof o === 'object' ? o.value === val : o === val));
                    const labelText = typeof opt === 'object' ? opt.label : opt || val;
                    return (
                      <Chip
                        key={val}
                        label={labelText}
                        size="small"
                        sx={{ borderRadius: '6px', fontWeight: 700, height: 22, fontSize: '0.75rem' }}
                      />
                    );
                  })}
                </Box>
              );
            }

            const opt = options.find((o) => (typeof o === 'object' ? o.value === selected : o === selected));
            return typeof opt === 'object' ? opt.label : opt || selected;
          }}
          sx={{
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            '& fieldset': {
              borderColor: 'var(--border-default)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--primary-400)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--primary-500)',
            },
            '&.Mui-focused': {
              boxShadow: 'var(--shadow-glow-primary)',
            },
            ...sx,
          }}
          MenuProps={{
            PaperProps: {
              elevation: 0,
              sx: {
                borderRadius: '16px',
                mt: 1,
                p: 0.5,
                backgroundColor: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-subdued)',
                boxShadow: 'var(--shadow-lg)',
              },
            },
          }}
          {...props}
        >
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <MenuItem
                key={optVal}
                value={optVal}
                sx={{
                  py: 1,
                  px: 1.5,
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  '&:hover': { backgroundColor: 'var(--bg-subtle)' },
                  '&.Mui-selected': {
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    fontWeight: 700,
                  },
                }}
              >
                {optLabel}
              </MenuItem>
            );
          })}
        </MuiSelect>
      </FormControl>
    </Box>
  );
};

export default Select;
