import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
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
  return (
    <>
      {/* Category Filter */}
      <FormControl size="small" sx={{ minWidth: 150, bgcolor: '#FAFBFD' }}>
        <InputLabel id="expense-category-filter-label">Category</InputLabel>
        <Select
          labelId="expense-category-filter-label"
          value={selectedCategory}
          label="Category"
          onChange={(e) => onCategoryChange(e.target.value)}
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
      <FormControl size="small" sx={{ minWidth: 140, bgcolor: '#FAFBFD' }}>
        <InputLabel id="expense-status-filter-label">Status</InputLabel>
        <Select
          labelId="expense-status-filter-label"
          value={selectedStatus}
          label="Status"
          onChange={(e) => onStatusChange(e.target.value)}
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
        sx={{ minWidth: 140, bgcolor: '#FAFBFD' }}
      />

      {/* End Date */}
      <TextField
        size="small"
        type="date"
        label="To Date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 140, bgcolor: '#FAFBFD' }}
      />
    </>
  );
};

export default ExpenseFilters;
