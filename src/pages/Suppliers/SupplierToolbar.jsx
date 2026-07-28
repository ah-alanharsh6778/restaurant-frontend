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

export const SupplierToolbar = ({
  searchTerm = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusFilterChange,
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
          Supplier Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage raw food suppliers, contact representatives, GST numbers, and vendor profiles
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search by name, email, phone..."
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
          sx={{ minWidth: 260 }}
        />

        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="ALL">All Statuses</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
        </TextField>

        <Tooltip title="Refresh Suppliers List">
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
          Add Supplier
        </Button>
      </Box>
    </Box>
  );
};

export default SupplierToolbar;
