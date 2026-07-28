import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const NotificationDrawer = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Low Stock Alert: Organic Whole Milk',
      description: 'Current stock (15 L) has fallen below minimum safety threshold (20 L).',
      time: '10 mins ago',
      type: 'inventory',
      read: false,
      icon: <WarningIcon color="warning" />,
    },
    {
      id: '2',
      title: 'New POS Order Submitted',
      description: 'Order #ORD-1785091741399 submitted for Table T-PATIO-2 ($500.00).',
      time: '25 mins ago',
      type: 'order',
      read: false,
      icon: <ShoppingCartIcon color="primary" />,
    },
    {
      id: '3',
      title: 'Expense AI OCR Processed',
      description: 'Invoice #INV-PWR-1092 processed successfully ($495.00).',
      time: '1 hour ago',
      type: 'expense',
      read: true,
      icon: <ReceiptIcon color="success" />,
    },
    {
      id: '4',
      title: 'Purchase Order Delivered',
      description: 'PO #PO-1785103003208 marked as DELIVERED by Organic Dairy Logistics.',
      time: '3 hours ago',
      type: 'purchase',
      read: true,
      icon: <AssignmentIcon color="info" />,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 380 },
          p: 0,
        },
      }}
    >
      {/* Drawer Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Notification Center
          </Typography>
          {unreadCount > 0 && <Chip label={`${unreadCount} New`} color="primary" size="small" sx={{ fontWeight: 700 }} />}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Action Bar */}
      <Box sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'action.hover' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          Recent Telemetry Alerts
        </Typography>
        <Button size="small" onClick={handleMarkAllRead} disabled={unreadCount === 0} sx={{ textTransform: 'none', fontWeight: 600 }}>
          Mark all as read
        </Button>
      </Box>

      {/* Notifications List */}
      <List disablePadding sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {notifications.map((n) => (
          <React.Fragment key={n.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                px: 2.5,
                py: 2,
                bgcolor: n.read ? 'transparent' : 'action.hover',
                transition: 'background-color 0.2s',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>{n.icon}</ListItemIcon>
              <ListItemText
                slotProps={{ secondary: { component: 'div' } }}
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: n.read ? 600 : 800, color: 'text.primary' }}>
                      {n.title}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.4 }}>
                      {n.description}
                    </Typography>
                    <Typography component="div" variant="caption" color="text.secondary">
                      {n.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default NotificationDrawer;
