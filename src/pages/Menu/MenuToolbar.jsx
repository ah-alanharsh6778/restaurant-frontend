import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

export const MenuToolbar = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  categories = [],
  onRefresh,
  onAddMenuItem,
  isRefreshing,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* Search & Filters */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 1.5,
            flexGrow: 1,
            flexWrap: 'wrap',
          }}
        >
          {/* Search Menu Name */}
          <TextField
            size="small"
            placeholder="Search menu item..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 220 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => onSearchChange('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          {/* Category Filter */}
          <TextField
            select
            size="small"
            label="Category"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 180 } }}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Availability Filter */}
          <TextField
            select
            size="small"
            label="Availability"
            value={availabilityFilter}
            onChange={(e) => onAvailabilityFilterChange(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 160 } }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
          </TextField>
        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
          }}
        >
          <Tooltip title="Refresh Menu Data">
            <IconButton
              onClick={onRefresh}
              disabled={isRefreshing}
              color="primary"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <RefreshIcon
                sx={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddMenuItem}
            sx={{ borderRadius: 2, px: 2.5, fontWeight: 700 }}
          >
            Add Menu Item
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default MenuToolbar;
