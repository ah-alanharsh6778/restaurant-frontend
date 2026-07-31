import React from 'react';
import { Box, Button, IconButton, Tooltip, Paper, InputBase } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
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
  onRefresh,
  onOpenUpload,
  onExportExcel,
  onOpenCreateExpense,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: '16px 20px',
        mb: 3,
        borderRadius: '20px',
        backgroundColor: '#131A24',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'stretch', lg: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
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
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 200ms ease',
            '&:hover, &:focus-within': {
              borderColor: '#7C6CFF',
            },
          }}
        >
          <SearchIcon sx={{ color: '#9CA3AF', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search Invoice # or Supplier..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              color: '#FFFFFF',
              fontWeight: 500,
              '& input::placeholder': { color: '#9CA3AF', opacity: 1 },
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
        {onRefresh && (
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={onRefresh}
              sx={{
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                p: 1.2,
                transition: 'all 200ms ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: '#7C6CFF',
                },
              }}
            >
              <RefreshIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        )}

        {onOpenUpload && (
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={onOpenUpload}
            sx={{
              borderRadius: '12px',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              color: '#FFFFFF',
              px: 2.2,
              py: 1,
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#7C6CFF',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            Upload OCR Invoice
          </Button>
        )}

        {onExportExcel && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExportExcel}
            sx={{
              borderRadius: '12px',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              color: '#FFFFFF',
              px: 2.2,
              py: 1,
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#10B981',
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
              },
            }}
          >
            Export Excel
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
    </Paper>
  );
};

export default ExpenseToolbar;
