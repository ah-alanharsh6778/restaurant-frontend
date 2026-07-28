import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const IngredientToolbar = ({
  searchTerm = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusFilterChange,
  unitFilter = 'ALL',
  onUnitFilterChange,
  availableUnits = [],
  lowStockOnly = false,
  onLowStockToggle,
}) => {
  return (
    <Box
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 1.5,
        flexWrap: 'wrap',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <TextField
        size="small"
        placeholder="Search by ingredient name..."
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
        <MenuItem value="ALL">All Status</MenuItem>
        <MenuItem value="ACTIVE">Active</MenuItem>
        <MenuItem value="INACTIVE">Inactive</MenuItem>
      </TextField>

      {onUnitFilterChange && (
        <TextField
          select
          size="small"
          label="Unit"
          value={unitFilter}
          onChange={(e) => onUnitFilterChange(e.target.value)}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="ALL">All Units</MenuItem>
          {availableUnits.map((u) => (
            <MenuItem key={u} value={u}>
              {u}
            </MenuItem>
          ))}
        </TextField>
      )}

      <Button
        variant={lowStockOnly ? 'contained' : 'outlined'}
        color="warning"
        size="small"
        startIcon={<WarningAmberIcon fontSize="small" />}
        onClick={onLowStockToggle}
        sx={{
          py: 0.8,
          px: 2,
          fontWeight: 800,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '0.85rem',
          ...(lowStockOnly
            ? {
                bgcolor: 'warning.main',
                color: 'warning.contrastText',
                boxShadow: '0 2px 8px rgba(237, 108, 2, 0.35)',
              }
            : {
                borderColor: 'warning.main',
                color: 'warning.main',
                '&:hover': {
                  bgcolor: 'warning.50',
                  borderColor: 'warning.dark',
                },
              }),
        }}
      >
        {lowStockOnly ? 'Showing Low Stock Only' : 'Filter Low Stock Alert'}
      </Button>
    </Box>
  );
};

export default IngredientToolbar;
