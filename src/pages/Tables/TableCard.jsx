import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Button,
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import BuildIcon from '@mui/icons-material/Build';

import QrCode2Icon from '@mui/icons-material/QrCode2';

import TableStatusChip from './TableStatusChip';
import ActionMenu from '../../components/common/ActionMenu';

export const TableCard = ({
  table,
  onViewDetails,
  onEditTable,
  onDeleteTable,
  onUpdateStatus,
  onOpenQrModal,
  canManage = false,
}) => {
  const tableNum = table.tableNumber || `T-${table.id?.substring(0, 4)}`;
  const statusUpper = String(table.status || 'AVAILABLE').toUpperCase();

  const isAvailable = statusUpper === 'AVAILABLE';
  const isOccupied = statusUpper === 'OCCUPIED';
  const isReserved = statusUpper === 'RESERVED';
  const isMaintenance = statusUpper === 'MAINTENANCE';

  const getBorderColor = () => {
    if (isOccupied) return 'error.main';
    if (isReserved) return 'warning.main';
    if (isMaintenance) return 'grey.500';
    return 'success.main';
  };

  const actions = [
    {
      label: 'QR Order Code',
      icon: <QrCode2Icon fontSize="small" />,
      color: 'primary',
      onClick: (e) => onOpenQrModal && onOpenQrModal(table, e),
    },
    {
      label: 'View Details',
      icon: <VisibilityIcon fontSize="small" />,
      onClick: (e) => onViewDetails(table, e),
    },
    ...(canManage
      ? [
          {
            label: 'Edit Table',
            icon: <EditIcon fontSize="small" />,
            color: 'primary',
            onClick: (e) => onEditTable(table, e),
          },
          {
            label: 'Delete Table',
            icon: <DeleteIcon fontSize="small" />,
            color: 'error',
            onClick: (e) => onDeleteTable(table, e),
          },
        ]
      : []),
  ];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1.5px solid',
        borderColor: getBorderColor(),
        bgcolor: '#FFFFFF',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', '&:last-child': { pb: 2.5 } }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: isOccupied ? 'error.50' : isReserved ? 'warning.50' : isMaintenance ? 'grey.100' : 'success.50',
                color: isOccupied ? 'error.main' : isReserved ? 'warning.main' : isMaintenance ? 'grey.700' : 'success.main',
                width: 44,
                height: 44,
                fontWeight: 800,
              }}
            >
              {isMaintenance ? <BuildIcon /> : <TableBarIcon />}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Table #{tableNum}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Seating Capacity: {table.capacity || 4} Guests
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TableStatusChip status={table.status} />
            <ActionMenu actions={actions} />
          </Box>
        </Box>

        {/* Quick Action Button Row — Updates status directly in DB via PUT /api/tables/:id */}
        <Box sx={{ pt: 1, mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {isAvailable && (
            <Button
              variant="contained"
              color="error"
              size="small"
              fullWidth
              startIcon={<TableBarIcon />}
              onClick={() => onUpdateStatus(table.id, 'OCCUPIED')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Mark Occupied
            </Button>
          )}

          {isOccupied && (
            <Button
              variant="contained"
              color="success"
              size="small"
              fullWidth
              startIcon={<CheckCircleIcon />}
              onClick={() => onUpdateStatus(table.id, 'AVAILABLE')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Release Table (Make Available)
            </Button>
          )}

          {isReserved && (
            <Button
              variant="contained"
              color="error"
              size="small"
              fullWidth
              startIcon={<TableBarIcon />}
              onClick={() => onUpdateStatus(table.id, 'OCCUPIED')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Check-In Guest (Occupied)
            </Button>
          )}

          {isMaintenance && (
            <Button
              variant="outlined"
              color="success"
              size="small"
              fullWidth
              startIcon={<CheckCircleIcon />}
              onClick={() => onUpdateStatus(table.id, 'AVAILABLE')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Finish Maintenance (Available)
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TableCard;
