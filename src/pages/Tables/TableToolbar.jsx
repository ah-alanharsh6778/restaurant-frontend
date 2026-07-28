import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const TableToolbar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  capacityFilter,
  onCapacityFilterChange,
}) => {
  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Available', value: 'AVAILABLE' },
    { label: 'Occupied', value: 'OCCUPIED' },
    { label: 'Reserved', value: 'RESERVED' },
    { label: 'Maintenance', value: 'MAINTENANCE' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        {/* Status Filter Chips */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, overflowX: 'auto', py: 0.5 }}>
          {statusOptions.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              onClick={() => onStatusFilterChange(opt.value)}
              color={statusFilter === opt.value ? 'primary' : 'default'}
              variant={statusFilter === opt.value ? 'filled' : 'outlined'}
              size="small"
              sx={{ fontWeight: 800, borderRadius: 1.5, cursor: 'pointer', px: 0.5 }}
            />
          ))}
        </Box>

        {/* Filters & Search Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search Table #..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ width: { xs: '100%', sm: 260 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Capacity Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Min Capacity</InputLabel>
            <Select value={capacityFilter} label="Min Capacity" onChange={(e) => onCapacityFilterChange(e.target.value)}>
              <MenuItem value="ALL">All Capacities</MenuItem>
              <MenuItem value="2">2+ Guests</MenuItem>
              <MenuItem value="4">4+ Guests</MenuItem>
              <MenuItem value="6">6+ Guests</MenuItem>
              <MenuItem value="8">8+ Guests</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default TableToolbar;
