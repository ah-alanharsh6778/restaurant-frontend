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
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'stretch', lg: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      {/* Left Section: Search Input + Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', flexGrow: 1 }}>
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: '6px',
            display: 'flex',
            alignItems: 'center',
            minWidth: { xs: '100%', sm: 260 },
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

      {/* Right Section: Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {onOpenUpload && (
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={onOpenUpload}
            sx={{
              borderRadius: '12px',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
              color: 'text.primary',
              px: 2.2,
              py: 1,
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#7C6CFF',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(124, 108, 255, 0.04)',
              },
            }}
          >
            Upload OCR Invoice
          </Button>
        )}

        {onOpenCreateExpense && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onOpenCreateExpense}
            sx={{
              borderRadius: '12px',
              backgroundColor: '#7C6CFF',
              color: '#FFFFFF',
              px: 2.5,
              py: 1,
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(124, 108, 255, 0.3)',
              '&:hover': {
                backgroundColor: '#6854FF',
              },
            }}
          >
            Create Expense
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ExpenseToolbar;
