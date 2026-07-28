import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

export const RecipeToolbar = ({
  searchTerm = '',
  onSearchChange,
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
          Recipe Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Specify dish recipes, ingredient proportions, and menu item linkings
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
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
          sx={{ minWidth: 260 }}
        />

        <Tooltip title="Refresh Recipes List">
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
          Add Recipe
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeToolbar;
