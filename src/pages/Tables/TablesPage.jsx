import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import PeopleIcon from '@mui/icons-material/People';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import BuildIcon from '@mui/icons-material/Build';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';

import PageContainer from '../../layout/PageContainer';
import SummaryCard from '../../components/common/SummaryCard';
import tableService from '../../services/table.service';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/ui';

import TableToolbar from './TableToolbar';
import TableCard from './TableCard';
import TableDataGrid from './TableDataGrid';
import TableDialog from './TableDialog';
import DeleteTableDialog from './DeleteTableDialog';
import TableDetailsModal from './TableDetailsModal';
import EmptyTableState from './EmptyTableState';
import TableQrModal from '../../components/tables/TableQrModal';

export const TablesPage = () => {
  const { hasRole } = useAuth();
  const canManageTables = hasRole(['ADMIN', 'MANAGER']);

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [capacityFilter, setCapacityFilter] = useState('ALL');

  // Dialog States
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setTables(tList);
    } catch (err) {
      console.error('Error fetching tables:', err);
      toast.error(err.response?.data?.message || 'Failed to load restaurant tables from backend');
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
    const maintenance = tables.filter((t) => String(t.status).toUpperCase() === 'MAINTENANCE').length;

    return { total, available, occupied, reserved, maintenance };
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

  // Actions
  const handleOpenAdd = () => {
    setSelectedTable(null);
    setTableDialogOpen(true);
  };

  const handleOpenEdit = (table) => {
    setSelectedTable(table);
    setTableDialogOpen(true);
  };

  const handleOpenDelete = (table) => {
    setTableToDelete(table);
    setDeleteDialogOpen(true);
  };

  const handleOpenDetails = (table) => {
    setTableForDetails(table);
    setDetailsModalOpen(true);
  };

  // Update Status directly via PUT /api/tables/:id
  const handleUpdateStatus = async (tableId, newStatus) => {
    try {
      await tableService.updateTable(tableId, { status: newStatus });
      toast.success(`Table status updated to ${newStatus}!`);
      fetchTables();
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.response?.data?.message || 'Failed to update table status');
    }
  };

  // Save Table (Create or Update)
  const handleSaveTable = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedTable?.id) {
        await tableService.updateTable(selectedTable.id, formData);
        toast.success(`Table #${formData.tableNumber} updated successfully!`);
      } else {
        await tableService.createTable(formData);
        toast.success(`Table #${formData.tableNumber} created successfully!`);
      }
      setTableDialogOpen(false);
      fetchTables();
    } catch (err) {
      console.error('Error saving table:', err);
      toast.error(err.response?.data?.message || 'Failed to save table details');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Table via DELETE /api/tables/:id
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

  return (
    <PageContainer
      title="Restaurant Table Management"
      subtitle="Manage seating capacity, real-time table statuses, and POS floor seating"
      breadcrumbs={[{ label: 'Restaurant Tables' }]}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto', alignItems: 'center' }}>
          <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchTables}>
            Refresh
          </Button>
          {canManageTables && (
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              sx={{ fontWeight: 700 }}
            >
              Add New Table
            </Button>
          )}
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Metric Cards Summary */}
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={3} lg={2.4}>
            <SummaryCard title="Total Tables" value={metrics.total} icon={<TableBarIcon color="primary" />} />
          </Grid>
          <Grid xs={12} sm={6} md={3} lg={2.4}>
            <SummaryCard title="Available (Green)" value={metrics.available} icon={<PeopleIcon color="success" />} />
          </Grid>
          <Grid xs={12} sm={6} md={3} lg={2.4}>
            <SummaryCard title="Occupied (Red)" value={metrics.occupied} icon={<TableBarIcon color="error" />} />
          </Grid>
          <Grid xs={12} sm={6} md={3} lg={2.4}>
            <SummaryCard title="Reserved (Orange)" value={metrics.reserved} icon={<HourglassTopIcon color="warning" />} />
          </Grid>
          <Grid xs={12} sm={6} md={3} lg={2.4}>
            <SummaryCard title="Maintenance (Grey)" value={metrics.maintenance} icon={<BuildIcon color="action" />} />
          </Grid>
        </Grid>

        {/* Toolbar & Filter Bar */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <TableToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              capacityFilter={capacityFilter}
              onCapacityFilterChange={setCapacityFilter}
              onRefresh={fetchTables}
              onAddTable={handleOpenAdd}
              canManage={canManageTables}
            />

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, val) => val && setViewMode(val)}
              size="small"
              sx={{ bgcolor: '#FFFFFF', borderRadius: 2 }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewIcon fontSize="small" sx={{ mr: 0.5 }} /> Cards View
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon fontSize="small" sx={{ mr: 0.5 }} /> DataGrid View
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Paper>

        {/* Main Content Area: Cards or DataGrid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Loader size="large" />
          </Box>
        ) : filteredTables.length === 0 ? (
          <EmptyTableState onAddTable={handleOpenAdd} canManage={canManageTables} />
        ) : viewMode === 'grid' ? (
          <Grid container spacing={2.5}>
            {filteredTables.map((table) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={table.id}>
                <TableCard
                  table={table}
                  onViewDetails={handleOpenDetails}
                  onEditTable={handleOpenEdit}
                  onDeleteTable={handleOpenDelete}
                  onUpdateStatus={handleUpdateStatus}
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
            onUpdateStatus={handleUpdateStatus}
            canManage={canManageTables}
          />
        )}
      </Box>

      {/* Dialog Modals */}
      <TableDialog
        open={tableDialogOpen}
        onClose={() => setTableDialogOpen(false)}
        onSubmit={handleSaveTable}
        initialData={selectedTable}
        isSubmitting={isSubmitting}
      />

      <DeleteTableDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        table={tableToDelete}
      />

      <TableDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        table={tableForDetails}
      />

      <TableQrModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        table={tableForQr}
      />
    </PageContainer>
  );
};

export default TablesPage;
