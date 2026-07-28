import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DataTable from '../../components/common/DataTable';

export const WarehouseTable = ({ warehouses = [], loading = false, onEdit, onDelete, onCreateClick }) => {
  const columns = [
    { field: 'name', headerName: 'WAREHOUSE NAME', renderCell: (row) => <strong>{row.name}</strong> },
    { field: 'location', headerName: 'LOCATION / ADDRESS', renderCell: (row) => row.location || 'Main Floor' },
    { field: 'capacity', headerName: 'STORAGE CAPACITY', renderCell: (row) => `${row.capacity || 1000} units` },
    {
      field: 'status',
      headerName: 'STATUS',
      type: 'chip',
      chipColor: (status) => (status === 'ACTIVE' ? 'success' : 'warning'),
    },
  ];

  const actions = [
    { label: 'Edit Warehouse', icon: <EditIcon fontSize="small" />, onClick: (row) => onEdit(row) },
    { label: 'Delete Warehouse', icon: <DeleteIcon fontSize="small" />, onClick: (row) => onDelete(row), color: 'error.main' },
  ];

  return (
    <DataTable
      title="Warehouse & Storage Locations"
      subtitle="Physical cold storages, pantries, and dry ingredient depots"
      columns={columns}
      data={warehouses}
      loading={loading}
      onAddClick={onCreateClick}
      addButtonLabel="Create Warehouse"
      actions={actions}
      getRowId={(row) => row.id || row._id}
    />
  );
};

export default WarehouseTable;
