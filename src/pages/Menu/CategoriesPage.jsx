import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Skeleton,
  Grid,
  Paper,
  Avatar,
  Button,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import categoryService from '../../services/category.service';
import CategoryToolbar from './CategoryToolbar';
import CategoryTable from './CategoryTable';
import CategoryDialog from './CategoryDialog';
import DeleteCategoryDialog from './DeleteCategoryDialog';
import CategoryDetailsDialog from './CategoryDetailsDialog';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [categoryForDetails, setCategoryForDetails] = useState(null);

  const fetchCategories = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await categoryService.getCategories();
      const catArray = Array.isArray(data) ? data : data?.data || data?.categories || [];
      setCategories(catArray);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch categories';
      toast.error(message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setLoading(true);
      try {
        const data = await categoryService.getCategories();
        if (isMounted) {
          const catArray = Array.isArray(data) ? data : data?.data || data?.categories || [];
          setCategories(catArray);
        }
      } catch (err) {
        if (isMounted) {
          const message = err.response?.data?.message || err.message || 'Failed to fetch categories';
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const nameStr = String(cat.name || '').toLowerCase();
      return !searchQuery || nameStr.includes(searchQuery.toLowerCase().trim());
    });
  }, [categories, searchQuery]);

  const handleOpenAddDialog = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (cat) => {
    setSelectedCategory(cat);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (cat) => {
    setCategoryToDelete(cat);
    setDeleteDialogOpen(true);
  };

  const handleOpenDetailsDialog = (cat) => {
    setCategoryForDetails(cat);
    setDetailsDialogOpen(true);
  };

  const handleSaveCategory = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedCategory?.id) {
        await categoryService.updateCategory(selectedCategory.id, formData);
        toast.success(`Category "${formData.name}" updated successfully!`);
      } else {
        await categoryService.createCategory(formData);
        toast.success(`Category "${formData.name}" created successfully!`);
      }
      setDialogOpen(false);
      fetchCategories(true);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to save category';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete?.id) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      toast.success(`Category "${categoryToDelete.name}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories(true);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete category';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Toolbar */}
      <CategoryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => fetchCategories(true)}
        onAddCategory={handleOpenAddDialog}
        isRefreshing={isRefreshing}
      />

      {/* Categories List / Loading / Empty State */}
      {loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} key={item}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredCategories.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: { xs: 4, sm: 6 },
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
          }}
        >
          <Avatar sx={{ width: 64, height: 64, bgcolor: '#F1F5F9', color: 'primary.main', mb: 2 }}>
            <CategoryIcon sx={{ fontSize: 36 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {searchQuery ? 'No Matching Categories Found' : 'No Categories Available'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
            {searchQuery
              ? 'Try searching with another category name.'
              : 'Get started by creating your first menu category (e.g. Starters, Main Course, Drinks).'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Add Category
            </Button>
          )}
        </Paper>
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onViewDetails={handleOpenDetailsDialog}
          onEditCategory={handleOpenEditDialog}
          onDeleteCategory={handleOpenDeleteDialog}
          loading={loading}
        />
      )}

      {/* Dialogs */}
      <CategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveCategory}
        initialData={selectedCategory}
        isSubmitting={isSubmitting}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        category={categoryToDelete}
        isDeleting={isDeleting}
      />

      <CategoryDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        category={categoryForDetails}
      />
    </Box>
  );
};

export default CategoriesPage;
