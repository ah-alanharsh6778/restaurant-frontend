import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getLoyaltyBadge = (points = 0) => {
    if (points >= 200) return <Chip label={`Gold (${points} pts)`} color="warning" size="small" sx={{ fontWeight: 800, fontSize: '0.725rem', borderRadius: '4px' }} />;
    if (points >= 100) return <Chip label={`Silver (${points} pts)`} color="info" size="small" sx={{ fontWeight: 800, fontSize: '0.725rem', borderRadius: '4px' }} />;
    if (points > 0) return <Chip label={`Bronze (${points} pts)`} color="success" size="small" sx={{ fontWeight: 800, fontSize: '0.725rem', borderRadius: '4px' }} />;
    return <Chip label="Standard (0 pts)" size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.725rem', borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)', color: 'text.secondary', borderRadius: '4px' }} />;
  };

  const columns = [
    {
      id: 'sNo',
      label: 'S.No.',
      minWidth: 60,
      align: 'center',
      render: (row, val, index) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          {(pagination ? (pagination.page - 1) * pagination.limit : 0) + index + 1}
        </Typography>
      ),
    },
    {
      id: 'fullName',
      label: 'Customer Identity',
      minWidth: 200,
      render: (row) => {
        const nameStr = row.fullName || 'Customer';
        const initials = nameStr.substring(0, 2).toUpperCase();

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Avatar
              variant="square"
              sx={{
                width: 36,
                height: 36,
                fontSize: '0.85rem',
                fontWeight: 800,
                bgcolor: 'primary.main',
                color: '#FFFFFF',
                borderRadius: '4px',
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.25, fontSize: '0.9rem' }} noWrap>
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
      id: 'phone',
      label: 'Phone Number',
      minWidth: 140,
      render: (row) => (
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.875rem' }}>
          {row.phone || '—'}
        </Typography>
      ),
    },
    {
      id: 'currentTable',
      label: 'Current Table',
      minWidth: 130,
      render: (row) => {
        const activeTable = (row.tables && row.tables.length > 0) ? row.tables[0] : null;
        const activeReservation = (row.reservations && row.reservations.length > 0) ? row.reservations[0] : null;
        const tableNum = activeTable?.tableNumber || activeReservation?.table?.tableNumber || null;

        return tableNum ? (
          <Chip label={`Table #${tableNum}`} color="primary" size="small" sx={{ fontWeight: 800, backgroundColor: 'primary.main', borderRadius: '4px' }} />
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
            Unseated
          </Typography>
        );
      },
    },
    {
      id: 'reservationStatus',
      label: 'Reservation Status',
      minWidth: 150,
      render: (row) => {
        const res = (row.reservations && row.reservations.length > 0) ? row.reservations[0] : null;
        if (!res) {
          return <Typography variant="caption" sx={{ color: 'text.secondary' }}>No Active Booking</Typography>;
        }
        const status = String(res.status || 'CONFIRMED').toUpperCase();
        let color = 'info';
        if (status === 'CHECKED_IN') color = 'success';
        if (status === 'CANCELLED') color = 'error';

        return <Chip label={status} color={color} size="small" sx={{ fontWeight: 800, fontSize: '0.7rem', borderRadius: '4px' }} />;
      },
    },
    {
      id: 'totalOrders',
      label: 'Total Orders',
      minWidth: 120,
      align: 'center',
      render: (row) => {
        const count = row.orders ? row.orders.length : 0;
        return (
          <Typography variant="body2" sx={{ fontWeight: 800, color: count > 0 ? 'primary.main' : 'text.secondary' }}>
            {count} {count === 1 ? 'Order' : 'Orders'}
          </Typography>
        );
      },
    },
    {
      id: 'lastVisit',
      label: 'Last Visit',
      minWidth: 130,
      render: (row) => {
        const lastOrderDate = (row.orders && row.orders.length > 0) ? row.orders[0].createdAt : row.createdAt;
        return (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            {lastOrderDate ? dayjs(lastOrderDate).format('MMM DD, YYYY') : '—'}
          </Typography>
        );
      },
    },
    {
      id: 'loyaltyPoints',
      label: 'Loyalty Tier',
      minWidth: 140,
      render: (row) => getLoyaltyBadge(row.loyaltyPoints || 0),
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '4px',
        backgroundColor: isDark ? '#131A24' : '#FFFFFF',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Table
        columns={columns}
        rows={customers}
        loading={loading}
        onRowClick={(row) => onViewClick && onViewClick(row)}
        totalCount={pagination?.total || customers.length}
        page={pagination?.page ? pagination.page - 1 : 0}
        rowsPerPage={pagination?.limit || 50}
        onPageChange={(e, newPage) => onPageChange && onPageChange(newPage + 1)}
        onRowsPerPageChange={(e) => onRowsPerPageChange && onRowsPerPageChange(parseInt(e.target.value, 10))}
        emptyMessage="No customer accounts registered in database."
      />
    </Paper>
  );
};

export default CustomerTable;
