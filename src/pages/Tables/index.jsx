import { useState, useEffect, useCallback } from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import PageContainer from '../../components/layout/PageContainer';
import TableToolbar from './TableToolbar';
import TableList from './TableList';
import TableDialog from './TableDialog';
import DeleteTableDialog from './DeleteTableDialog';
import tableService from '../../services/table.service';

export const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch tables from backend API
  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const response = await tableService.getAllTables();
      if (response && response.tables) {
        setTables(response.tables);
      } else if (Array.isArray(response)) {
        setTables(response);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load restaurant tables');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // Open Create Dialog
  const handleOpenCreate = () => {
    setEditingTable(null);
    setDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (table) => {
    setEditingTable(table);
    setDialogOpen(true);
  };

  // Handle Form Submit for Create & Edit
  const handleSubmitForm = async (formData) => {
    setSubmitting(true);
    try {
      if (editingTable) {
        const id = editingTable.id || editingTable._id;
        await tableService.updateTable(id, formData);
        toast.success(`Table "${formData.tableNumber}" updated successfully`);
      } else {
        await tableService.createTable(formData);
        toast.success(`Table "${formData.tableNumber}" created successfully`);
      }
      setDialogOpen(false);
      fetchTables();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Confirmation Dialog
  const handleOpenDelete = (table) => {
    setTableToDelete(table);
    setDeleteDialogOpen(true);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!tableToDelete) return;
    setDeleting(true);
    try {
      const id = tableToDelete.id || tableToDelete._id;
      await tableService.deleteTable(id);
      toast.success(`Table "${tableToDelete.tableNumber}" deleted successfully`);
      setDeleteDialogOpen(false);
      setTableToDelete(null);
      fetchTables();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete table');
    } finally {
      setDeleting(false);
    }
  };

  // Export Table List to CSV
  const handleExportCSV = () => {
    if (tables.length === 0) {
      toast.warning('No tables available to export');
      return;
    }

    const headers = ['ID', 'Table Number', 'Capacity', 'Status', 'Created At'];
    const rows = tables.map((t) => [
      t.id || t._id || '',
      `"${t.tableNumber || ''}"`,
      t.capacity || 0,
      t.status || 'AVAILABLE',
      t.createdAt ? `"${new Date(t.createdAt).toISOString()}"` : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RestaurantOS_Tables_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.info('Table list exported to CSV');
  };

  return (
    <PageContainer
      title="Table & Floor Management"
      subtitle="Configure floor seating capacity, track live dining occupancy, and manage availability statuses."
      breadcrumbs={['Tables']}
      actions={
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Create Table
        </Button>
      }
    >
      {/* Search & Filter Toolbar */}
      <TableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onCreateClick={handleOpenCreate}
        onRefreshClick={fetchTables}
        onExportCSV={handleExportCSV}
      />

      {/* Main Table Grid View */}
      <TableList
        tables={tables}
        loading={loading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onCreateClick={handleOpenCreate}
      />

      {/* Create & Edit Modal Dialog */}
      <TableDialog
        open={dialogOpen}
        table={editingTable}
        loading={submitting}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmitForm}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteTableDialog
        open={deleteDialogOpen}
        table={tableToDelete}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </PageContainer>
  );
};

export default Tables;
