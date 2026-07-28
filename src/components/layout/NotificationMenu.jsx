import { useState } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmptyState from '../common/EmptyState';

export const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order #ORD-104 received from Table 7', time: '4 mins ago' },
    { id: 2, text: 'Low stock alert: Fresh Tomatoes below 15 kg', time: '18 mins ago' },
    { id: 3, text: 'PO #8801 status updated to RECEIVED', time: '1 hr ago' },
  ]);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: { width: 340, borderRadius: 3, mt: 1, p: 0 },
          },
        }}
      >
        <Box p={1.5} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={700}>
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Typography
              variant="caption"
              color="primary"
              onClick={handleMarkAllRead}
              sx={{ cursor: 'pointer', fontWeight: 700 }}
            >
              Mark all as read
            </Typography>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box p={2}>
            <EmptyState
              title="All Caught Up!"
              description="You have read all pending system notifications."
              icon={<CheckCircleIcon color="success" sx={{ fontSize: 36 }} />}
            />
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((item) => (
              <ListItem key={item.id} sx={{ py: 1.2, px: 1.5, borderRadius: 2 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <InfoIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  slotProps={{ primary: { fontSize: '0.825rem', fontWeight: 600 } }}
                  secondary={item.time}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
};

export default NotificationMenu;
