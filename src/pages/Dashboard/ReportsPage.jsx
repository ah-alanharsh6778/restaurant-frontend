import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SecurityIcon from '@mui/icons-material/Security';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import PageContainer from '../../layout/PageContainer';
import SummaryCard from '../../components/common/SummaryCard';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import reportService from '../../services/report.service';
import orderService from '../../services/order.service';
import expenseService from '../../services/expense.service';
import inventoryService from '../../services/inventory.service';
import purchaseOrderService from '../../services/purchaseOrder.service';
import supplierService from '../../services/supplier.service';
import customerService from '../../services/customer.service';
import wasteService from '../../services/waste.service';
import invoiceService from '../../services/invoice.service';
import { Loader } from '../../components/ui';

const extractArrayData = (res, keys = []) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  for (const k of keys) {
    if (Array.isArray(res?.[k])) return res[k];
    if (Array.isArray(res?.data?.[k])) return res.data[k];
  }
  return [];
};

export const ReportsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Live Data States
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [wasteLogs, setWasteLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        sumRes,
        ordRes,
        expRes,
        prodRes,
        poRes,
        supRes,
        custRes,
        wasteRes,
        logRes,
        invRes,
      ] = await Promise.all([
        reportService.getSummary().catch(() => null),
        orderService.getOrders().catch(() => []),
        expenseService.getAllExpenses().catch(() => []),
        inventoryService.getProducts().catch(() => []),
        purchaseOrderService.getPurchaseOrders().catch(() => []),
        supplierService.getSuppliers().catch(() => []),
        customerService.getAll().catch(() => []),
        wasteService.getAll().catch(() => []),
        reportService.getActivityLogs().catch(() => []),
        invoiceService.getAllInvoices().catch(() => []),
      ]);

      setSummary(sumRes);
      setOrders(extractArrayData(ordRes, ['orders']));
      setExpenses(extractArrayData(expRes, ['expenses']));
      setProducts(extractArrayData(prodRes, ['products']));
      setPurchaseOrders(extractArrayData(poRes, ['purchaseOrders']));
      setSuppliers(extractArrayData(supRes, ['suppliers']));
      setCustomers(extractArrayData(custRes, ['customers']));
      setWasteLogs(extractArrayData(wasteRes, ['wasteLogs']));
      setActivityLogs(extractArrayData(logRes, ['activityLogs']));
      setInvoices(extractArrayData(invRes, ['invoices']));
    } catch (error) {
      console.error('Error loading report telemetry:', error);
      toast.error('Failed to load live backend report data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Export Excel File from backend GET /api/expenses/export
  const handleExportExcel = async () => {
    try {
      toast.info('Downloading Excel expense register from backend...');
      const blob = await reportService.exportExpenseExcel();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Expense_Register_${dayjs().format('YYYY-MM-DD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel report spreadsheet downloaded successfully!');
    } catch (error) {
      console.error('Error downloading Excel report:', error);
      toast.error(error.response?.data?.message || 'Excel export is not supported for this report category.');
    }
  };

  // Print PDF Preview
  const handlePrint = () => {
    window.print();
  };

  // Filter Helper
  const filterByDateAndSearch = (items, dateField = 'createdAt', searchFields = []) => {
    const safeItems = extractArrayData(items);
    return safeItems.filter((item) => {
      // Date Filter
      const dVal = item[dateField] || item.createdAt;
      if (dVal) {
        const d = dayjs(dVal);
        if (selectedMonth !== 'ALL' && d.format('MM') !== selectedMonth) return false;
        if (selectedYear !== 'ALL' && d.format('YYYY') !== selectedYear) return false;
        if (startDate && d.isBefore(dayjs(startDate), 'day')) return false;
        if (endDate && d.isAfter(dayjs(endDate), 'day')) return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = searchFields.some((field) => {
          const val = item[field];
          if (!val) return false;
          if (typeof val === 'object') return (val.name || val.fullName || val.email || '').toLowerCase().includes(q);
          return String(val).toLowerCase().includes(q);
        });
        if (!matches) return false;
      }

      return true;
    });
  };

  // 1. Sales Rows
  const salesRows = filterByDateAndSearch(orders, 'createdAt', ['orderNumber', 'status', 'orderType']);
  const salesColumns = [
    { field: 'orderNumber', headerName: 'Order #', width: 180, renderCell: (p) => <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{p.value || `ORD-${p.row.id?.substring(0, 4)}`}</Typography> },
    { field: 'status', headerName: 'Status', width: 140, renderCell: (p) => <Chip label={p.value || 'PENDING'} color={p.value === 'COMPLETED' ? 'success' : 'primary'} size="small" sx={{ fontWeight: 800 }} /> },
    { field: 'orderType', headerName: 'Order Type', width: 140, renderCell: (p) => <Chip label={p.value || 'DINE_IN'} size="small" variant="outlined" sx={{ fontWeight: 700 }} /> },
    { field: 'totalAmount', headerName: 'Subtotal ($)', width: 140, renderCell: (p) => `$${Number(p.value || 0).toFixed(2)}` },
    { field: 'createdAt', headerName: 'Timestamp', flex: 1, renderCell: (p) => dayjs(p.value).format('MMM DD, YYYY HH:mm') },
  ];

  // 2. Expense Rows
  const expenseRows = filterByDateAndSearch(expenses, 'invoiceDate', ['invoiceNumber', 'supplierName', 'category', 'status']);
  const expenseColumns = [
    { field: 'invoiceNumber', headerName: 'Invoice #', width: 170, renderCell: (p) => <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{p.value || '—'}</Typography> },
    { field: 'category', headerName: 'Category', width: 160, renderCell: (p) => p.row.category?.name || p.value || 'General' },
    { field: 'amount', headerName: 'Subtotal ($)', width: 130, renderCell: (p) => `$${Number(p.value || 0).toFixed(2)}` },
    { field: 'tax', headerName: 'Tax ($)', width: 110, renderCell: (p) => `$${Number(p.value || 0).toFixed(2)}` },
    { field: 'total', headerName: 'Total ($)', width: 130, renderCell: (p) => <Typography variant="body2" sx={{ fontWeight: 800, color: 'error.main' }}>${Number(p.value || p.row.amount || 0).toFixed(2)}</Typography> },
    { field: 'status', headerName: 'Status', width: 140, renderCell: (p) => <Chip label={p.value || 'PAID'} color={p.value === 'PAID' ? 'success' : 'warning'} size="small" sx={{ fontWeight: 800 }} /> },
    { field: 'invoiceDate', headerName: 'Invoice Date', flex: 1, renderCell: (p) => dayjs(p.value || p.row.createdAt).format('MMM DD, YYYY') },
  ];

  // 3. Inventory Rows
  const inventoryRows = filterByDateAndSearch(products, 'createdAt', ['sku', 'name', 'unit', 'category']);
  const inventoryColumns = [
    { field: 'sku', headerName: 'SKU', width: 140, renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>{p.value || '—'}</Typography> },
    { field: 'name', headerName: 'Product Name', width: 220, renderCell: (p) => <Typography variant="body2" sx={{ fontWeight: 800 }}>{p.value || '—'}</Typography> },
    { field: 'currentStock', headerName: 'Current Stock', width: 140, renderCell: (p) => <Typography variant="body2" sx={{ fontWeight: 800, color: (p.value <= p.row.minimumStock) ? 'error.main' : 'text.primary' }}>{p.value ?? 0} {p.row.unit || ''}</Typography> },
    { field: 'minimumStock', headerName: 'Min Threshold', width: 130, renderCell: (p) => p.value ?? 0 },
    { field: 'costPrice', headerName: 'Cost ($)', width: 120, renderCell: (p) => `$${Number(p.value || 0).toFixed(2)}` },
    { field: 'sellingPrice', headerName: 'Price ($)', flex: 1, renderCell: (p) => `$${Number(p.value || 0).toFixed(2)}` },
  ];

  // 4. Purchase Order Rows
  const purchaseRows = filterByDateAndSearch(purchaseOrders, 'createdAt', ['poNumber', 'status']);
  const purchaseColumns = [
    { field: 'poNumber', headerName: 'PO Number', width: 180, renderCell: (p) => <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{p.value || `PO-${p.row.id?.substring(0, 4)}`}</Typography> },
    { field: 'supplier', headerName: 'Supplier Name', width: 220, renderCell: (p) => p.row.supplier?.name || p.value || 'Vendor' },
    { field: 'status', headerName: 'PO Status', width: 140, renderCell: (p) => <Chip label={p.value || 'ORDERED'} color={p.value === 'RECEIVED' ? 'success' : 'info'} size="small" sx={{ fontWeight: 800 }} /> },
    { field: 'totalAmount', headerName: 'Total Amount ($)', width: 160, renderCell: (p) => `$${Number(p.value || 0).toFixed(2)}` },
    { field: 'createdAt', headerName: 'PO Date', flex: 1, renderCell: (p) => dayjs(p.value).format('MMM DD, YYYY') },
  ];

  // 5. Supplier Rows
  const supplierRows = filterByDateAndSearch(suppliers, 'createdAt', ['name', 'contactPerson', 'phone', 'email']);
  const supplierColumns = [
    { field: 'name', headerName: 'Supplier Name', width: 220, renderCell: (p) => <Typography variant="body2" sx={{ fontWeight: 800 }}>{p.value || '—'}</Typography> },
    { field: 'contactPerson', headerName: 'Contact Person', width: 180 },
    { field: 'phone', headerName: 'Phone Number', width: 150 },
    { field: 'email', headerName: 'Email Address', flex: 1 },
  ];

  // 6. Customer Rows
  const customerRows = filterByDateAndSearch(customers, 'createdAt', ['fullName', 'email', 'phone']);
  const customerColumns = [
    { field: 'fullName', headerName: 'Customer Name', width: 220, renderCell: (p) => <Typography variant="body2" sx={{ fontWeight: 800 }}>{p.value || p.row.name || 'Diner'}</Typography> },
    { field: 'email', headerName: 'Email Address', width: 220 },
    { field: 'phone', headerName: 'Phone Number', width: 160 },
    { field: 'createdAt', headerName: 'Registered Date', flex: 1, renderCell: (p) => dayjs(p.value).format('MMM DD, YYYY') },
  ];

  // 7. Waste Log Rows
  const wasteRows = filterByDateAndSearch(wasteLogs, 'createdAt', ['reason', 'remarks']);
  const wasteColumns = [
    { field: 'createdAt', headerName: 'Timestamp', width: 170, renderCell: (p) => dayjs(p.value).format('MMM DD, YYYY HH:mm') },
    { field: 'ingredient', headerName: 'Ingredient', width: 200, renderCell: (p) => p.row.ingredient?.name || 'Ingredient' },
    { field: 'quantity', headerName: 'Quantity', width: 140, renderCell: (p) => <Typography variant="body2" sx={{ fontWeight: 800, color: 'error.main' }}>{p.value} {p.row.unit}</Typography> },
    { field: 'costLost', headerName: 'Loss ($)', width: 130, renderCell: (p) => `$${Number(p.value || 0).toFixed(2)}` },
    { field: 'reason', headerName: 'Reason', flex: 1, renderCell: (p) => <Chip label={p.value} color="warning" size="small" sx={{ fontWeight: 800 }} /> },
  ];

  // 8. Audit Telemetry Log Rows
  const logRows = filterByDateAndSearch(activityLogs, 'createdAt', ['action', 'module', 'details']);
  const logColumns = [
    { field: 'createdAt', headerName: 'Timestamp', width: 170, renderCell: (p) => dayjs(p.value).format('MMM DD, YYYY HH:mm:ss') },
    { field: 'action', headerName: 'Action Executed', width: 180, renderCell: (p) => <Chip label={p.value || 'EVENT'} color="primary" size="small" sx={{ fontWeight: 800 }} /> },
    { field: 'module', headerName: 'Target Module', width: 160, renderCell: (p) => <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{p.value || 'SYSTEM'}</Typography> },
    { field: 'user', headerName: 'User / Actor', width: 180, renderCell: (p) => p.row.user?.fullName || p.row.user?.email || p.value || 'System Task' },
    { field: 'ipAddress', headerName: 'IP Address', width: 140 },
    { field: 'details', headerName: 'Telemetry Details', flex: 1.5, renderCell: (p) => <Typography variant="body2" color="text.secondary" noWrap>{p.value ? JSON.stringify(p.value) : '—'}</Typography> },
  ];

  // 9. AI Invoice OCR Register Rows
  const invoiceRows = filterByDateAndSearch(invoices, 'createdAt', ['invoiceNumber', 'supplierName', 'status']);
  const invoiceColumns = [
    { field: 'invoiceNumber', headerName: 'Invoice #', width: 170, renderCell: (p) => <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{p.value || '—'}</Typography> },
    { field: 'supplierName', headerName: 'Vendor Name', width: 220, renderCell: (p) => p.value || 'Vendor' },
    { field: 'totalAmount', headerName: 'OCR Total ($)', width: 140, renderCell: (p) => <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>${Number(p.value || 0).toFixed(2)}</Typography> },
    { field: 'status', headerName: 'Processing Status', width: 160, renderCell: (p) => <Chip label={p.value || 'PROCESSED'} color={p.value === 'PROCESSED' ? 'success' : 'warning'} size="small" sx={{ fontWeight: 800 }} /> },
    { field: 'ocrConfidence', headerName: 'AI Accuracy', width: 130, renderCell: (p) => <Chip label={`${Math.round((p.value || 0.98) * 100)}%`} color="info" size="small" sx={{ fontWeight: 800 }} /> },
    { field: 'createdAt', headerName: 'Scan Timestamp', flex: 1, renderCell: (p) => dayjs(p.value).format('MMM DD, YYYY HH:mm') },
  ];

  // KPI Metrics Calculation
  const totalSalesRevenue = useMemo(() => {
    const safeOrders = extractArrayData(orders);
    return safeOrders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
  }, [orders]);

  const totalExpenseCost = useMemo(() => {
    const safeExpenses = extractArrayData(expenses);
    return safeExpenses.reduce((acc, curr) => acc + (Number(curr.total || curr.amount) || 0), 0);
  }, [expenses]);

  return (
    <PageContainer
      title="Enterprise Reports & Operational Telemetry"
      subtitle="Comprehensive financial, inventory, purchase order, audit telemetry, and AI OCR registers"
      breadcrumbs={[{ label: 'Reports & Telemetry' }]}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto', alignItems: 'center' }}>
          <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={loadAllData}>
            Refresh
          </Button>
          <Button size="small" variant="outlined" color="secondary" startIcon={<PrintIcon />} onClick={handlePrint}>
            Print / PDF
          </Button>
          <Button size="small" variant="contained" color="primary" startIcon={<FileDownloadIcon />} onClick={handleExportExcel} sx={{ fontWeight: 700 }}>
            Export Excel
          </Button>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Summary KPI Cards */}
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={3}>
            <SummaryCard
              title="Total Sales Revenue ($)"
              value={`$${totalSalesRevenue.toFixed(2)}`}
              icon={<TrendingUpIcon color="success" />}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <SummaryCard
              title="Total Expenses ($)"
              value={`$${totalExpenseCost.toFixed(2)}`}
              icon={<AttachMoneyIcon color="error" />}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <SummaryCard
              title="Live Orders Count"
              value={Array.isArray(orders) ? orders.length : 0}
              icon={<ShoppingCartIcon color="primary" />}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <SummaryCard
              title="Active Suppliers & Vendors"
              value={Array.isArray(suppliers) ? suppliers.length : 0}
              icon={<LocalShippingIcon color="info" />}
            />
          </Grid>
        </Grid>

        {/* Global Date & Search Filters Toolbar */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search report items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(e.target.value)}>
                  <MenuItem value="ALL">All Months</MenuItem>
                  {['01','02','03','04','05','06','07','08','09','10','11','12'].map((m) => (
                    <MenuItem key={m} value={m}>{dayjs(`2026-${m}-01`).format('MMM')}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}>
                  <MenuItem value="ALL">All Years</MenuItem>
                  <MenuItem value="2026">2026</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={6} sm={3} md={2.5}>
              <TextField
                fullWidth
                type="date"
                size="small"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    bgcolor: 'background.paper',
                    px: 0.6,
                    borderRadius: 1,
                  },
                }}
              />
            </Grid>

            <Grid xs={6} sm={3} md={2.5}>
              <TextField
                fullWidth
                type="date"
                size="small"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    bgcolor: 'background.paper',
                    px: 0.6,
                    borderRadius: 1,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Tabbed Report Registers */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            p: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={(_, val) => setCurrentTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  minHeight: 48,
                },
              }}
            >
              <Tab icon={<ShoppingCartIcon fontSize="small" />} iconPosition="start" label={`Sales Register (${salesRows.length})`} />
              <Tab icon={<ReceiptIcon fontSize="small" />} iconPosition="start" label={`Expense Register (${expenseRows.length})`} />
              <Tab icon={<InventoryIcon fontSize="small" />} iconPosition="start" label={`Inventory Telemetry (${inventoryRows.length})`} />
              <Tab icon={<AssignmentIcon fontSize="small" />} iconPosition="start" label={`Purchase Orders (${purchaseRows.length})`} />
              <Tab icon={<LocalShippingIcon fontSize="small" />} iconPosition="start" label={`Supplier Register (${supplierRows.length})`} />
              <Tab icon={<PeopleIcon fontSize="small" />} iconPosition="start" label={`Customer Register (${customerRows.length})`} />
              <Tab icon={<DeleteSweepIcon fontSize="small" />} iconPosition="start" label={`Waste Incidents (${wasteRows.length})`} />
              <Tab icon={<SecurityIcon fontSize="small" />} iconPosition="start" label={`Audit Telemetry (${logRows.length})`} />
              <Tab icon={<AutoAwesomeIcon fontSize="small" />} iconPosition="start" label={`AI Invoice OCR (${invoiceRows.length})`} />
            </Tabs>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Loader size={48} />
            </Box>
          ) : (
            <>
              {currentTab === 0 && <CommonDataGrid rows={salesRows} columns={salesColumns} height={520} />}
              {currentTab === 1 && <CommonDataGrid rows={expenseRows} columns={expenseColumns} height={520} />}
              {currentTab === 2 && <CommonDataGrid rows={inventoryRows} columns={inventoryColumns} height={520} />}
              {currentTab === 3 && <CommonDataGrid rows={purchaseRows} columns={purchaseColumns} height={520} />}
              {currentTab === 4 && <CommonDataGrid rows={supplierRows} columns={supplierColumns} height={520} />}
              {currentTab === 5 && <CommonDataGrid rows={customerRows} columns={customerColumns} height={520} />}
              {currentTab === 6 && <CommonDataGrid rows={wasteRows} columns={wasteColumns} height={520} />}
              {currentTab === 7 && <CommonDataGrid rows={logRows} columns={logColumns} height={520} />}
              {currentTab === 8 && <CommonDataGrid rows={invoiceRows} columns={invoiceColumns} height={520} />}
            </>
          )}
        </Paper>
      </Box>
    </PageContainer>
  );
};

export default ReportsPage;
