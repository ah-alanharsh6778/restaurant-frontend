import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Drawer,
  Typography,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';

export const TableToolbar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  capacityFilter,
  onCapacityFilterChange,
  viewMode = 'grid',
  onViewModeChange,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Available', value: 'AVAILABLE' },
    { label: 'Occupied', value: 'OCCUPIED' },
    { label: 'Reserved', value: 'RESERVED' },
    { label: 'Maintenance', value: 'MAINTENANCE' },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '64px',
        backgroundColor: isDark ? '#131A24' : '#FFFFFF',
        borderRadius: '20px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: isDark ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.05)',
        px: '24px',
        py: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        boxSizing: 'border-box',
      }}
    >
      {/* Left: Search Input */}
      <TextField
        size="small"
        placeholder="Search Table #..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          width: { xs: '100%', sm: 240, md: 280 },
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            transition: 'all 200ms ease',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.18)' },
            '&.Mui-focused fieldset': { borderColor: '#7C6CFF', borderWidth: '1px' },
          },
          '& .MuiInputBase-input': { color: '#FFFFFF', fontSize: '14px', fontWeight: 500 },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9CA3AF', fontSize: 18 }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Middle: Status Filter Chips */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 1,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {statusOptions.map((opt) => {
          const isSelected = statusFilter === opt.value;
          return (
            <Chip
              key={opt.value}
              label={opt.label}
              onClick={() => onStatusFilterChange(opt.value)}
              sx={{
                fontWeight: isSelected ? 700 : 500,
                fontSize: '13px',
                height: '34px',
                borderRadius: '10px',
                cursor: 'pointer',
                px: 1,
                bgcolor: isSelected ? '#7C6CFF' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#FFFFFF' : '#9CA3AF',
                border: '1px solid',
                borderColor: isSelected ? '#7C6CFF' : 'rgba(255, 255, 255, 0.06)',
                transition: 'all 200ms ease',
                '&:hover': {
                  bgcolor: isSelected ? '#6854FF' : 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                },
              }}
            />
          );
        })}
      </Box>

      {/* Right: Capacity Select & View Mode Toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: { xs: 0, md: 'auto' } }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={capacityFilter}
            onChange={(e) => onCapacityFilterChange(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 500,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.08)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.18)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7C6CFF', borderWidth: '1px' },
              '& .MuiSvgIcon-root': { color: '#9CA3AF' },
            }}
          >
            <MenuItem value="ALL">All Capacities</MenuItem>
            <MenuItem value="2">2+ Guests</MenuItem>
            <MenuItem value="4">4+ Guests</MenuItem>
            <MenuItem value="6">6+ Guests</MenuItem>
            <MenuItem value="8">8+ Guests</MenuItem>
          </Select>
        </FormControl>

        {onViewModeChange && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && onViewModeChange(val)}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              p: '2px',
              display: { xs: 'none', sm: 'inline-flex' },
              '& .MuiToggleButton-root': {
                color: '#9CA3AF',
                border: 'none',
                borderRadius: '10px',
                px: 1.5,
                py: 0.5,
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'none',
                '&.Mui-selected': {
                  backgroundColor: '#7C6CFF',
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#6854FF' },
                },
              },
            }}
          >
            <ToggleButton value="grid">
              <GridViewIcon sx={{ fontSize: 16, mr: 0.5 }} /> Grid
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon sx={{ fontSize: 16, mr: 0.5 }} /> List
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>
    </Box>
  );
};

// Mobile Bottom Sheet Filter Drawer
export const MobileTableFilterDrawer = ({
  open,
  onClose,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  capacityFilter,
  onCapacityFilterChange,
  viewMode,
  onViewModeChange,
  onReset,
}) => {
  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Available', value: 'AVAILABLE' },
    { label: 'Occupied', value: 'OCCUPIED' },
    { label: 'Reserved', value: 'RESERVED' },
    { label: 'Maintenance', value: 'MAINTENANCE' },
  ];

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          backgroundColor: '#131A24',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          px: 3,
          py: 3,
          color: '#FFFFFF',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '18px', color: '#FFFFFF' }}>
          Filter Tables
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#9CA3AF' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Search */}
        <Box>
          <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, mb: 1, display: 'block' }}>
            SEARCH TABLE
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search Table #..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
              },
              '& .MuiInputBase-input': { color: '#FFFFFF' },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9CA3AF', fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Status Filter */}
        <Box>
          <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, mb: 1, display: 'block' }}>
            STATUS FILTER
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {statusOptions.map((opt) => {
              const isSelected = statusFilter === opt.value;
              return (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  onClick={() => onStatusFilterChange(opt.value)}
                  sx={{
                    fontWeight: isSelected ? 700 : 500,
                    bgcolor: isSelected ? '#7C6CFF' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#FFFFFF' : '#9CA3AF',
                    border: '1px solid',
                    borderColor: isSelected ? '#7C6CFF' : 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Capacity Filter */}
        <Box>
          <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, mb: 1, display: 'block' }}>
            MIN CAPACITY
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={capacityFilter}
              onChange={(e) => onCapacityFilterChange(e.target.value)}
              sx={{
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                '& .MuiSvgIcon-root': { color: '#9CA3AF' },
              }}
            >
              <MenuItem value="ALL">All Capacities</MenuItem>
              <MenuItem value="2">2+ Guests</MenuItem>
              <MenuItem value="4">4+ Guests</MenuItem>
              <MenuItem value="6">6+ Guests</MenuItem>
              <MenuItem value="8">8+ Guests</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* View Options */}
        {onViewModeChange && (
          <Box>
            <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, mb: 1, display: 'block' }}>
              VIEW MODE
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, val) => val && onViewModeChange(val)}
              fullWidth
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
                p: '2px',
                '& .MuiToggleButton-root': {
                  color: '#9CA3AF',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  '&.Mui-selected': { backgroundColor: '#7C6CFF', color: '#FFFFFF' },
                },
              }}
            >
              <ToggleButton value="grid">Grid View</ToggleButton>
              <ToggleButton value="list">List View</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange('ALL');
              onCapacityFilterChange('ALL');
            }}
            fullWidth
            sx={{
              borderRadius: '12px',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              py: 1.2,
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            fullWidth
            sx={{
              borderRadius: '12px',
              backgroundColor: '#7C6CFF',
              color: '#FFFFFF',
              fontWeight: 700,
              py: 1.2,
              '&:hover': { backgroundColor: '#6854FF' },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default TableToolbar;