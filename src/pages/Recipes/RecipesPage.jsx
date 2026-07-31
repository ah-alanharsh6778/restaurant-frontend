import { useState, useEffect, useCallback, useMemo } from 'react';
import { Paper, Box, Button, Grid, Card, CardContent, Typography, Chip, IconButton, Fab, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { toast } from 'react-toastify';
import recipeService from '../../services/recipe.service';
import menuService from '../../services/menu.service';
import ingredientService from '../../services/ingredient.service';
import PageContainer from '../../components/layout/PageContainer';
import RecipeToolbar from './RecipeToolbar';
import RecipeTable from './RecipeTable';
import RecipeDialog from './RecipeDialog';
import RecipeDetailsDialog from './RecipeDetailsDialog';
import RecipeIngredientDialog from './RecipeIngredientDialog';
import DeleteRecipeDialog from './DeleteRecipeDialog';
import DeleteRecipeIngredientDialog from './DeleteRecipeIngredientDialog';
import EmptyRecipeState from './EmptyRecipeState';
import ErrorState from '../../components/common/ErrorState';
import MobileRecipeFilterDrawer from './MobileRecipeFilterDrawer';

export const RecipesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [recipes, setRecipes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [prepTimeFilter, setPrepTimeFilter] = useState('ALL');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [ingredientDialogOpen, setIngredientDialogOpen] = useState(false);
  const [deleteIngredientDialogOpen, setDeleteIngredientDialogOpen] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedIngredientItem, setSelectedIngredientItem] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [recRes, menuRes, ingRes] = await Promise.all([
        recipeService.getRecipes(),
        menuService.getMenuItems ? menuService.getMenuItems() : menuService.getAllItems(),
        ingredientService.getIngredients ? ingredientService.getIngredients() : ingredientService.getAll(),
      ]);

      const recList = Array.isArray(recRes) ? recRes : recRes?.data || recRes?.recipes || [];
      const mList = Array.isArray(menuRes) ? menuRes : menuRes?.data || menuRes?.items || menuRes?.menuItems || [];
      const iList = Array.isArray(ingRes) ? ingRes : ingRes?.data || ingRes?.ingredients || [];

      setRecipes(recList);
      setMenuItems(mList);
      setIngredientsList(iList);
    } catch (err) {
      const status = err.response?.status;
      const msg =
        err.response?.data?.message ||
        (status === 400 ? 'Bad Request' :
         status === 401 ? 'Unauthorized Access' :
         status === 403 ? 'Access Forbidden' :
         status === 404 ? 'Recipes resource not found' :
         status === 409 ? 'Conflict Error' :
         status === 500 ? 'Internal Server Error' : 'Failed to fetch recipes data');

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered Recipes by Recipe Name & Menu Item
  const filteredRecipes = useMemo(() => {
    if (!searchTerm.trim()) return recipes;
    const term = searchTerm.toLowerCase().trim();
    return recipes.filter((rec) => {
      const nameMatch = rec.name?.toLowerCase().includes(term);
      const menuName = typeof rec.menuItem === 'object' ? rec.menuItem?.name : (rec.menuItemName || '');
      const menuMatch = menuName.toLowerCase().includes(term);
      return nameMatch || menuMatch;
    });
  }, [recipes, searchTerm]);

  // Dialog Open Handlers
  const handleOpenAddDialog = () => {
    setSelectedRecipe(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (recipe) => {
    setSelectedRecipe(recipe);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (recipe) => {
    setSelectedRecipe(recipe);
    setDeleteDialogOpen(true);
  };

  const handleOpenDetailsDialog = async (recipe) => {
    try {
      const res = await recipeService.getRecipeById(recipe.id || recipe._id);
      const detail = res?.data || res || recipe;
      setSelectedRecipe(detail);
    } catch (err) {
      setSelectedRecipe(recipe);
    }
    setDetailsDialogOpen(true);
  };

  const handleOpenAddIngredientDialog = (recipe) => {
    setSelectedRecipe(recipe);
    setIngredientDialogOpen(true);
  };

  const handleOpenRemoveIngredientDialog = (item) => {
    setSelectedIngredientItem(item);
    setDeleteIngredientDialogOpen(true);
  };

  // Recipe CRUD
  const handleSaveRecipe = async (formData) => {
    setSubmitting(true);
    try {
      if (selectedRecipe) {
        const id = selectedRecipe.id || selectedRecipe._id;
        await recipeService.updateRecipe(id, formData);
        toast.success(`Recipe "${formData.name}" updated successfully!`);
      } else {
        await recipeService.createRecipe(formData);
        toast.success(`Recipe "${formData.name}" created successfully!`);
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save recipe';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!selectedRecipe) return;
    setSubmitting(true);
    try {
      const id = selectedRecipe.id || selectedRecipe._id;
      await recipeService.deleteRecipe(id);
      toast.success(`Recipe "${selectedRecipe.name}" deleted!`);
      setDeleteDialogOpen(false);
      setDetailsDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Delete failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Recipe Ingredient CRUD
  const handleAddIngredient = async (ingredientData) => {
    if (!selectedRecipe) return;
    setSubmitting(true);
    try {
      const payload = {
        recipeId: selectedRecipe.id || selectedRecipe._id,
        ingredientId: ingredientData.ingredientId,
        quantity: ingredientData.quantity,
      };
      await recipeService.addIngredient(payload);
      toast.success('Ingredient added to recipe!');
      setIngredientDialogOpen(false);

      // Refresh current recipe details if details dialog is open
      if (detailsDialogOpen) {
        const res = await recipeService.getRecipeById(selectedRecipe.id || selectedRecipe._id);
        if (res?.data) setSelectedRecipe(res.data);
      }

      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to add ingredient to recipe';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveIngredient = async () => {
    if (!selectedIngredientItem) return;
    setSubmitting(true);
    try {
      const id = selectedIngredientItem.id || selectedIngredientItem._id;
      await recipeService.removeIngredient(id);
      toast.success('Ingredient removed from recipe!');
      setDeleteIngredientDialogOpen(false);

      // Refresh current recipe details
      if (selectedRecipe) {
        const res = await recipeService.getRecipeById(selectedRecipe.id || selectedRecipe._id);
        if (res?.data) setSelectedRecipe(res.data);
      }

      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove ingredient';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (error && recipes.length === 0) {
    return (
      <PageContainer title="Recipe Management" breadcrumbs={['Dashboard', 'Recipes']}>
        <ErrorState
          title="Failed to Load Recipes"
          description={error}
          onRetry={fetchData}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Recipe Management"
      breadcrumbs={['Dashboard', 'Recipes']}
      actions={
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog} sx={{ fontWeight: 800, borderRadius: '12px', px: 2.5, backgroundColor: '#7C6CFF' }}>
          Add Recipe
        </Button>
      }
    >
      {/* Mobile Header Filter Trigger */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Recipe Formulas ({filteredRecipes.length})
        </Typography>

        <IconButton
          onClick={() => setMobileFilterOpen(true)}
          sx={{
            color: 'text.primary',
            backgroundColor: isDark ? '#131A24' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '12px',
            p: 1.2,
          }}
        >
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Single Unified Merged Container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: isDark ? '#131A24' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          mb: 4,
          boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <RecipeToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </Box>

        <Box p={{ xs: 2, sm: 3 }}>
          {!loading && filteredRecipes.length === 0 ? (
            <EmptyRecipeState onCreateRecipe={handleOpenAddDialog} />
          ) : viewMode === 'grid' ? (
            <Grid container spacing={2.5}>
              {filteredRecipes.map((recipe) => {
                const menuItemName = typeof recipe.menuItem === 'object' ? recipe.menuItem?.name : (recipe.menuItemName || 'Unlinked');
                const ingredientsCount = recipe.recipeIngredients?.length || recipe.ingredients?.length || 0;
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id || recipe._id}>
                    <Card
                      elevation={0}
                      onClick={() => handleOpenDetailsDialog(recipe)}
                      sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
                            {recipe.name}
                          </Typography>
                          <Chip
                            label={`${ingredientsCount} Items`}
                            size="small"
                            color={ingredientsCount === 0 ? 'warning' : 'secondary'}
                            sx={{ fontWeight: 800 }}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Linked Menu Item: <strong>{menuItemName}</strong>
                        </Typography>

                        {recipe.description && (
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', mb: 1.5 }}>
                            {recipe.description}
                          </Typography>
                        )}

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'space-between',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            pt: 1.5,
                            mt: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Created: {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : '—'}
                          </Typography>
                          <Typography variant="caption" color="primary.main" fontWeight={700}>
                            Tap for Details & Actions →
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <RecipeTable
              recipes={filteredRecipes}
              loading={loading}
              onView={handleOpenDetailsDialog}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
              onAddIngredient={handleOpenAddIngredientDialog}
            />
          )}
        </Box>
      </Paper>

      {/* Dialogs */}
      <RecipeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveRecipe}
        recipe={selectedRecipe}
        menuItems={menuItems}
        loading={submitting}
      />

      <DeleteRecipeDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteRecipe}
        recipe={selectedRecipe}
        loading={submitting}
      />

      <RecipeDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        recipe={selectedRecipe}
        onAddIngredientClick={handleOpenAddIngredientDialog}
        onRemoveIngredientClick={handleOpenRemoveIngredientDialog}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <RecipeIngredientDialog
        open={ingredientDialogOpen}
        onClose={() => setIngredientDialogOpen(false)}
        onSubmit={handleAddIngredient}
        ingredientsList={ingredientsList}
        loading={submitting}
      />

      <DeleteRecipeIngredientDialog
        open={deleteIngredientDialogOpen}
        onClose={() => setDeleteIngredientDialogOpen(false)}
        onConfirm={handleRemoveIngredient}
        recipeIngredient={selectedIngredientItem}
        loading={submitting}
      />

      {/* Mobile Floating Action Button (FAB) */}
      <Fab
        onClick={handleOpenAddDialog}
        aria-label="add recipe"
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: '24px',
          right: '20px',
          zIndex: 1000,
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: '#7C6CFF',
          color: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(124, 108, 255, 0.4)',
          '&:hover': {
            backgroundColor: '#6854FF',
          },
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>

      {/* Mobile Recipe Filter Drawer */}
      <MobileRecipeFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        prepTimeFilter={prepTimeFilter}
        onPrepTimeFilterChange={setPrepTimeFilter}
        onResetFilters={() => setSearchTerm('')}
      />
    </PageContainer>
  );
};

export default RecipesPage;
