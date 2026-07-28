import { useState, useEffect, useCallback, useMemo } from 'react';
import { Paper, Box, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import ingredientService from '../../services/ingredient.service';
import PageContainer from '../../components/layout/PageContainer';
import IngredientToolbar from './IngredientToolbar';
import IngredientTable from './IngredientTable';
import IngredientDialog from './IngredientDialog';
import DeleteIngredientDialog from './DeleteIngredientDialog';
import IngredientDetailsDialog from './IngredientDetailsDialog';
import EmptyIngredientState from './EmptyIngredientState';
import ErrorState from '../../components/common/ErrorState';

export const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ingredientService.getIngredients();
      const list = Array.isArray(response)
        ? response
        : response?.data || response?.ingredients || [];
      setIngredients(list);
    } catch (err) {
      const status = err.response?.status;
      const msg =
        err.response?.data?.message ||
        (status === 400 ? 'Bad Request' :
         status === 401 ? 'Unauthorized Access' :
         status === 403 ? 'Access Forbidden' :
         status === 404 ? 'Ingredients resource not found' :
         status === 409 ? 'Conflict Error' :
         status === 500 ? 'Internal Server Error' : 'Failed to load ingredients');

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  // Extract unique units for unit filter dropdown
  const availableUnits = useMemo(() => {
    const units = ingredients.map((ing) => ing.unit).filter(Boolean);
    return Array.from(new Set(units));
  }, [ingredients]);

  // Filtered Ingredients
  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      // Search by name
      const matchesSearch =
        !searchTerm.trim() ||
        ing.name?.toLowerCase().includes(searchTerm.toLowerCase().trim());

      // Filter by Status (Active / Inactive)
      const isActive = ing.isActive !== undefined ? ing.isActive : ing.status !== 'INACTIVE';
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && isActive) ||
        (statusFilter === 'INACTIVE' && !isActive);

      // Filter by Unit
      const matchesUnit = unitFilter === 'ALL' || ing.unit === unitFilter;

      // Filter Low Stock
      const qty = Number(ing.quantity !== undefined ? ing.quantity : 0);
      const min = Number(ing.minimumStock !== undefined ? ing.minimumStock : (ing.minStock || 0));
      const isLow = qty <= min;
      const matchesLowStock = !lowStockOnly || isLow;

      return matchesSearch && matchesStatus && matchesUnit && matchesLowStock;
    });
  }, [ingredients, searchTerm, statusFilter, unitFilter, lowStockOnly]);

  // Dialog Handlers
  const handleOpenAddDialog = () => {
    setSelectedIngredient(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (ing) => {
    setSelectedIngredient(ing);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (ing) => {
    setSelectedIngredient(ing);
    setDeleteDialogOpen(true);
  };

  const handleOpenDetailsDialog = async (ing) => {
    try {
      const res = await ingredientService.getIngredientById(ing.id || ing._id);
      const detail = res?.data || res || ing;
      setSelectedIngredient(detail);
    } catch (err) {
      setSelectedIngredient(ing);
    }
    setDetailsDialogOpen(true);
  };

  // CRUD Handlers
  const handleSaveIngredient = async (formData) => {
    setSubmitting(true);
    try {
      if (selectedIngredient) {
        const id = selectedIngredient.id || selectedIngredient._id;
        await ingredientService.updateIngredient(id, formData);
        toast.success(`Ingredient ${formData.name} updated successfully!`);
      } else {
        await ingredientService.createIngredient(formData);
        toast.success(`Ingredient ${formData.name} created successfully!`);
      }
      setDialogOpen(false);
      fetchIngredients();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteIngredient = async () => {
    if (!selectedIngredient) return;
    setSubmitting(true);
    try {
      const id = selectedIngredient.id || selectedIngredient._id;
      await ingredientService.deleteIngredient(id);
      toast.success(`Ingredient ${selectedIngredient.name} deleted!`);
      setDeleteDialogOpen(false);
      fetchIngredients();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Delete failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (error && ingredients.length === 0) {
    return (
      <PageContainer title="Ingredient Management" breadcrumbs={['Dashboard', 'Ingredients']}>
        <ErrorState
          title="Failed to Load Ingredients"
          description={error}
          onRetry={fetchIngredients}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Ingredient Management"
      breadcrumbs={['Dashboard', 'Ingredients']}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchIngredients}>
            Refresh
          </Button>
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog} sx={{ fontWeight: 700 }}>
            Add Ingredient
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
        <IngredientToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          unitFilter={unitFilter}
          onUnitFilterChange={setUnitFilter}
          availableUnits={availableUnits}
          lowStockOnly={lowStockOnly}
          onLowStockToggle={() => setLowStockOnly(!lowStockOnly)}
        />

        <Box p={3}>
          {!loading && filteredIngredients.length === 0 ? (
            <EmptyIngredientState onCreateIngredient={handleOpenAddDialog} />
          ) : (
            <IngredientTable
              ingredients={filteredIngredients}
              loading={loading}
              onView={handleOpenDetailsDialog}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
            />
          )}
        </Box>
      </Paper>

      {/* Dialogs */}
      <IngredientDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveIngredient}
        ingredient={selectedIngredient}
        loading={submitting}
      />

      <DeleteIngredientDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteIngredient}
        ingredient={selectedIngredient}
        loading={submitting}
      />

      <IngredientDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        ingredient={selectedIngredient}
      />
    </PageContainer>
  );
};

export default IngredientsPage;
