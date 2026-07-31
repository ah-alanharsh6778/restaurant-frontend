import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import dayjs from 'dayjs';

const KANBAN_COLUMNS = [
  { id: 'PENDING', label: 'Pending Orders', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', icon: <HourglassTopIcon sx={{ fontSize: 18, color: '#F59E0B' }} /> },
  { id: 'PREPARING', label: 'Kitchen Preparing', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)', icon: <RestaurantIcon sx={{ fontSize: 18, color: '#3B82F6' }} /> },
  { id: 'READY', label: 'Ready to Serve', color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', icon: <CheckCircleIcon sx={{ fontSize: 18, color: '#10B981' }} /> },
  { id: 'SERVED', label: 'Served & Dining', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)', icon: <LocalShippingIcon sx={{ fontSize: 18, color: '#8B5CF6' }} /> },
];

export const OrderKanbanBoard = ({
  orders = [],
  onView,
  onEditStatus,
  onCheckout,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getNextStatus = (currentStatus) => {
    const s = String(currentStatus).toUpperCase();
    if (s === 'PENDING' || s === 'CONFIRMED') return 'PREPARING';
    if (s === 'PREPARING') return 'READY';
    if (s === 'READY') return 'SERVED';
    return null;
  };

  const getNextLabel = (currentStatus) => {
    const next = getNextStatus(currentStatus);
    if (next === 'PREPARING') return 'Prepare';
    if (next === 'READY') return 'Mark Ready';
    if (next === 'SERVED') return 'Serve';
    return null;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3,
        alignItems: 'start',
      }}
    >
      {KANBAN_COLUMNS.map((col) => {
        const colOrders = orders.filter((o) => {
          const st = String(o.status || '').toUpperCase();
          if (col.id === 'PENDING') return st === 'PENDING' || st === 'CONFIRMED';
          return st === col.id;
        });

        return (
          <Paper
            key={col.id}
            elevation={0}
            sx={{
              borderRadius: '16px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minHeight: 500,
            }}
          >
            {/* Column Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 1.5,
                borderBottom: `2px solid ${col.color}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {col.icon}
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '15px', color: 'text.primary' }}>
                  {col.label}
                </Typography>
              </Box>
              <Chip
                label={colOrders.length}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: '12px',
                  backgroundColor: col.bg,
                  color: col.color,
                  height: 24,
                  borderRadius: '8px',
                }}
              />
            </Box>

            {/* Column Cards */}
            <Stack spacing={2}>
              {colOrders.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: '12px',
                    border: '1px dashed',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    No {col.label.toLowerCase()}
                  </Typography>
                </Box>
              ) : (
                colOrders.map((ord) => {
                  const elapsedMins = dayjs().diff(dayjs(ord.createdAt), 'minute');
                  const isDelayed = elapsedMins > 20 && (col.id === 'PENDING' || col.id === 'PREPARING');
                  const nextStatus = getNextStatus(ord.status);
                  const nextLabel = getNextLabel(ord.status);
                  const tableName = ord.table?.tableNumber ? `Table #${ord.table.tableNumber}` : 'Takeout / Direct';
                  const total = Number(ord.totalAmount || ord.total || 0);
                  const isPaid = String(ord.paymentStatus || '').toUpperCase() === 'PAID';

                  return (
                    <Paper
                      key={ord.id || ord._id}
                      elevation={0}
                      onClick={() => onView && onView(ord)}
                      sx={{
                        p: 2,
                        borderRadius: '14px',
                        backgroundColor: isDark ? '#131A24' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: isDelayed
                          ? '#EF4444'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 6px 16px rgba(0, 0, 0, 0.08)',
                        },
                      }}
                    >
                      {/* Card Top Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '15px', color: 'text.primary' }}>
                          #{ord.orderNumber || ord.id?.substring(0, 6)}
                        </Typography>

                        <Chip
                          icon={<AccessTimeIcon sx={{ fontSize: '12px !important' }} />}
                          label={`${elapsedMins}m ago`}
                          size="small"
                          sx={{
                            fontSize: '11px',
                            fontWeight: 700,
                            height: 22,
                            backgroundColor: isDelayed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(124, 108, 255, 0.1)',
                            color: isDelayed ? '#EF4444' : '#7C6CFF',
                          }}
                        />
                      </Box>

                      {/* Customer / Table Info */}
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                          {tableName}
                        </Typography>
                        {ord.customer?.fullName && (
                          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>
                            {ord.customer.fullName}
                          </Typography>
                        )}
                      </Box>

                      {/* Order Items Preview */}
                      {ord.items && ord.items.length > 0 && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5, fontStyle: 'italic' }}>
                          {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}: {ord.items.map((i) => i.menuItem?.name || i.name || 'Dish').slice(0, 2).join(', ')}
                          {ord.items.length > 2 ? '...' : ''}
                        </Typography>
                      )}

                      {/* Total & Payment Badge */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)' }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                          ${total.toFixed(2)}
                        </Typography>

                        <Chip
                          label={isPaid ? 'PAID' : 'UNPAID'}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '10px',
                            height: 20,
                            backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: isPaid ? '#10B981' : '#F59E0B',
                          }}
                        />
                      </Box>

                      {/* Advance Status Button */}
                      {nextStatus && (
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditStatus && onEditStatus(ord, nextStatus);
                          }}
                          sx={{
                            mt: 1.5,
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '12px',
                            textTransform: 'none',
                            py: 0.6,
                            borderColor: col.color,
                            color: col.color,
                            '&:hover': {
                              backgroundColor: col.bg,
                              borderColor: col.color,
                            },
                          }}
                        >
                          {nextLabel}
                        </Button>
                      )}

                      {col.id === 'SERVED' && (
                        <Button
                          fullWidth
                          size="small"
                          variant="contained"
                          startIcon={<AttachMoneyIcon sx={{ fontSize: 14 }} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCheckout && onCheckout(ord);
                          }}
                          sx={{
                            mt: 1.5,
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '12px',
                            textTransform: 'none',
                            py: 0.6,
                            backgroundColor: '#10B981',
                            color: '#FFFFFF',
                            '&:hover': { backgroundColor: '#059669' },
                          }}
                        >
                          Checkout POS
                        </Button>
                      )}
                    </Paper>
                  );
                })
              )}
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
};

export default OrderKanbanBoard;
