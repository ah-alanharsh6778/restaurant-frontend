import React from 'react';
import { Box, Paper, InputBase, IconButton, useTheme } from '@mui/material';
import { MdSearch, MdClear } from 'react-icons/md';

export const CustomerToolbar = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        width: '100%',
      }}
    >
      {/* Search Input Bar */}
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: '8px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: { xs: '100%', sm: 480, md: 540 },
          borderRadius: '16px',
          backgroundColor: isDark ? '#131A24' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: isDark ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'all 250ms ease',
          '&:hover, &:focus-within': {
            borderColor: '#7C6CFF',
            boxShadow: '0 0 0 3px rgba(124, 108, 255, 0.2)',
          },
        }}
      >
        <MdSearch size={22} style={{ color: isDark ? '#9CA3AF' : '#64748B', marginRight: 10 }} />
        <InputBase
          placeholder="Search by customer name, email, or phone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            flex: 1,
            fontSize: '0.925rem',
            color: 'text.primary',
            fontWeight: 500,
            '& input::placeholder': {
              color: '#9CA3AF',
              opacity: 1,
            },
          }}
        />
        {searchTerm && (
          <IconButton size="small" onClick={onClearSearch} sx={{ color: '#9CA3AF' }}>
            <MdClear size={18} />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
};

export default CustomerToolbar;
