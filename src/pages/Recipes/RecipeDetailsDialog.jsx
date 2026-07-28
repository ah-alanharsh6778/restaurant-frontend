import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Grid,
  Chip,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import RecipeIngredientsTable from './RecipeIngredientsTable';

export const RecipeDetailsDialog = ({
  open,
  onClose,
  recipe = null,
  onAddIngredientClick,
  onRemoveIngredientClick,
}) => {
  if (!recipe) return null;

  const menuItemName = typeof recipe.menuItem === 'object' ? recipe.menuItem?.name : (recipe.menuItemName || 'Unlinked Menu Item');
  const menuItemPrice = typeof recipe.menuItem === 'object' && recipe.menuItem?.price ? `$${Number(recipe.menuItem.price).toFixed(2)}` : '';
  const ingredients = recipe.recipeIngredients || recipe.ingredients || [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Recipe Details Specification
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
          <Paper
            elevation={2}
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MenuBookIcon sx={{ fontSize: 32 }} />
          </Paper>

          <Box>
            <Typography variant="h5" fontWeight={800}>
              {recipe.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={`Linked to: ${menuItemName} ${menuItemPrice}`}
                color="primary"
                size="small"
                sx={{ fontWeight: 800 }}
              />
              <Chip
                label={`${ingredients.length} Ingredients`}
                color="secondary"
                size="small"
                sx={{ fontWeight: 800 }}
              />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              RECIPE NAME
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {recipe.name}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              LINKED MENU ITEM
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {menuItemName} {menuItemPrice}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              DESCRIPTION / INSTRUCTIONS
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {recipe.description || 'No description or preparation notes provided.'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              CREATED DATE
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {recipe.createdAt ? new Date(recipe.createdAt).toLocaleString() : '—'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              UPDATED DATE
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {recipe.updatedAt ? new Date(recipe.updatedAt).toLocaleString() : '—'}
            </Typography>
          </Grid>
        </Grid>

        {/* Ingredients Sub-Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>
            Recipe Ingredients ({ingredients.length})
          </Typography>

          {onAddIngredientClick && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => onAddIngredientClick(recipe)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Add Ingredient
            </Button>
          )}
        </Box>

        <RecipeIngredientsTable
          recipeIngredients={ingredients}
          onRemoveIngredient={onRemoveIngredientClick}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="contained" sx={{ px: 3, fontWeight: 800 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeDetailsDialog;
