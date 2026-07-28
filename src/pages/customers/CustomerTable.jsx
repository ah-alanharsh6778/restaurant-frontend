import React from 'react';
import { Box, Typography, IconButton, Tooltip, Avatar, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { Table } from '../../components/ui/Table';

export const CustomerTable = ({
  customers = [],
  loading = false,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onViewClick,
  onEditClick,
  onDeleteClick,
  userRole,
}) => {
  const isOwnerOrAdmin = ['ADMIN', 'MANAGER'].includes(
    String(userRole || '').toUpperCase()
  );

  const getLoyaltyBadge = (points = 0) => {
    if (points >= 200) return <Chip label={`Gold (${points} pts)`} color="warning" size="small" sx={{ fontWeight: 800, fontSize: '0.725rem' }} />;
    if (points >= 100) return <Chip label={`Silver (${points} pts)`} color="info" size="small" sx={{ fontWeight: 800, fontSize: '0.725rem' }} />;
    if (points > 0) return <Chip label={`Bronze (${points} pts)`} color="success" size="small" sx={{ fontWeight: 800, fontSize: '0.725rem' }} />;
    return <Chip label="Standard (0 pts)" size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.725rem' }} />;
  };

  const columns = [
    {
      id: 'fullName',
      label: 'Customer Identity',
      minWidth: 220,
      render: (row) => {
        const nameStr = row.fullName || 'Customer';
        const initials = nameStr.substring(0, 2).toUpperCase();

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                fontSize: '0.8rem',
                fontWeight: 800,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.25, fontSize: '0.875rem' }} noWrap>
                {nameStr}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2, fontSize: '0.75rem', mt: 0.25 }} noWrap>
                ID: {row.id ? row.id.substring(0, 8) : '—'}...
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'email',
      label: 'Email Address',
      minWidth: 200,
      render: (row) => {
        const emailStr = row.email || '—';
        return (
          <Tooltip title={emailStr} placement="top-start" arrow disableHoverListener={emailStr.length < 25}>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.875rem' }}>
              {emailStr}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: 'phone',
      label: 'Phone Number',
      minWidth: 150,
      render: (row) => (
        <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.875rem' }}>
          {row.phone || '—'}
        </Typography>
      ),
    },
    {
      id: 'loyaltyPoints',
      label: 'Loyalty Tier',
      minWidth: 160,
      render: (row) => getLoyaltyBadge(row.loyaltyPoints || 0),
    },
    {
      id: 'createdAt',
      label: 'Joined Date',
      minWidth: 140,
      render: (row) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          {row.createdAt ? dayjs(row.createdAt).format('MMM DD, YYYY') : '—'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 130,
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
          {onViewClick && (
            <Tooltip title="View Customer Profile" arrow>
              <IconButton size="small" onClick={() => onViewClick(row)} color="primary">
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {onEditClick && (
            <Tooltip title="Edit Customer" arrow>
              <IconButton size="small" onClick={() => onEditClick(row)} color="info">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {isOwnerOrAdmin && onDeleteClick && (
            <Tooltip title="Delete Customer" arrow>
              <IconButton size="small" onClick={() => onDeleteClick(row)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={customers}
      loading={loading}
      totalCount={pagination?.total || customers.length}
      page={pagination?.page ? pagination.page - 1 : 0}
      rowsPerPage={pagination?.limit || 50}
      onPageChange={(e, newPage) => onPageChange && onPageChange(newPage + 1)}
      onRowsPerPageChange={(e) => onRowsPerPageChange && onRowsPerPageChange(parseInt(e.target.value, 10))}
      emptyMessage="No customer accounts registered in database."
    />
  );
};

export default CustomerTable;
