import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Skeleton,
  Grid,
  Paper,
  Avatar,
  Button,
  IconButton,
  Fab,
  useTheme,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { toast } from 'react-toastify';
import menuService from '../../services/menu.service';
import categoryService from '../../services/category.service';
import MenuToolbar from './MenuToolbar';
import MenuItemTable from './MenuItemTable';
import MenuItemDialog from './MenuItemDialog';
import DeleteMenuItemDialog from './DeleteMenuItemDialog';
import MenuItemDetailsDialog from './MenuItemDetailsDialog';
import MobileMenuFilterDrawer from './MobileMenuFilterDrawer';

import dayjs from 'dayjs';

export const MenuItemsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setAvailabilityFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [itemForDetails, setItemForDetails] = useState(null);

  const fetchData = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [itemsRes, catsRes] = await Promise.all([
        menuService.getMenuItems(),
        categoryService.getCategories(),
      ]);

      const itemsArray = Array.isArray(itemsRes) ? itemsRes : itemsRes?.data || itemsRes?.menuItems || [];
      const catsArray = Array.isArray(catsRes) ? catsRes : catsRes?.data || catsRes?.categories || [];

      setMenuItems(itemsArray);
      setCategories(catsArray);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch menu items';
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
        const [itemsRes, catsRes] = await Promise.all([
          menuService.getMenuItems(),
          categoryService.getCategories(),
        ]);

        if (isMounted) {
          const itemsArray = Array.isArray(itemsRes) ? itemsRes : itemsRes?.data || itemsRes?.menuItems || [];
          const catsArray = Array.isArray(catsRes) ? catsRes : catsRes?.data || catsRes?.categories || [];
          setMenuItems(itemsArray);
          setCategories(catsArray);
        }
      } catch (err) {
        if (isMounted) {
          const message = err.response?.data?.message || err.message || 'Failed to fetch menu items';
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

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Search by Menu Name
      const nameStr = String(item.name || '').toLowerCase();
      const matchesSearch = !searchQuery || nameStr.includes(searchQuery.toLowerCase().trim());

      // Category Filter
      let matchesCat = true;
      if (categoryFilter !== 'ALL') {
        const itemCatId = item.categoryId || item.category?.id;
        matchesCat = String(itemCatId) === String(categoryFilter);
      }

      // Availability Filter
      let matchesAvail = true;
      if (availabilityFilter !== 'ALL') {
        const isAvail = Boolean(item.isAvailable ?? item.available);
        matchesAvail = availabilityFilter === 'AVAILABLE' ? isAvail : !isAvail;
      }

      // Date Range Filter
      let matchesDate = true;
      const created = item.createdAt ? dayjs(item.createdAt) : null;
      if (created) {
        if (startDate && created.isBefore(dayjs(startDate), 'day')) matchesDate = false;
        if (endDate && created.isAfter(dayjs(endDate), 'day')) matchesDate = false;
      }

      return matchesSearch && matchesCat && matchesAvail && matchesDate;
    });
  }, [menuItems, searchQuery, categoryFilter, availabilityFilter, startDate, endDate]);

  const handleOpenAddDialog = () => {
    if (categories.length === 0) {
      toast.warning('Please create at least one category before adding menu items.');
    }
    setSelectedMenuItem(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (item) => {
    setSelectedMenuItem(item);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleOpenDetailsDialog = (item) => {
    setItemForDetails(item);
    setDetailsDialogOpen(true);
  };

  const handleSaveMenuItem = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedMenuItem?.id) {
        await menuService.updateMenuItem(selectedMenuItem.id, formData);
        toast.success(`Menu item "${formData.name}" updated successfully!`);
      } else {
        await menuService.createMenuItem(formData);
        toast.success(`Menu item "${formData.name}" created successfully!`);
      }
      setDialogOpen(false);
      fetchData(true);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to save menu item';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete?.id) return;
    setIsDeleting(true);
    try {
      await menuService.deleteMenuItem(itemToDelete.id);
      toast.success(`Menu item "${itemToDelete.name}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchData(true);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete menu item';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const isSearchOrFilterActive = Boolean(searchQuery || categoryFilter !== 'ALL' || availabilityFilter !== 'ALL' || startDate || endDate);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Mobile Filter Header Trigger */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Menu Items Directory ({filteredMenuItems.length})
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
          boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Desktop Toolbar & Filters */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <MenuToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            availabilityFilter={availabilityFilter}
            onAvailabilityFilterChange={setAvailabilityFilter}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onResetFilters={handleResetFilters}
            categories={categories}
            onRefresh={() => fetchData(true)}
            onAddMenuItem={handleOpenAddDialog}
            isRefreshing={isRefreshing}
          />
        </Box>

        {/* Menu Items List / Loading / Empty State */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {loading ? (
            <Grid container spacing={2}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Grid xs={12} key={item}>
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : filteredMenuItems.length === 0 ? (
            <Box
              sx={{
                p: { xs: 4, sm: 6 },
                textAlign: 'center',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
              }}
            >
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(124, 108, 255, 0.15)', color: '#7C6CFF', mb: 2 }}>
                <RestaurantMenuIcon sx={{ fontSize: 36 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {isSearchOrFilterActive ? 'No Matching Menu Items Found' : 'No Menu Items Available'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
                {isSearchOrFilterActive
                  ? 'Try searching with another item name or adjusting your category/availability filters.'
                  : 'Get started by creating your first restaurant menu item.'}
              </Typography>
              {!isSearchOrFilterActive && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddDialog}
                  sx={{ borderRadius: '12px', fontWeight: 700, backgroundColor: '#7C6CFF' }}
                >
                  Add Menu Item
                </Button>
              )}
            </Box>
          ) : (
            <MenuItemTable
              menuItems={filteredMenuItems}
              onViewDetails={handleOpenDetailsDialog}
              onEditMenuItem={handleOpenEditDialog}
              onDeleteMenuItem={handleOpenDeleteDialog}
              loading={loading}
            />
          )}
        </Box>
      </Paper>

      {/* Mobile Floating Action Button (FAB) */}
      <Fab
        onClick={handleOpenAddDialog}
        aria-label="add menu item"
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

      {/* Mobile Filter Drawer */}
      <MobileMenuFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        availabilityFilter={availabilityFilter}
        onAvailabilityFilterChange={setAvailabilityFilter}
        categories={categories}
        onResetFilters={handleResetFilters}
      />

      {/* Dialogs */}
      <MenuItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveMenuItem}
        categories={categories}
        initialData={selectedMenuItem}
        isSubmitting={isSubmitting}
      />

      <DeleteMenuItemDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        menuItem={itemToDelete}
        isDeleting={isDeleting}
      />

      <MenuItemDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        menuItem={itemForDetails}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />
    </Box>
  );
};

export default MenuItemsPage;
