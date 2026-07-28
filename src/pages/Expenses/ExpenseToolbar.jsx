import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CommonToolbar from '../../components/common/CommonToolbar';
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
}) => {
  const filterControls = (
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
  );

  const actionControls = onRefresh ? (
    <Tooltip title="Refresh Data">
      <IconButton onClick={onRefresh} color="primary" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <RefreshIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ) : null;

  return (
    <CommonToolbar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search Invoice # or Supplier..."
      filters={filterControls}
      actions={actionControls}
    />
  );
};

export default ExpenseToolbar;
