import { Box, Chip, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DataTable from '../../components/common/DataTable';
import CategoryChip from './CategoryChip';

export const MenuTable = ({
  items = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  const columns = [
    {
      field: 'image',
      headerName: 'IMAGE',
      sortable: false,
      renderCell: (row) => (
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: 'primary.light',
            color: 'primary.main',
            fontWeight: 800,
            fontSize: '0.9rem',
          }}
        >
          {row.name ? row.name.charAt(0).toUpperCase() : <RestaurantMenuIcon fontSize="small" />}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'NAME',
      renderCell: (row) => <strong>{row.name}</strong>,
    },
    {
      field: 'category',
      headerName: 'CATEGORY',
      renderCell: (row) => <CategoryChip category={row.category || row.categoryName} />,
    },
    {
      field: 'price',
      headerName: 'PRICE ($)',
      renderCell: (row) => `$${Number(row.price || 0).toFixed(2)}`,
    },
    {
      field: 'isAvailable',
      headerName: 'AVAILABILITY',
      renderCell: (row) => {
        const isAvail = row.isAvailable !== false;
        return (
          <Chip
            label={isAvail ? 'Available' : 'Unavailable'}
            size="small"
            color={isAvail ? 'success' : 'error'}
            sx={{ fontWeight: 800, fontSize: '0.7rem' }}
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'CREATED DATE',
      renderCell: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '—',
    },
  ];

  const actions = [
    {
      label: 'View Details',
      icon: <VisibilityIcon fontSize="small" />,
      onClick: (row) => onView(row),
    },
    {
      label: 'Edit Item',
      icon: <EditIcon fontSize="small" />,
      onClick: (row) => onEdit(row),
    },
    {
      label: 'Delete Item',
      icon: <DeleteIcon fontSize="small" color="error" />,
      color: 'error.main',
      onClick: (row) => onDelete(row),
    },
  ];

  return (
    <DataTable
      title="Menu Items Catalog"
      subtitle="Complete register list of dishes, beverages, and pricing"
      columns={columns}
      data={items}
      loading={loading}
      onAddClick={onAddClick}
      addButtonLabel="Add Menu Item"
      actions={actions}
      searchPlaceholder="Search menu items..."
    />
  );
};

export default MenuTable;
