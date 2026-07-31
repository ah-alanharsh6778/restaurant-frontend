import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Tabs, Tab, Paper, Typography, Button } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CategoryIcon from '@mui/icons-material/Category';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import expenseService from '../../services/expense.service';

import ExpenseSummaryCards from './ExpenseSummaryCards';
import ExpenseToolbar from './ExpenseToolbar';
import ExpensesPage from './ExpensesPage';
import ExpenseCategoriesPage from './ExpenseCategoriesPage';

import ExpenseDialog from './ExpenseDialog';
import ExpenseCategoryDialog from './ExpenseCategoryDialog';
import InvoiceUploadDialog from './InvoiceUploadDialog';
import InvoicePreviewDialog from './InvoicePreviewDialog';
import ExpenseDetailsDialog from './ExpenseDetailsDialog';
import DeleteExpenseDialog from './DeleteExpenseDialog';

export const ExpensesDashboard = () => {
  // Data States
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab (0: Expenses, 1: Categories)
  const [currentTab, setCurrentTab] = useState(0);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Dialog States
  const [expenseDialog, setExpenseDialog] = useState({ open: false, expense: null });
  const [categoryDialog, setCategoryDialog] = useState({ open: false, category: null });
  const [uploadDialog, setUploadDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState({ open: false, filePath: null, invoiceNumber: '' });
  const [detailsDialog, setDetailsDialog] = useState({ open: false, expense: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemType: 'expense', item: null });

  // Fetch data from backend APIs
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [expsRes, catsRes] = await Promise.all([
        expenseService.getExpenses(),
        expenseService.getExpenseCategories(),
      ]);

      const expsData = Array.isArray(expsRes) ? expsRes : expsRes?.data || [];
      const catsData = Array.isArray(catsRes) ? catsRes : catsRes?.data || [];

      setExpenses(expsData);
      setCategories(catsData);
    } catch (error) {
      console.error('Error loading expense data:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to load expense records.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Filtered Expenses Calculation
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      // Search (Invoice Number or Supplier)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesInv = exp.invoiceNumber?.toLowerCase().includes(query);
        const matchesSupplier = (exp.supplierName || exp.supplier?.name)?.toLowerCase().includes(query);
        if (!matchesInv && !matchesSupplier) return false;
      }

      // Category Filter
      if (selectedCategory !== 'ALL') {
        const catId = exp.categoryId || exp.category?.id;
        if (catId !== selectedCategory) return false;
      }

      // Status Filter
      if (selectedStatus !== 'ALL') {
        if (exp.status !== selectedStatus) return false;
      }

      // Date Range Filter
      if (startDate) {
        const expDate = dayjs(exp.invoiceDate || exp.createdAt);
        if (expDate.isBefore(dayjs(startDate), 'day')) return false;
      }
      if (endDate) {
        const expDate = dayjs(exp.invoiceDate || exp.createdAt);
        if (expDate.isAfter(dayjs(endDate), 'day')) return false;
      }

      return true;
    });
  }, [expenses, searchQuery, selectedCategory, selectedStatus, startDate, endDate]);

  // Export Excel Handler
  const handleExportExcel = async () => {
    try {
      toast.info('Generating Expense Register Excel file...');
      const blob = await expenseService.exportExpenses();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ExpenseRegister.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('ExpenseRegister.xlsx downloaded successfully!');
    } catch (error) {
      console.error('Error exporting expenses:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to export expenses.';
      toast.error(msg);
    }
  };

  // Dialog Action Handlers
  const handleOpenAddExpense = () => setExpenseDialog({ open: true, expense: null });
  const handleOpenEditExpense = (exp) => setExpenseDialog({ open: true, expense: exp });

  const handleOpenAddCategory = () => setCategoryDialog({ open: true, category: null });
  const handleOpenEditCategory = (cat) => setCategoryDialog({ open: true, category: cat });

  const handleOpenUpload = () => setUploadDialog(true);

  const handleOpenPreviewInvoice = (exp) =>
    setPreviewDialog({ open: true, filePath: exp.filePath, invoiceNumber: exp.invoiceNumber || 'N/A' });

  const handleOpenDetails = (exp) => setDetailsDialog({ open: true, expense: exp });

  const handleOpenDelete = (itemType, item) => setDeleteDialog({ open: true, itemType, item });

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0B0D14',
        color: '#FFFFFF',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ maxWidth: '1440px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: '32px',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Expense Management
            </Typography>
            <Typography variant="body1" sx={{ color: '#9CA3AF', fontSize: '15px', mt: 0.5 }}>
              Track vendor invoices, category breakdowns, tax registers, and supplier OCR feeds.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchAllData}
              sx={{
                borderRadius: '14px',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                backgroundColor: '#131A24',
                color: '#FFFFFF',
                px: 2.5,
                py: 1,
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddExpense}
              sx={{
                borderRadius: '14px',
                backgroundColor: '#7C6CFF',
                color: '#FFFFFF',
                px: 3,
                py: 1,
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(124, 108, 255, 0.35)',
                '&:hover': {
                  backgroundColor: '#6854FF',
                },
              }}
            >
              Create Expense
            </Button>
          </Box>
        </Box>

        {/* Metric Summary Cards */}
        <ExpenseSummaryCards expenses={expenses} loading={loading} />

        {/* Toolbar / Search & Filters */}
        <ExpenseToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          categories={categories}
          onRefresh={fetchAllData}
          onOpenUpload={handleOpenUpload}
          onExportExcel={handleExportExcel}
          onOpenCreateExpense={handleOpenAddExpense}
        />

        {/* Main Tabbed Content Container */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            backgroundColor: '#131A24',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            p: { xs: 2.5, sm: 3.5 },
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', mb: 3 }}>
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
                  color: '#9CA3AF',
                  '&.Mui-selected': {
                    color: '#7C6CFF',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#7C6CFF',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <Tab icon={<ReceiptLongIcon />} iconPosition="start" label={`Expenses (${filteredExpenses.length})`} />
              <Tab icon={<CategoryIcon />} iconPosition="start" label={`Categories (${categories.length})`} />
            </Tabs>
          </Box>

          {/* Tab 0: Expenses List */}
          {currentTab === 0 && (
            <ExpensesPage
              expenses={filteredExpenses}
              loading={loading}
              onOpenDetails={handleOpenDetails}
              onOpenEdit={handleOpenEditExpense}
              onOpenDelete={(item) => handleOpenDelete('expense', item)}
              onOpenPreviewInvoice={handleOpenPreviewInvoice}
            />
          )}

          {/* Tab 1: Expense Categories */}
          {currentTab === 1 && (
            <ExpenseCategoriesPage
              categories={categories}
              loading={loading}
              onOpenAdd={handleOpenAddCategory}
              onOpenEdit={handleOpenEditCategory}
              onOpenDelete={(item) => handleOpenDelete('category', item)}
            />
          )}
        </Paper>

        {/* Dialog Modals */}
        <ExpenseDialog
          open={expenseDialog.open}
          onClose={() => setExpenseDialog({ open: false, expense: null })}
          onSuccess={fetchAllData}
          expense={expenseDialog.expense}
          categories={categories}
        />

        <ExpenseCategoryDialog
          open={categoryDialog.open}
          onClose={() => setCategoryDialog({ open: false, category: null })}
          onSuccess={fetchAllData}
          category={categoryDialog.category}
        />

        <InvoiceUploadDialog
          open={uploadDialog}
          onClose={() => setUploadDialog(false)}
          onSuccess={fetchAllData}
        />

        <InvoicePreviewDialog
          open={previewDialog.open}
          onClose={() => setPreviewDialog({ open: false, filePath: null, invoiceNumber: '' })}
          filePath={previewDialog.filePath}
          invoiceNumber={previewDialog.invoiceNumber}
        />

        <ExpenseDetailsDialog
          open={detailsDialog.open}
          onClose={() => setDetailsDialog({ open: false, expense: null })}
          expense={detailsDialog.expense}
          onOpenEdit={handleOpenEditExpense}
          onOpenPreviewInvoice={handleOpenPreviewInvoice}
        />

        <DeleteExpenseDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, itemType: 'expense', item: null })}
          onSuccess={fetchAllData}
          itemType={deleteDialog.itemType}
          item={deleteDialog.item}
        />
      </Box>
    </Box>
  );
};

export default ExpensesDashboard;
