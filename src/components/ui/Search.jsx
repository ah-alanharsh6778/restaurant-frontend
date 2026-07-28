import React, { useState, useEffect } from 'react';
import { Paper, InputBase, IconButton, Box, Chip } from '@mui/material';
import { MdSearch, MdClear } from 'react-icons/md';

/**
 * RestaurantOS Search Component
 * Dedicated search input widget with clear action button, shortcut badge (Ctrl + K), and debounced search callback.
 */
export const Search = ({
  placeholder = 'Search POS items, orders, tables...',
  value,
  onChange,
  onSearch,
  debounceMs = 300,
  shortcut = 'Ctrl + K',
  fullWidth = true,
  sx = {},
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onSearch]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) onChange(e);
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) {
      onChange({ target: { value: '' } });
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 0.8,
        borderRadius: '14px',
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-default)',
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:focus-within': {
          borderColor: 'var(--primary-500)',
          boxShadow: 'var(--shadow-glow-primary)',
          backgroundColor: 'var(--bg-surface)',
        },
        ...sx,
      }}
      {...props}
    >
      <MdSearch size={22} color="var(--text-secondary)" style={{ marginRight: 8, flexShrink: 0 }} />

      <InputBase
        placeholder={placeholder}
        value={internalValue}
        onChange={handleChange}
        sx={{
          flexGrow: 1,
          fontSize: '0.9rem',
          color: 'var(--text-primary)',
        }}
      />

      {internalValue ? (
        <IconButton size="small" onClick={handleClear} sx={{ color: 'var(--text-secondary)', p: 0.5 }}>
          <MdClear size={18} />
        </IconButton>
      ) : (
        shortcut && (
          <Chip
            label={shortcut}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 800,
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subdued)',
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          />
        )
      )}
    </Paper>
  );
};

export default Search;
