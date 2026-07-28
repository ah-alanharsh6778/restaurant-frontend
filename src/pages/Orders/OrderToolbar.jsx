import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getCleanTableName } from '../../utils/formatters';

const STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'READY', label: 'Ready' },
  { value: 'SERVED', label: 'Served' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const OrderToolbar = ({
  searchTerm = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusFilterChange,
  tableFilter = 'ALL',
  onTableFilterChange,
  availableTables = [],
}) => {
  return (
    <Box
      sx={{
        p: 2.5,
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
          Order Directory & Filters
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Filter active orders by status, search by order number, or view table assignment
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search order number..."
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
          sx={{ minWidth: 220 }}
        />

        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          sx={{ minWidth: 140 }}
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
          label="Table Filter"
          value={tableFilter}
          onChange={(e) => onTableFilterChange(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="ALL">All Tables</MenuItem>
          {availableTables.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {getCleanTableName(t)}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};

export default OrderToolbar;
