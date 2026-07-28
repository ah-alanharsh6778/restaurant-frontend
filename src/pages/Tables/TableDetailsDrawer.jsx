import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TableBarIcon from '@mui/icons-material/TableBar';
import PeopleIcon from '@mui/icons-material/People';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PrintIcon from '@mui/icons-material/Print';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import BuildIcon from '@mui/icons-material/Build';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import TableStatusChip from './TableStatusChip';
import LiveOccupancyTimer from './LiveOccupancyTimer';

export const TableDetailsDrawer = ({ open, onClose, table }) => {
  const [tabIndex, setTabIndex] = useState(0);

  if (!table) return null;

  const tableNum = table.tableNumber || table.number || `T-${table.id}`;
  const statusUpper = String(table.status || 'AVAILABLE').toUpperCase();
  const isOccupied = statusUpper === 'OCCUPIED';

  const assignedWaiter = table.waiterName || table.waiter || (isOccupied ? 'Sarah Jenkins' : 'Unassigned');
  const currentOrder = table.currentOrder || (isOccupied ? { orderNumber: 'ORD-1785091741399', amount: 84.50, items: 4, billStatus: 'Printed', time: '25 mins ago' } : null);

  const handlePrintQR = () => {
    toast.info(`Printing QR Code label for Table ${tableNum}...`);
    window.print();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 440 },
          p: 0,
        },
      }}
    >
      {/* Drawer Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <TableBarIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Table {tableNum} Specifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Floor: {table.floor || 'Main Dining'} • Section A
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main Drawer Content */}
      <Box sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto' }}>
        {/* Status & Live Timer Banner */}
        <Paper elevation={0} sx={{ p: 2, mb: 2.5, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableStatusChip status={table.status} size="medium" />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Cap: {table.capacity || 4} Guests
            </Typography>
          </Box>
          <LiveOccupancyTimer isOccupied={isOccupied} startTime={table.occupiedAt} />
        </Paper>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} variant="fullWidth">
            <Tab label="Current Status" sx={{ fontWeight: 700, textTransform: 'none' }} />
            <Tab label="QR Code" sx={{ fontWeight: 700, textTransform: 'none' }} />
            <Tab label="History" sx={{ fontWeight: 700, textTransform: 'none' }} />
          </Tabs>
        </Box>

        {/* Tab 0: Current Status */}
        {tabIndex === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Assigned Waiter & Staff
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontWeight: 700 }}>
                  {assignedWaiter.slice(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {assignedWaiter}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lead Wait Staff • Shift 1
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {isOccupied && currentOrder && (
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Active Order Details
                  </Typography>
                  <Chip label={currentOrder.billStatus} color="warning" size="small" sx={{ fontWeight: 700 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                  Order #{currentOrder.orderNumber}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  {currentOrder.items} Items • Total Bill: ${Number(currentOrder.amount).toFixed(2)}
                </Typography>
                <Button variant="outlined" size="small" fullWidth sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1.5 }}>
                  Open Order Terminal
                </Button>
              </Paper>
            )}

            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Cleaning & Maintenance Log
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <CleaningServicesIcon fontSize="small" color="info" />
                <Typography variant="caption" color="text.secondary">
                  Last Sanitized: Today at 01:15 PM by Carlos D.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BuildIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Maintenance Status: All seats & fixtures verified functional
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Tab 1: QR Code */}
        {tabIndex === 1 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Paper elevation={0} sx={{ p: 3, display: 'inline-block', borderRadius: 3, border: '2px dashed', borderColor: 'primary.main', mb: 2 }}>
              <QrCode2Icon sx={{ fontSize: 140, color: 'primary.main' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 1 }}>
                Table {tableNum} Digital Menu QR Code
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Scan to view menu & order online
              </Typography>
            </Paper>
            <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrintQR} fullWidth sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
              Print Table QR Menu Stand
            </Button>
          </Box>
        )}

        {/* Tab 2: History */}
        {tabIndex === 2 && (
          <List disablePadding>
            <ListItem sx={{ py: 1.5 }}>
              <ListItemIcon><ShoppingCartIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Order ORD-1785091741399 Completed ($500.00)" secondary="Jul 26, 2026 at 11:49 AM" />
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 1.5 }}>
              <ListItemIcon><HistoryIcon color="success" /></ListItemIcon>
              <ListItemText primary="Reservation Checked-In (Party of 4)" secondary="Jul 25, 2026 at 07:30 PM" />
            </ListItem>
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default TableDetailsDrawer;
