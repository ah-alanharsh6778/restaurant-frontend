import { useState, useEffect, useCallback, useMemo } from 'react';
import { Paper, Box, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
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

export const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

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
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
            Refresh
          </Button>
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog} sx={{ fontWeight: 700 }}>
            Create Recipe
          </Button>
        </Box>
      }
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3.5,
          overflow: 'hidden',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          mb: 4,
        }}
      >
        <RecipeToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={fetchData}
          onAddClick={handleOpenAddDialog}
          loading={loading}
        />

        <Box p={3}>
          {!loading && filteredRecipes.length === 0 ? (
            <EmptyRecipeState onCreateRecipe={handleOpenAddDialog} />
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
        ingredientItem={selectedIngredientItem}
        loading={submitting}
      />
    </PageContainer>
  );
};

export default RecipesPage;
