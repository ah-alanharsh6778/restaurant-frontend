import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  IconButton,
  Fab,
  useTheme,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import BuildIcon from '@mui/icons-material/Build';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import { toast } from 'react-toastify';

import tableService from '../../services/table.service';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/ui';

import TableToolbar, { MobileTableFilterDrawer } from './TableToolbar';
import TableCard from './TableCard';
import TableDataGrid from './TableDataGrid';
import TableDialog from './TableDialog';
import BookTableDialog from './BookTableDialog';
import DeleteTableDialog from './DeleteTableDialog';
import TableDetailsModal from './TableDetailsModal';
import EmptyTableState from './EmptyTableState';
import TableQrModal from '../../components/tables/TableQrModal';

const DEFAULT_TABLES = [
  { id: 'tbl-1', tableNumber: 'T-01', capacity: 2, status: 'AVAILABLE', location: 'Main Dining' },
  { id: 'tbl-2', tableNumber: 'T-02', capacity: 4, status: 'OCCUPIED', location: 'Main Dining', booking: { customerName: 'Alexander Wright', guests: 4, time: '08:00 PM' }, currentOrder: { id: 'ORD-1082', orderNumber: '1082' } },
  { id: 'tbl-3', tableNumber: 'T-03', capacity: 4, status: 'AVAILABLE', location: 'Patio Terrace' },
  { id: 'tbl-4', tableNumber: 'T-04', capacity: 6, status: 'RESERVED', location: 'Window Side', booking: { customerName: 'Sophia Martinez', phone: '+1 555-0198', guests: 6, time: '07:30 PM' } },
  { id: 'tbl-5', tableNumber: 'VIP-1', capacity: 8, status: 'AVAILABLE', location: 'VIP Lounge' },
  { id: 'tbl-6', tableNumber: 'T-05', capacity: 2, status: 'OCCUPIED', location: 'Main Dining', booking: { customerName: 'Liam Johnson', guests: 2, time: '08:15 PM' }, currentOrder: { id: 'ORD-1085', orderNumber: '1085' } },
  { id: 'tbl-7', tableNumber: 'T-06', capacity: 4, status: 'AVAILABLE', location: 'Patio Terrace' },
  { id: 'tbl-8', tableNumber: 'VIP-2', capacity: 10, status: 'RESERVED', location: 'VIP Lounge', booking: { customerName: 'David Miller', phone: '+1 555-0245', guests: 8, time: '09:00 PM' } },
];

export const TablesPage = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canManageTables = hasRole(['ADMIN', 'MANAGER']);

  const [tables, setTables] = useState(DEFAULT_TABLES);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [capacityFilter, setCapacityFilter] = useState('ALL');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Dialog States
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Booking Dialog State
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [tableToBook, setTableToBook] = useState(null);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [tableForDetails, setTableForDetails] = useState(null);

  // QR Code Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [tableForQr, setTableForQr] = useState(null);

  const handleOpenQrModal = (table) => {
    setTableForQr(table);
    setQrModalOpen(true);
  };

  // Fetch Tables from GET /api/tables
  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const res = await tableService.getTables();
      const tList = Array.isArray(res) ? res : res?.data || res?.tables || [];
      setTables(tList.length > 0 ? tList : DEFAULT_TABLES);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setTables(DEFAULT_TABLES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // Summary Metrics derived from database items
  const metrics = useMemo(() => {
    const total = tables.length;
    const available = tables.filter((t) => String(t.status).toUpperCase() === 'AVAILABLE').length;
    const occupied = tables.filter((t) => String(t.status).toUpperCase() === 'OCCUPIED').length;
    const reserved = tables.filter((t) => String(t.status).toUpperCase() === 'RESERVED').length;
    const totalCapacity = tables.reduce((acc, t) => acc + Number(t.capacity || 0), 0);

    return { total, available, occupied, reserved, totalCapacity };
  }, [tables]);

  // Filtered List
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const numStr = String(t.tableNumber || t.id || '').toLowerCase();
      const matchesSearch = !searchQuery || numStr.includes(searchQuery.toLowerCase().trim());
      const matchesStatus =
        statusFilter === 'ALL' || String(t.status).toUpperCase() === statusFilter.toUpperCase();

      let matchesCapacity = true;
      if (capacityFilter !== 'ALL') {
        const minCap = parseInt(capacityFilter, 10);
        matchesCapacity = Number(t.capacity) >= minCap;
      }

      return matchesSearch && matchesStatus && matchesCapacity;
    });
  }, [tables, searchQuery, statusFilter, capacityFilter]);

  // Dialog Action Handlers
  const handleOpenAdd = () => {
    setSelectedTable(null);
    setTableDialogOpen(true);
  };

  const handleOpenEdit = (table, e) => {
    if (e) e.stopPropagation();
    setSelectedTable(table);
    setTableDialogOpen(true);
  };

  const handleOpenDelete = (table, e) => {
    if (e) e.stopPropagation();
    setTableToDelete(table);
    setDeleteDialogOpen(true);
  };

  const handleOpenDetails = (table, e) => {
    if (e) e.stopPropagation();
    setTableForDetails(table);
    setDetailsModalOpen(true);
  };

  const handleOpenBookModal = (table, e) => {
    if (e) e.stopPropagation();
    setTableToBook(table);
    setBookDialogOpen(true);
  };

  // Submit Handlers
  const handleSaveTable = async (tableData) => {
    try {
      setIsSubmitting(true);
      if (selectedTable?.id) {
        await tableService.updateTable(selectedTable.id, tableData);
        toast.success(`Table #${tableData.tableNumber || selectedTable.id} updated successfully!`);
      } else {
        await tableService.createTable(tableData);
        toast.success('New table created successfully!');
      }
      setTableDialogOpen(false);
      fetchTables();
    } catch (err) {
      console.error('Error saving table:', err);
      toast.error(err.response?.data?.message || 'Failed to save table');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBooking = async (bookingPayload) => {
    try {
      setIsBookingSubmitting(true);
      if (tableToBook?.id) {
        await tableService.updateTableStatus(tableToBook.id, bookingPayload.status || 'RESERVED');
        toast.success(`Table #${tableToBook.tableNumber} status updated to ${bookingPayload.status || 'RESERVED'}`);
      }
      setBookDialogOpen(false);
      fetchTables();
    } catch (err) {
      console.error('Error updating table status:', err);
      toast.error(err.response?.data?.message || 'Failed to update table status');
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!tableToDelete?.id) return;
    try {
      await tableService.deleteTable(tableToDelete.id);
      toast.success(`Table #${tableToDelete.tableNumber || tableToDelete.id} deleted successfully!`);
      setDeleteDialogOpen(false);
      fetchTables();
    } catch (err) {
      console.error('Error deleting table:', err);
      toast.error(err.response?.data?.message || 'Failed to delete table');
    }
  };

  const handleOpenBookTable = (table) => {
    setTableToBook(table);
    setBookDialogOpen(true);
  };

  const handleCheckInTable = async (tableId) => {
    try {
      if (tableId) {
        await tableService.updateTableStatus(tableId, 'OCCUPIED');
        toast.success('Guest checked in! Table is now occupied.');
        fetchTables();
        setDetailsModalOpen(false);
      }
    } catch (err) {
      console.error('Check in error:', err);
      toast.error(err.response?.data?.message || 'Failed to check in table');
    }
  };

  const handleCancelBooking = async (tableId) => {
    try {
      if (tableId) {
        await tableService.updateTableStatus(tableId, 'AVAILABLE');
        toast.success('Table booking cancelled and freed.');
        fetchTables();
        setDetailsModalOpen(false);
      }
    } catch (err) {
      console.error('Cancel booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleCreateOrder = (table) => {
    navigate(`/orders?tableId=${table?.id || ''}&customerId=${table?.customerId || ''}`);
  };

  const summaryCardData = [
    {
      title: 'Total Tables',
      value: metrics.total,
      description: 'Floor Layout Units',
      icon: <TableBarIcon sx={{ color: '#7C6CFF', fontSize: 20 }} />,
      circleBg: 'rgba(124, 108, 255, 0.12)',
    },
    {
      title: 'Available',
      value: metrics.available,
      description: 'Ready to Seat',
      icon: <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />,
      circleBg: 'rgba(16, 185, 129, 0.12)',
    },
    {
      title: 'Occupied',
      value: metrics.occupied,
      description: 'Currently Serving',
      icon: <RestaurantIcon sx={{ color: '#EF4444', fontSize: 20 }} />,
      circleBg: 'rgba(239, 68, 68, 0.12)',
    },
    {
      title: 'Reserved',
      value: metrics.reserved,
      description: 'Upcoming Guests',
      icon: <HourglassTopIcon sx={{ color: '#F59E0B', fontSize: 20 }} />,
      circleBg: 'rgba(245, 158, 11, 0.12)',
    },
    {
      title: 'Total Seating',
      value: metrics.totalCapacity,
      description: 'Max Guest Capacity',
      icon: <TableBarIcon sx={{ color: '#3B82F6', fontSize: 20 }} />,
      circleBg: 'rgba(59, 130, 246, 0.12)',
    },
  ];

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        color: 'text.primary',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ maxWidth: '1440px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Desktop Page Header */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: '32px',
                color: 'text.primary',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Restaurant Tables
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '15px', mt: 0.5 }}>
              Manage seating capacity, reservations, occupancy, and floor operations.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchTables}
              sx={{
                borderRadius: '14px',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.12)',
                backgroundColor: isDark ? '#131A24' : '#FFFFFF',
                color: 'text.primary',
                px: 2.5,
                py: 1,
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 250ms ease',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Refresh
            </Button>
            {canManageTables && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAdd}
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
                  transition: 'all 250ms ease',
                  '&:hover': {
                    backgroundColor: '#6854FF',
                    boxShadow: '0 12px 30px rgba(124, 108, 255, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Add Table
              </Button>
            )}
          </Box>
        </Box>

        {/* Mobile Header (Hidden on Desktop) */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: '24px', color: 'text.primary' }}>
            Tables
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

        {/* Summary Cards Grid */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Grid container spacing={3}>
            {summaryCardData.map((card, idx) => (
              <Grid xs={12} sm={6} md={2.4} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: '24px',
                    borderRadius: '20px',
                    backgroundColor: isDark ? '#131A24' : '#FFFFFF',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: isDark ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    boxSizing: 'border-box',
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.15)',
                      boxShadow: isDark ? '0 12px 30px rgba(0, 0, 0, 0.5)' : '0 8px 24px rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '14px' }}>
                      {card.title}
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: card.circleBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '28px', mb: 0.5 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                    {card.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Single Unified Merged Container (Search Toolbar + Grid / List) */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            backgroundColor: isDark ? '#131A24' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Merged Filter Toolbar */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <TableToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              capacityFilter={capacityFilter}
              onCapacityFilterChange={setCapacityFilter}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </Box>

          {/* Main Table Grid Content */}
          <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 } }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <Loader size="large" />
              </Box>
            ) : filteredTables.length === 0 ? (
              <EmptyTableState
                onAddTable={handleOpenAdd}
                searchOrFilterActive={Boolean(searchQuery || statusFilter !== 'ALL' || capacityFilter !== 'ALL')}
                canManage={canManageTables}
              />
            ) : viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {filteredTables.map((table) => (
                  <Grid xs={12} sm={6} md={4} lg={3} key={table.id || table.tableNumber}>
                    <TableCard
                      table={table}
                      onViewDetails={handleOpenDetails}
                      onEditTable={handleOpenEdit}
                      onDeleteTable={handleOpenDelete}
                      onUpdateStatus={handleConfirmBooking}
                      onOpenQrModal={handleOpenQrModal}
                      canManage={canManageTables}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <TableDataGrid
                tables={filteredTables}
                onView={handleOpenDetails}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onUpdateStatus={handleConfirmBooking}
                canManage={canManageTables}
              />
            )}
          </Box>
        </Paper>
      </Box>

      {/* Mobile Floating Action Button (FAB) */}
      {canManageTables && (
        <Fab
          onClick={handleOpenAdd}
          aria-label="add table"
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
      )}

      {/* Mobile Bottom Sheet Filter Drawer */}
      <MobileTableFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        capacityFilter={capacityFilter}
        onCapacityFilterChange={setCapacityFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Book Table Dialog */}
      <BookTableDialog
        open={bookDialogOpen}
        onClose={() => setBookDialogOpen(false)}
        onSubmit={handleConfirmBooking}
        table={tableToBook}
        isSubmitting={isBookingSubmitting}
      />

      {/* Table Dialog (Create/Edit Table Admin) */}
      <TableDialog
        open={tableDialogOpen}
        onClose={() => setTableDialogOpen(false)}
        onSubmit={handleSaveTable}
        initialData={selectedTable}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteTableDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        table={tableToDelete}
      />

      {/* Table Details Modal */}
      <TableDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        table={tableForDetails}
        onCheckIn={handleCheckInTable}
        onCancelBooking={handleCancelBooking}
        onEditBooking={handleOpenBookTable}
        onCreateOrder={handleCreateOrder}
        onEditTable={handleOpenEdit}
        onDeleteTable={handleOpenDelete}
        onOpenQrModal={handleOpenQrModal}
        canManage={canManageTables}
      />

      {/* QR Modal */}
      <TableQrModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        table={tableForQr}
      />
    </Box>
  );
};

export default TablesPage;
