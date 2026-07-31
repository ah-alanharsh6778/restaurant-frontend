import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Fab,
  Typography,
  useTheme,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { toast } from 'react-toastify';

import PageContainer from '../../layout/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import inventoryService from '../../services/inventory.service';

import StockSummaryCards from './StockSummaryCards';
import InventoryToolbar from './InventoryToolbar';
import ProductsPage from './ProductsPage';
import ProductCategoriesPage from './ProductCategoriesPage';
import WarehousesPage from './WarehousesPage';
import StockHistoryPage from './StockHistoryPage';

import ProductDialog from './ProductDialog';
import CategoryDialog from './CategoryDialog';
import WarehouseDialog from './WarehouseDialog';
import StockInDialog from './StockInDialog';
import StockOutDialog from './StockOutDialog';
import DeleteDialog from './DeleteDialog';
import ProductDetailsDialog from './ProductDetailsDialog';
import MobileInventoryFilterDrawer from './MobileInventoryFilterDrawer';

export const InventoryDashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab State (0: Products, 1: Warehouses, 2: Categories, 3: Stock History)
  const [currentTab, setCurrentTab] = useState(0);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Dialog States
  const [productDialog, setProductDialog] = useState({ open: false, product: null });
  const [categoryDialog, setCategoryDialog] = useState({ open: false, category: null });
  const [warehouseDialog, setWarehouseDialog] = useState({ open: false, warehouse: null });
  const [stockInDialog, setStockInDialog] = useState({ open: false, product: null });
  const [stockOutDialog, setStockOutDialog] = useState({ open: false, product: null });
  const [detailsDialog, setDetailsDialog] = useState({ open: false, product: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemType: 'product', item: null });

  // Load all inventory data from backend API
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [catRes, prodRes, whRes, histRes] = await Promise.all([
        inventoryService.getCategories(),
        inventoryService.getProducts(),
        inventoryService.getWarehouses(),
        inventoryService.getStockHistory(),
      ]);

      const categoriesData = Array.isArray(catRes) ? catRes : catRes?.data || [];
      const productsData = Array.isArray(prodRes) ? prodRes : prodRes?.data || [];
      const warehousesData = Array.isArray(whRes) ? whRes : whRes?.data || [];
      const historyData = Array.isArray(histRes) ? histRes : histRes?.data || [];

      setCategories(categoriesData);
      setProducts(productsData);
      setWarehouses(warehousesData);
      setStockHistory(historyData);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to load inventory data.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search query (SKU or Product Name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = prod.name?.toLowerCase().includes(query);
        const matchesSku = prod.sku?.toLowerCase().includes(query);
        if (!matchesName && !matchesSku) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL') {
        const prodCatId = prod.categoryId || prod.category?.id;
        if (prodCatId !== selectedCategory) return false;
      }

      // Status filter
      const stock = Number(prod.currentStock || 0);
      const minStock = Number(prod.minimumStock || 0);

      if (selectedStatus === 'IN_STOCK') {
        if (stock <= minStock || stock <= 0) return false;
      } else if (selectedStatus === 'LOW_STOCK') {
        if (stock > minStock || stock <= 0) return false;
      } else if (selectedStatus === 'OUT_OF_STOCK') {
        if (stock > 0) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Handlers for Dialog Triggers
  const handleOpenAddProduct = () => setProductDialog({ open: true, product: null });
  const handleOpenEditProduct = (prod) => setProductDialog({ open: true, product: prod });

  const handleOpenAddCategory = () => setCategoryDialog({ open: true, category: null });
  const handleOpenEditCategory = (cat) => setCategoryDialog({ open: true, category: cat });

  const handleOpenAddWarehouse = () => setWarehouseDialog({ open: true, warehouse: null });
  const handleOpenEditWarehouse = (wh) => setWarehouseDialog({ open: true, warehouse: wh });

  const handleOpenStockIn = (prod = null) => setStockInDialog({ open: true, product: prod });
  const handleOpenStockOut = (prod = null) => setStockOutDialog({ open: true, product: prod });

  const handleOpenDetails = (prod) => setDetailsDialog({ open: true, product: prod });

  const handleOpenDelete = (itemType, item) => setDeleteDialog({ open: true, itemType, item });

  return (
    <PageContainer maxWidth={false}>
      {/* Standard Enterprise Page Header */}
      <PageHeader
        title="Inventory Management"
        subtitle="Manage products, categories, warehouses, and track stock movements in real time."
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Inventory', path: '/inventory' },
        ]}
        onRefresh={fetchAllData}
        primaryAction={{
          label: 'Add Product',
          onClick: handleOpenAddProduct,
          icon: <AddIcon />,
        }}
      />

      {/* Metric Summary Cards */}
      <StockSummaryCards
        products={products}
        categories={categories}
        warehouses={warehouses}
        stockHistory={stockHistory}
        loading={loading}
      />

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
          Inventory Stock ({filteredProducts.length})
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
        {/* Desktop Toolbar / Search & Filters */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <InventoryToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedWarehouse={selectedWarehouse}
            onWarehouseChange={setSelectedWarehouse}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            categories={categories}
            warehouses={warehouses}
            onRefresh={fetchAllData}
            onOpenStockIn={() => handleOpenStockIn()}
            onOpenStockOut={() => handleOpenStockOut()}
            onOpenAddProduct={handleOpenAddProduct}
            onOpenAddWarehouse={handleOpenAddWarehouse}
            onOpenAddCategory={handleOpenAddCategory}
          />
        </Box>

        {/* Main Tabbed Content Area */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue) => setCurrentTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  minHeight: 48,
                },
              }}
            >
              <Tab icon={<InventoryIcon />} iconPosition="start" label={`Products (${filteredProducts.length})`} />
              <Tab icon={<WarehouseIcon />} iconPosition="start" label={`Warehouses (${warehouses.length})`} />
              <Tab icon={<CategoryIcon />} iconPosition="start" label={`Categories (${categories.length})`} />
              <Tab icon={<HistoryIcon />} iconPosition="start" label={`Stock History (${stockHistory.length})`} />
            </Tabs>
          </Box>

          {/* Tab 0: Products */}
          {currentTab === 0 && (
            <ProductsPage
              products={filteredProducts}
              loading={loading}
              onOpenAdd={handleOpenAddProduct}
              onOpenEdit={handleOpenEditProduct}
              onOpenDelete={(item) => handleOpenDelete('product', item)}
              onOpenDetails={handleOpenDetails}
              onOpenStockIn={handleOpenStockIn}
              onOpenStockOut={handleOpenStockOut}
            />
          )}

          {/* Tab 1: Warehouses */}
          {currentTab === 1 && (
            <WarehousesPage
              warehouses={warehouses}
              loading={loading}
              onOpenAdd={handleOpenAddWarehouse}
              onOpenEdit={handleOpenEditWarehouse}
              onOpenDelete={(item) => handleOpenDelete('warehouse', item)}
            />
          )}

          {/* Tab 2: Categories */}
          {currentTab === 2 && (
            <ProductCategoriesPage
              categories={categories}
              loading={loading}
              onOpenAdd={handleOpenAddCategory}
              onOpenEdit={handleOpenEditCategory}
              onOpenDelete={(item) => handleOpenDelete('category', item)}
            />
          )}

          {/* Tab 3: Stock History */}
          {currentTab === 3 && (
            <StockHistoryPage stockHistory={stockHistory} loading={loading} />
          )}
        </Box>
      </Paper>

      {/* Mobile Floating Action Button (FAB) */}
      <Fab
        onClick={handleOpenAddProduct}
        aria-label="add stock product"
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

      {/* Mobile Inventory Filter Drawer */}
      <MobileInventoryFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stockStatusFilter={selectedStatus}
        onStockStatusFilterChange={setSelectedStatus}
        warehouseFilter={selectedWarehouse}
        onWarehouseFilterChange={setSelectedWarehouse}
        warehouses={warehouses}
        onResetFilters={() => {
          setSearchQuery('');
          setSelectedCategory('ALL');
          setSelectedWarehouse('ALL');
          setSelectedStatus('ALL');
        }}
      />

      {/* Dialog Modals */}
      <ProductDialog
        open={productDialog.open}
        onClose={() => setProductDialog({ open: false, product: null })}
        onSuccess={fetchAllData}
        product={productDialog.product}
        categories={categories}
      />

      <CategoryDialog
        open={categoryDialog.open}
        onClose={() => setCategoryDialog({ open: false, category: null })}
        onSuccess={fetchAllData}
        category={categoryDialog.category}
      />

      <WarehouseDialog
        open={warehouseDialog.open}
        onClose={() => setWarehouseDialog({ open: false, warehouse: null })}
        onSuccess={fetchAllData}
        warehouse={warehouseDialog.warehouse}
      />

      <StockInDialog
        open={stockInDialog.open}
        onClose={() => setStockInDialog({ open: false, product: null })}
        onSuccess={fetchAllData}
        products={products}
        warehouses={warehouses}
        preselectedProduct={stockInDialog.product}
      />

      <StockOutDialog
        open={stockOutDialog.open}
        onClose={() => setStockOutDialog({ open: false, product: null })}
        onSuccess={fetchAllData}
        products={products}
        warehouses={warehouses}
        preselectedProduct={stockOutDialog.product}
      />

      <ProductDetailsDialog
        open={detailsDialog.open}
        onClose={() => setDetailsDialog({ open: false, product: null })}
        product={detailsDialog.product}
        onOpenEdit={handleOpenEditProduct}
        onOpenStockIn={handleOpenStockIn}
        onOpenStockOut={handleOpenStockOut}
      />

      <DeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, itemType: 'product', item: null })}
        onSuccess={fetchAllData}
        itemType={deleteDialog.itemType}
        item={deleteDialog.item}
      />
    </PageContainer>
  );
};

export default InventoryDashboard;
