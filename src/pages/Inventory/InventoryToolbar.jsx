import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CommonToolbar from '../../components/common/CommonToolbar';

export const InventoryToolbar = ({
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'ALL',
  onCategoryChange,
  selectedWarehouse = 'ALL',
  onWarehouseChange,
  selectedStatus = 'ALL',
  onStatusChange,
  categories = [],
  warehouses = [],
  onRefresh,
}) => {
  const filterControls = (
    <>
      {/* Category Filter */}
      <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper' }}>
        <InputLabel id="category-filter-label">Category</InputLabel>
        <Select
          labelId="category-filter-label"
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

      {/* Warehouse Filter */}
      <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper' }}>
        <InputLabel id="warehouse-filter-label">Warehouse</InputLabel>
        <Select
          labelId="warehouse-filter-label"
          value={selectedWarehouse}
          label="Warehouse"
          onChange={(e) => onWarehouseChange(e.target.value)}
        >
          <MenuItem value="ALL">All Warehouses</MenuItem>
          {warehouses.map((wh) => (
            <MenuItem key={wh.id} value={wh.id}>
              {wh.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status Filter */}
      <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'background.paper' }}>
        <InputLabel id="status-filter-label">Stock Status</InputLabel>
        <Select
          labelId="status-filter-label"
          value={selectedStatus}
          label="Stock Status"
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <MenuItem value="ALL">All Statuses</MenuItem>
          <MenuItem value="IN_STOCK">In Stock</MenuItem>
          <MenuItem value="LOW_STOCK">Low Stock</MenuItem>
          <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
        </Select>
      </FormControl>
    </>
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
      searchPlaceholder="Search SKU or Product Name..."
      filters={filterControls}
      actions={actionControls}
    />
  );
};

export default InventoryToolbar;
