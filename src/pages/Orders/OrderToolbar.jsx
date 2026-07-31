import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import TableRowsIcon from '@mui/icons-material/TableRows';
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
  viewMode = 'kanban',
  onViewModeChange,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
          Order Operations Center
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Real-time order pipeline with Kanban kitchen queue & tabular records
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {onViewModeChange && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && onViewModeChange(val)}
            size="small"
            sx={{
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9',
              borderRadius: '10px',
              p: '2px',
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '8px',
                px: 1.5,
                py: 0.5,
                fontWeight: 700,
                fontSize: '13px',
                textTransform: 'none',
                color: 'text.secondary',
                '&.Mui-selected': {
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  color: '#7C6CFF',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                },
              },
            }}
          >
            <ToggleButton value="kanban">
              <ViewKanbanIcon sx={{ fontSize: 18, mr: 0.75 }} /> Kanban
            </ToggleButton>
            <ToggleButton value="table">
              <TableRowsIcon sx={{ fontSize: 18, mr: 0.75 }} /> Table
            </ToggleButton>
          </ToggleButtonGroup>
        )}

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
          sx={{ minWidth: 200 }}
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
          label="Table Filter"
          value={tableFilter}
          onChange={(e) => onTableFilterChange(e.target.value)}
          sx={{ minWidth: 130 }}
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
