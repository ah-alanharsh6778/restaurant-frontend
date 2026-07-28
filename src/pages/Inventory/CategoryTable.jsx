import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DataTable from '../../components/common/DataTable';

export const CategoryTable = ({ categories = [], loading = false, onEdit, onDelete, onCreateClick }) => {
  const columns = [
    { field: 'name', headerName: 'CATEGORY NAME', renderCell: (row) => <strong>{row.name}</strong> },
    { field: 'description', headerName: 'DESCRIPTION', renderCell: (row) => row.description || 'N/A' },
    { field: 'createdAt', headerName: 'CREATED DATE', renderCell: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A' },
  ];

  const actions = [
    { label: 'Edit Category', icon: <EditIcon fontSize="small" />, onClick: (row) => onEdit(row) },
    { label: 'Delete Category', icon: <DeleteIcon fontSize="small" />, onClick: (row) => onDelete(row), color: 'error.main' },
  ];

  return (
    <DataTable
      title="Inventory Categories"
      subtitle="Group raw ingredients and supplies by food department"
      columns={columns}
      data={categories}
      loading={loading}
      onAddClick={onCreateClick}
      addButtonLabel="Create Category"
      actions={actions}
      getRowId={(row) => row.id || row._id}
    />
  );
};

export default CategoryTable;
