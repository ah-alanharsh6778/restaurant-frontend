import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import ActionMenu from '../../components/common/ActionMenu';
import EmptyExpenseState from './EmptyExpenseState';

export const ExpenseCategoriesPage = ({
  categories = [],
  loading = false,
  onOpenAdd,
  onOpenEdit,
  onOpenDelete,
}) => {
  const columns = [
    {
      field: 'name',
      headerName: 'Category Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? dayjs(params.value).format('MMM DD, YYYY') : 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const rowActions = [
          {
            label: 'Edit Category',
            icon: <EditIcon fontSize="small" />,
            color: 'primary',
            onClick: () => onOpenEdit(params.row),
          },
          {
            label: 'Delete Category',
            icon: <DeleteIcon fontSize="small" />,
            color: 'error',
            onClick: () => onOpenDelete(params.row),
          },
        ];
        return <ActionMenu actions={rowActions} />;
      },
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Expense Categories ({categories.length})
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onOpenAdd}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Add Category
        </Button>
      </Box>

      <CommonDataGrid
        rows={categories}
        columns={columns}
        loading={loading}
        emptyComponent={
          <EmptyExpenseState
            title="No Categories Found"
            description="Get started by creating your first expense category."
            actionLabel="Create Category"
            onAction={onOpenAdd}
          />
        }
      />
    </Box>
  );
};

export default ExpenseCategoriesPage;
