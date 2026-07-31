import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import QrCode2Icon from '@mui/icons-material/QrCode2';
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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const tableNum = table?.tableNumber || `T-${table?.id?.substring(0, 4)}`;
  const statusUpper = String(table?.status || 'AVAILABLE').toUpperCase();

  const isAvailable = statusUpper === 'AVAILABLE';
  const isOccupied = statusUpper === 'OCCUPIED';
  const isReserved = statusUpper === 'RESERVED';

  // Status configuration with vibrant HSL colors & glowing accent borders
  const getStatusTheme = () => {
    if (isOccupied) {
      return {
        accent: '#EF4444',
        border: isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.45)',
        borderHover: '#EF4444',
        bgIcon: 'rgba(239, 68, 68, 0.12)',
        glow: '0 12px 28px -4px rgba(239, 68, 68, 0.3)',
        icon: <RestaurantIcon sx={{ fontSize: 20, color: '#EF4444' }} />,
        label: 'Currently Serving',
        cardBg: isDark ? 'rgba(239, 68, 68, 0.04)' : '#FFF5F5',
      };
    }
    if (isReserved) {
      return {
        accent: '#F59E0B',
        border: isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.45)',
        borderHover: '#F59E0B',
        bgIcon: 'rgba(245, 158, 11, 0.12)',
        glow: '0 12px 28px -4px rgba(245, 158, 11, 0.3)',
        icon: <HourglassTopIcon sx={{ fontSize: 20, color: '#F59E0B' }} />,
        label: 'Upcoming Booking',
        cardBg: isDark ? 'rgba(245, 158, 11, 0.04)' : '#FFFBEB',
      };
    }
    // Default: Available (Emerald Green)
    return {
      accent: '#10B981',
      border: isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.45)',
      borderHover: '#10B981',
      bgIcon: 'rgba(16, 185, 129, 0.12)',
      glow: '0 12px 28px -4px rgba(16, 185, 129, 0.3)',
      icon: <CheckCircleIcon sx={{ fontSize: 20, color: '#10B981' }} />,
      label: 'Ready to Seat',
      cardBg: isDark ? 'rgba(16, 185, 129, 0.04)' : '#ECFDF5',
    };
  };

  const statusTheme = getStatusTheme();

  // Customer & Booking details
  const customerName = table?.booking?.customerName || table?.customer?.fullName || table?.reservationName || null;
  const customerPhone = table?.booking?.phone || table?.customer?.phone || null;
  const bookingGuests = table?.booking?.guests || table?.capacity || 4;
  const bookingTime = table?.booking?.time || '07:30 PM';

  return (
    <Card
      elevation={0}
      onClick={(e) => onViewDetails && onViewDetails(table, e)}
      sx={{
        borderRadius: '20px',
        border: '1px solid',
        borderColor: statusTheme.border,
        backgroundColor: isDark ? '#131A24' : '#FFFFFF',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: statusTheme.borderHover,
          boxShadow: statusTheme.glow,
          '& .action-hint': {
            color: '#7C6CFF',
            transform: 'translateX(4px)',
          },
        },
      }}
    >
      {/* Top Accent Line */}
      <Box sx={{ height: 4, width: '100%', backgroundColor: statusTheme.accent }} />

      <CardContent
        sx={{
          p: '20px !important',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: statusTheme.bgIcon,
                border: `1px solid ${statusTheme.border}`,
              }}
            >
              {statusTheme.icon}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '20px',
                  color: 'text.primary',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                Table #{tableNum}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <span>Capacity: <strong>{table?.capacity || 4} Guests</strong></span>
              </Typography>
            </Box>
          </Box>

          <TableStatusChip status={table?.status} />
        </Box>

        {/* Dynamic Telemetry Box */}
        <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {isReserved && customerName ? (
            <Box
              sx={{
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                p: 1.5,
                borderRadius: '14px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '14px' }}>
                  {customerName}
                </Typography>
                <Chip
                  label={`${bookingGuests} Guests`}
                  size="small"
                  sx={{ fontWeight: 800, fontSize: '11px', height: 22, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}
                />
              </Box>
              {customerPhone && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PhoneIcon sx={{ fontSize: 13, color: 'text.secondary' }} /> {customerPhone}
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 700, fontSize: '12px', mt: 0.25 }}>
                Reserved for {bookingTime}
              </Typography>
            </Box>
          ) : isOccupied ? (
            <Box
              sx={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                p: 1.5,
                borderRadius: '14px',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '14px' }}>
                {customerName ? customerName : `Occupied Party (${table?.capacity || 4} Guests)`}
              </Typography>
              <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 700, fontSize: '12px' }}>
                Active Order #{table?.currentOrder?.orderNumber || table?.currentOrder?.id || 'POS-Live'}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                p: 1.5,
                borderRadius: '14px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', fontWeight: 500 }}>
                Ready for immediate guest walk-in or phone reservation.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer Actions */}
        <Box
          sx={{
            pt: 1.5,
            mt: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              fontSize: '12px',
              color: statusTheme.accent,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {statusTheme.label}
          </Typography>

          <Typography
            variant="caption"
            className="action-hint"
            sx={{
              fontWeight: 700,
              fontSize: '13px',
              color: 'text.secondary',
              transition: 'all 250ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
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