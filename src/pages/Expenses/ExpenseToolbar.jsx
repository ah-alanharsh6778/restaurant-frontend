import React from 'react';
import { Box, Button, Paper, InputBase, useTheme } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ExpenseFilters from './ExpenseFilters';

export const ExpenseToolbar = ({
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'ALL',
  onCategoryChange,
  selectedStatus = 'ALL',
  onStatusChange,
  startDate = '',
  onStartDateChange,
  endDate = '',
  onEndDateChange,
  categories = [],
  onOpenUpload,
  onOpenCreateExpense,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        p: '16px 20px',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      {/* Search Input + Filters Bar */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: '6px',
            display: 'flex',
            alignItems: 'center',
            minWidth: { xs: '100%', sm: 280, md: 340 },
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.12)',
            transition: 'all 200ms ease',
            '&:hover, &:focus-within': {
              borderColor: '#7C6CFF',
            },
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search Invoice # or Supplier..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              color: 'text.primary',
              fontWeight: 500,
              '& input::placeholder': { color: 'text.secondary', opacity: 0.8 },
            }}
          />
        </Paper>

        <ExpenseFilters
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
          startDate={startDate}
          onStartDateChange={onStartDateChange}
          endDate={endDate}
          onEndDateChange={onEndDateChange}
          categories={categories}
        />
      </Box>
    </Box>
  );
};

export default ExpenseToolbar;
