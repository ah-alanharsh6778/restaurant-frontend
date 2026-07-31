import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

const STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ORDERED', label: 'Ordered' },
  { value: 'RECEIVED', label: 'Received' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const PurchaseOrderToolbar = ({
  searchTerm = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusFilterChange,
  supplierFilter = 'ALL',
  onSupplierFilterChange,
  availableSuppliers = [],
  viewMode = 'list',
  onViewModeChange,
  onCreatePO,
}) => {
  return (
    <Box
      sx={{
        p: 2.5,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justify: 'space-between',
        gap: 2,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Left Side: Search & Filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', flexGrow: 1 }}>
        <TextField
          size="small"
          placeholder="Search PO number or supplier..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ minWidth: { xs: '100%', sm: 240, md: 280 } }}
        />

        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          sx={{ minWidth: 130 }}
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Supplier"
          value={supplierFilter}
          onChange={(e) => onSupplierFilterChange(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="ALL">All Suppliers</MenuItem>
          {availableSuppliers.map((sup) => (
            <MenuItem key={sup.id || sup._id} value={sup.id || sup._id}>
              {sup.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Right Side: View Mode Toggle */}
      {onViewModeChange && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && onViewModeChange(val)}
            size="small"
            sx={{ bgcolor: 'background.paper', borderRadius: 2, display: { xs: 'none', md: 'inline-flex' } }}
          >
            <ToggleButton value="grid" aria-label="cards view">
              <GridViewIcon fontSize="small" sx={{ mr: 0.5 }} /> Cards View
            </ToggleButton>
            <ToggleButton value="list" aria-label="datagrid view">
              <ViewListIcon fontSize="small" sx={{ mr: 0.5 }} /> DataGrid View
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
    </Box>
  );
};

export default PurchaseOrderToolbar;
