import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SupplierStatusChip from './SupplierStatusChip';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import EmptySupplierState from './EmptySupplierState';

export const SupplierTable = ({
  suppliers = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onUploadInvoice,
}) => {
  const columns = [
    {
      field: 'sNo',
      headerName: 'S.No.',
      width: 80,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return (
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            {rowIndex !== undefined && rowIndex !== null ? rowIndex + 1 : '—'}
          </Typography>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Supplier Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }} noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'contactPerson',
      headerName: 'Contact Person',
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'email',
      headerName: 'Email Address',
      flex: 1.4,
      minWidth: 180,
      renderCell: (params) => (
        <Tooltip title={params.value || ''} placement="top-start" arrow disableHoverListener={!params.value || params.value.length < 25}>
          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'primary.main', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            {params.value || '—'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      flex: 1.1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'gstNumber',
      headerName: 'GST Number',
      flex: 1.1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const isActive = params.row.isActive !== undefined ? params.row.isActive : params.row.status !== 'INACTIVE';
        return <SupplierStatusChip isActive={isActive} status={params.row.status} />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '—',
    },
  ];

  return (
    <CommonDataGrid
      rows={suppliers}
      columns={columns}
      loading={loading}
      onRowClick={(params) => onView && onView(params.row)}
      emptyComponent={<EmptySupplierState />}
    />
  );
};

export default SupplierTable;
