import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

export const RecipeToolbar = ({
  searchTerm = '',
  onSearchChange,
  onAddClick,
  viewMode = 'list',
  onViewModeChange,
}) => {
  return (
    <Box
      sx={{
        p: 2.5,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Left Side: Recipe File Icon, Title & Search */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon color="primary" sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
              Recipe Book
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dish recipes & ingredient specifications
            </Typography>
          </Box>
        </Box>

        <TextField
          size="small"
          placeholder="Search recipe or menu item..."
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
      </Box>

      {/* Right Side: View Mode Toggle (Card / Table) */}
      {onViewModeChange && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && onViewModeChange(val)}
            size="small"
            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
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

export default RecipeToolbar;
