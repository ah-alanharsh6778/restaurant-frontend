import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
  Button,
  IconButton,
  Grid,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
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
    if (points >= 200) return <Chip icon={<StarIcon sx={{ fontSize: '14px !important', color: '#FFD700 !important' }} />} label={`Gold (${points} pts)`} size="small" sx={{ fontWeight: 800, fontSize: '0.725rem', backgroundColor: 'rgba(255, 215, 0, 0.15)', color: '#FFD700', borderRadius: '6px' }} />;
    if (points >= 100) return <Chip icon={<StarIcon sx={{ fontSize: '14px !important', color: '#C0C0C0 !important' }} />} label={`Silver (${points} pts)`} size="small" sx={{ fontWeight: 800, fontSize: '0.725rem', backgroundColor: 'rgba(192, 192, 192, 0.15)', color: isDark ? '#E2E8F0' : '#475569', borderRadius: '6px' }} />;
    if (points > 0) return <Chip label={`Bronze (${points} pts)`} size="small" sx={{ fontWeight: 800, fontSize: '0.725rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderRadius: '6px' }} />;
    return <Chip label="Standard (0 pts)" size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.725rem', borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)', color: 'text.secondary', borderRadius: '6px' }} />;
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
                width: 38,
                height: 38,
                fontSize: '0.85rem',
                fontWeight: 800,
                bgcolor: '#7C6CFF',
                color: '#FFFFFF',
                borderRadius: '8px',
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
          <Chip label={`Table #${tableNum}`} color="primary" size="small" sx={{ fontWeight: 800, backgroundColor: '#7C6CFF', borderRadius: '6px' }} />
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

        return <Chip label={status} color={color} size="small" sx={{ fontWeight: 800, fontSize: '0.7rem', borderRadius: '6px' }} />;
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
          <Typography variant="body2" sx={{ fontWeight: 800, color: count > 0 ? '#7C6CFF' : 'text.secondary' }}>
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
    <Box sx={{ width: '100%' }}>
      {/* Desktop Table View */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
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
      </Box>

      {/* Mobile Responsive Customer Cards View */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {customers.length === 0 && !loading ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '16px',
              backgroundColor: isDark ? '#131A24' : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              No customer records found.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {customers.map((cust) => {
              const nameStr = cust.fullName || 'Customer';
              const initials = nameStr.substring(0, 2).toUpperCase();
              const activeTable = (cust.tables && cust.tables.length > 0) ? cust.tables[0] : null;
              const activeReservation = (cust.reservations && cust.reservations.length > 0) ? cust.reservations[0] : null;
              const tableNum = activeTable?.tableNumber || activeReservation?.table?.tableNumber || null;
              const orderCount = cust.orders ? cust.orders.length : 0;
              const lastVisit = (cust.orders && cust.orders.length > 0) ? cust.orders[0].createdAt : cust.createdAt;

              return (
                <Grid item xs={12} sm={6} key={cust.id || cust._id}>
                  <Paper
                    elevation={0}
                    onClick={() => onViewClick && onViewClick(cust)}
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      backgroundColor: isDark ? '#131A24' : '#FFFFFF',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: isDark ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.04)',
                      transition: 'all 200ms ease',
                      '&:active': { transform: 'scale(0.98)' },
                    }}
                  >
                    {/* Header: Avatar + Loyalty + Table */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 44,
                            height: 44,
                            fontSize: '1rem',
                            fontWeight: 800,
                            bgcolor: '#7C6CFF',
                            color: '#FFFFFF',
                            borderRadius: '12px',
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1rem', lineHeight: 1.2 }}>
                            {nameStr}
                          </Typography>
                          {cust.phone && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                              <PhoneIcon sx={{ fontSize: 13 }} /> {cust.phone}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {getLoyaltyBadge(cust.loyaltyPoints || 0)}
                    </Box>

                    {/* Meta Row: Orders & Seating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: '12px', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC', mb: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                          ORDERS
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: orderCount > 0 ? '#7C6CFF' : 'text.secondary' }}>
                          {orderCount} {orderCount === 1 ? 'Order' : 'Orders'}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                          SEATING
                        </Typography>
                        {tableNum ? (
                          <Chip label={`Table #${tableNum}`} size="small" sx={{ fontWeight: 800, backgroundColor: '#7C6CFF', color: '#FFFFFF', height: 22, borderRadius: '6px' }} />
                        ) : (
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Unseated
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Touch Target Action Buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1, borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)' }}>
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewClick && onViewClick(cust);
                        }}
                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, py: 0.8 }}
                      >
                        Profile
                      </Button>

                      {onEditClick && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick(cust);
                          }}
                          sx={{ p: 1, border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '10px' }}
                        >
                          <EditIcon sx={{ fontSize: 18, color: '#7C6CFF' }} />
                        </IconButton>
                      )}

                      {onDeleteClick && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(cust);
                          }}
                          sx={{ p: 1, border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '10px' }}
                        >
                          <DeleteIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                        </IconButton>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default CustomerTable;
