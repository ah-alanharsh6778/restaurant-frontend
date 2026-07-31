import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from '@mui/material';

export const ExpenseFilters = ({
  selectedCategory = 'ALL',
  onCategoryChange,
  selectedStatus = 'ALL',
  onStatusChange,
  startDate = '',
  onStartDateChange,
  endDate = '',
  onEndDateChange,
  categories = [],
}) => {
  const selectSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#131A24',
      color: '#FFFFFF',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
      '&.Mui-focused fieldset': { borderColor: '#7C6CFF' },
    },
    '& .MuiInputLabel-root': { color: '#9CA3AF' },
    '& .MuiSelect-icon': { color: '#9CA3AF' },
  };

  const inputMenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: '#131A24',
        color: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '& .MuiMenuItem-root': {
          '&:hover': { backgroundColor: 'rgba(124, 108, 255, 0.12)' },
          '&.Mui-selected': { backgroundColor: '#7C6CFF', color: '#FFFFFF' },
        },
      },
    },
  };

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
      {/* Category Filter */}
      <FormControl size="small" sx={{ minWidth: 150, ...selectSx }}>
        <InputLabel id="expense-category-filter-label">Category</InputLabel>
        <Select
          labelId="expense-category-filter-label"
          value={selectedCategory}
          label="Category"
          onChange={(e) => onCategoryChange(e.target.value)}
          MenuProps={inputMenuProps}
        >
          <MenuItem value="ALL">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status Filter */}
      <FormControl size="small" sx={{ minWidth: 140, ...selectSx }}>
        <InputLabel id="expense-status-filter-label">Status</InputLabel>
        <Select
          labelId="expense-status-filter-label"
          value={selectedStatus}
          label="Status"
          onChange={(e) => onStatusChange(e.target.value)}
          MenuProps={inputMenuProps}
        >
          <MenuItem value="ALL">All Statuses</MenuItem>
          <MenuItem value="PROCESSED">Processed</MenuItem>
          <MenuItem value="PAID">Paid</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="FAILED">Failed</MenuItem>
        </Select>
      </FormControl>

      {/* Start Date */}
      <TextField
        size="small"
        type="date"
        label="From Date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{
          minWidth: 140,
          ...selectSx,
          '& .MuiInputBase-input': { color: '#FFFFFF' },
        }}
      />

      {/* End Date */}
      <TextField
        size="small"
        type="date"
        label="To Date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{
          minWidth: 140,
          ...selectSx,
          '& .MuiInputBase-input': { color: '#FFFFFF' },
        }}
      />
    </Box>
  );
};

export default ExpenseFilters;
