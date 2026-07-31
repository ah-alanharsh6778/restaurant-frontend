import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Button,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export const MobilePurchaseOrderFilterDrawer = ({
  open,
  onClose,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  supplierFilter,
  onSupplierFilterChange,
  suppliers = [],
  onResetFilters,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Pending Approval', value: 'PENDING_APPROVAL' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Partially Received', value: 'PARTIALLY_RECEIVED' },
    { label: 'Fully Received', value: 'RECEIVED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      disableRestoreFocus
      ModalProps={{
        disableRestoreFocus: true,
      }}
      PaperProps={{
        sx: {
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          backgroundImage: 'none',
          p: 3,
          maxHeight: '85vh',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Drawer Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: 'rgba(124, 108, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: '#7C6CFF', fontWeight: 800, fontSize: '14px' }}>📑</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Filter Purchase Orders
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search Field */}
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, display: 'block' }}>
            SEARCH PO NUMBER OR VENDOR
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search PO # or vendor..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Status Filter Chips */}
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, display: 'block' }}>
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
                    bgcolor: isSelected ? '#7C6CFF' : isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    color: isSelected ? '#FFFFFF' : 'text.primary',
                    borderRadius: '10px',
                    px: 1,
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Supplier Selector */}
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, display: 'block' }}>
            SUPPLIER / VENDOR
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={supplierFilter}
              onChange={(e) => onSupplierFilterChange(e.target.value)}
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="ALL">All Suppliers</MenuItem>
              {suppliers.map((sup) => (
                <MenuItem key={sup.id || sup._id} value={sup.id || sup._id}>
                  {sup.name || sup.companyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={() => {
              onResetFilters && onResetFilters();
              onClose();
            }}
            sx={{ borderRadius: '12px', py: 1.2, fontWeight: 700, textTransform: 'none' }}
          >
            Reset
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
            sx={{
              borderRadius: '12px',
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#7C6CFF',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(124, 108, 255, 0.35)',
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobilePurchaseOrderFilterDrawer;
