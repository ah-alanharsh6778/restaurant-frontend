import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export const MenuToolbar = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  startDate = '',
  onStartDateChange,
  endDate = '',
  onEndDateChange,
  categories = [],
  onAddMenuItem,
  onResetFilters,
}) => {
  const isFiltered = Boolean(searchQuery || categoryFilter !== 'ALL' || availabilityFilter !== 'ALL' || startDate || endDate);

  return (
    <Box sx={{ mb: 2.5 }}>
      <Grid container spacing={1.5} sx={{ alignItems: 'center' }}>
        {/* Search Menu Name */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search menu item..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
        </Grid>

        {/* Category Filter */}
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            select
            fullWidth
            size="small"
            label="Category"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Availability Filter */}
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            select
            fullWidth
            size="small"
            label="Availability"
            value={availabilityFilter}
            onChange={(e) => onAvailabilityFilterChange(e.target.value)}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
          </TextField>
        </Grid>

        {/* Start Date */}
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            type="date"
            size="small"
            label="Start Date"
            value={startDate}
            onChange={(e) => onStartDateChange && onStartDateChange(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              '& .MuiInputLabel-root': {
                bgcolor: 'background.paper',
                px: 0.6,
                borderRadius: 1,
              },
            }}
          />
        </Grid>

        {/* End Date */}
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            type="date"
            size="small"
            label="End Date"
            value={endDate}
            onChange={(e) => onEndDateChange && onEndDateChange(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              '& .MuiInputLabel-root': {
                bgcolor: 'background.paper',
                px: 0.6,
                borderRadius: 1,
              },
            }}
          />
        </Grid>

        {/* Right Side Add Icon & Reset Action */}
        <Grid item xs={12} sm={6} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          {isFiltered && onResetFilters && (
            <Tooltip title="Reset Filters">
              <IconButton size="small" onClick={onResetFilters} color="error">
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Add Menu Item">
            <IconButton
              onClick={onAddMenuItem}
              color="primary"
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                width: 40,
                height: 40,
                borderRadius: 2.5,
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MenuToolbar;
