import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import TableStatusChip from './TableStatusChip';
import dayjs from 'dayjs';

export const TableCard = ({
  table,
  onViewDetails,
  onEditTable,
  onDeleteTable,
  onUpdateStatus,
  onOpenQrModal,
  canManage = false,
}) => {
  const tableNum = table?.tableNumber || `T-${table?.id?.substring(0, 4)}`;
  const statusUpper = String(table?.status || 'AVAILABLE').toUpperCase();

  const isAvailable = statusUpper === 'AVAILABLE';
  const isOccupied = statusUpper === 'OCCUPIED';
  const isReserved = statusUpper === 'RESERVED';
  const isMaintenance = statusUpper === 'MAINTENANCE';

  // Status configuration — Subtle border & soft glow
  const getStatusTheme = () => {
    if (isOccupied) {
      return {
        accent: '#EF4444',
        border: 'rgba(239, 68, 68, 0.3)',
        borderHover: 'rgba(239, 68, 68, 0.6)',
        bgIcon: 'rgba(239, 68, 68, 0.12)',
        glow: '0 12px 28px -6px rgba(239, 68, 68, 0.25)',
        icon: <RestaurantIcon sx={{ fontSize: 20, color: '#EF4444' }} />,
        label: 'Currently Serving',
      };
    }
    if (isReserved) {
      return {
        accent: '#F59E0B',
        border: 'rgba(245, 158, 11, 0.3)',
        borderHover: 'rgba(245, 158, 11, 0.6)',
        bgIcon: 'rgba(245, 158, 11, 0.12)',
        glow: '0 12px 28px -6px rgba(245, 158, 11, 0.25)',
        icon: <HourglassTopIcon sx={{ fontSize: 20, color: '#F59E0B' }} />,
        label: 'Upcoming Guests',
      };
    }
    if (isMaintenance) {
      return {
        accent: '#6B7280',
        border: 'rgba(107, 114, 128, 0.3)',
        borderHover: 'rgba(107, 114, 128, 0.6)',
        bgIcon: 'rgba(107, 114, 128, 0.12)',
        glow: '0 12px 28px -6px rgba(107, 114, 128, 0.2)',
        icon: <BuildIcon sx={{ fontSize: 20, color: '#6B7280' }} />,
        label: 'Unavailable',
      };
    }
    // Default: Available (Green)
    return {
      accent: '#10B981',
      border: 'rgba(16, 185, 129, 0.3)',
      borderHover: 'rgba(16, 185, 129, 0.6)',
      bgIcon: 'rgba(16, 185, 129, 0.12)',
      glow: '0 12px 28px -6px rgba(16, 185, 129, 0.25)',
      icon: <CheckCircleIcon sx={{ fontSize: 20, color: '#10B981' }} />,
      label: 'Ready to Seat',
    };
  };

  const statusTheme = getStatusTheme();

  // Customer & Booking details from table relations
  const customerName = table?.booking?.customerName || table?.customer?.fullName || table?.reservationName || null;
  const customerPhone = table?.booking?.phone || table?.customer?.phone || null;
  const bookingGuests = table?.booking?.guests || table?.capacity || 4;
  const bookingTime = table?.booking?.time || '07:30 PM';
  const bookingDate = table?.booking?.date
    ? dayjs(table.booking.date).isSame(dayjs(), 'day')
      ? 'Today'
      : dayjs(table.booking.date).format('MMM DD')
    : 'Today';

  return (
    <Card
      elevation={0}
      onClick={(e) => onViewDetails && onViewDetails(table, e)}
      sx={{
        borderRadius: '20px',
        border: '1px solid',
        borderColor: statusTheme.border,
        backgroundColor: '#131A24',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.02)',
          borderColor: statusTheme.borderHover,
          boxShadow: statusTheme.glow,
          '& .action-hint': {
            color: '#7C6CFF',
            transform: 'translateX(4px)',
          },
        },
      }}
    >
      <CardContent
        sx={{
          p: '24px !important',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: statusTheme.bgIcon,
                border: '1px solid',
                borderColor: statusTheme.border,
              }}
            >
              {statusTheme.icon}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '22px',
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                Table #{tableNum}
              </Typography>
              <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '13px', display: 'block' }}>
                Capacity: <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{table?.capacity || 4} Guests</span>
              </Typography>
            </Box>
          </Box>

          <TableStatusChip status={table?.status} />
        </Box>

        {/* Middle Details Section (Reserved vs Available vs Occupied) */}
        <Box sx={{ my: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {isReserved && customerName ? (
            <Box
              sx={{
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                p: 1.5,
                borderRadius: '14px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '15px' }}>
                  {customerName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 800, fontSize: '13px' }}>
                  {bookingGuests} Guests
                </Typography>
              </Box>

              {customerPhone && (
                <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PhoneIcon sx={{ fontSize: 14, color: '#9CA3AF' }} /> {customerPhone}
                </Typography>
              )}

              <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 600, fontSize: '13px', mt: 0.25 }}>
                {bookingTime} • {bookingDate}
              </Typography>
            </Box>
          ) : isOccupied ? (
            <Box
              sx={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                p: 1.5,
                borderRadius: '14px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '15px' }}>
                {customerName ? customerName : `Occupied Party (${table?.capacity || 4} Guests)`}
              </Typography>
              {table?.currentOrder && (
                <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 700, fontSize: '13px' }}>
                  Active Order #{table.currentOrder?.orderNumber || table.currentOrder?.id}
                </Typography>
              )}
            </Box>
          ) : (
            <Typography
              variant="body1"
              sx={{
                color: '#9CA3AF',
                fontSize: '15px',
                fontWeight: 500,
                py: 0.5,
              }}
            >
              Ready for walk-in or guest reservation.
            </Typography>
          )}
        </Box>

        {/* Bottom Action Footer */}
        <Box
          sx={{
            pt: 2,
            mt: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: '13px',
              color: statusTheme.accent,
              letterSpacing: '0.03em',
            }}
          >
            {statusTheme.label}
          </Typography>

          <Typography
            variant="caption"
            className="action-hint"
            sx={{
              fontWeight: 600,
              fontSize: '13px',
              color: '#9CA3AF',
              transition: 'all 250ms ease',
            }}
          >
            Details & Actions →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TableCard;