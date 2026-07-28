import React from 'react';
import { Box, Paper, InputBase, IconButton } from '@mui/material';
import { MdSearch, MdClear } from 'react-icons/md';

export const CustomerToolbar = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      mb={3}
    >
      {/* Search Input Bar */}
      <Paper
        elevation={0}
        className="glass-panel"
        sx={{
          p: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1,
          maxWidth: { sm: 380, md: 440 },
          borderRadius: '16px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subdued)',
          transition: 'all 0.2s ease',
          '&:hover, &:focus-within': {
            borderColor: 'var(--primary-400)',
            boxShadow: '0 0 0 3px var(--primary-100)',
          },
        }}
      >
        <MdSearch size={22} style={{ color: 'var(--text-secondary)', marginRight: 8 }} />
        <InputBase
          placeholder="Search by customer name, email, or phone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-primary)' }}
        />
        {searchTerm && (
          <IconButton size="small" onClick={onClearSearch} sx={{ color: 'var(--text-secondary)' }}>
            <MdClear size={18} />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
};

export default CustomerToolbar;
