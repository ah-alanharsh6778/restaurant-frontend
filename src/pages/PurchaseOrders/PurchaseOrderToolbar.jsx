import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

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
  onRefresh,
  onAddClick,
  loading = false,
}) => {
  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'stretch', lg: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight={800}>
          Purchase Order Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Create raw ingredient procurement orders, track supplier fulfillments, and monitor procurement spend
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
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
          sx={{ minWidth: 240 }}
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
          label="Supplier Filter"
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

        <Tooltip title="Refresh Purchase Orders">
          <span>
            <IconButton onClick={onRefresh} disabled={loading} color="primary">
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          sx={{ py: 0.9, px: 2.5, fontWeight: 800, whiteSpace: 'nowrap', borderRadius: 2.5 }}
        >
          Create PO
        </Button>
      </Box>
    </Box>
  );
};

export default PurchaseOrderToolbar;
