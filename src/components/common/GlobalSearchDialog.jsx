import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TableBarIcon from '@mui/icons-material/TableBar';
import PeopleIcon from '@mui/icons-material/People';

export const GlobalSearchDialog = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut binding CTRL + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) {
          onClose();
        } else {
          // Trigger open via custom event or prop
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const searchItems = [
    { label: 'POS Orders Register', category: 'Orders', icon: <ShoppingCartIcon color="primary" />, path: '/orders' },
    { label: 'Menu Catalog & Categories', category: 'Menu', icon: <RestaurantMenuIcon color="secondary" />, path: '/menu' },
    { label: 'Supplier Contacts & Vendors', category: 'Suppliers', icon: <LocalShippingIcon color="info" />, path: '/suppliers' },
    { label: 'Stock Products & Warehouses', category: 'Inventory', icon: <InventoryIcon color="success" />, path: '/inventory' },
    { label: 'Expense Invoices & OCR', category: 'Expenses', icon: <ReceiptIcon color="warning" />, path: '/expenses' },
    { label: 'Restaurant Dining Tables', category: 'Tables', icon: <TableBarIcon color="error" />, path: '/tables' },
    { label: 'Enterprise User Accounts', category: 'Users', icon: <PeopleIcon color="primary" />, path: '/users' },
  ];

  const filtered = searchItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 3,
          p: 1,
          top: -80,
        },
      }}
    >
      <Box sx={{ p: 1.5 }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="Type a command or search (e.g. Orders, Inventory, Users)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Chip label="ESC" size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                </InputAdornment>
              ),
            },
          }}
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
      </Box>

      <Divider />

      <DialogContent sx={{ p: 1, maxHeight: 380 }}>
        {filtered.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No matching modules or entity records found for "{query}".
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map((item, idx) => (
              <ListItemButton
                key={idx}
                onClick={() => handleSelect(item.path)}
                sx={{ borderRadius: 2, mb: 0.5, py: 1.2 }}
              >
                <ListItemIcon sx={{ minWidth: 42 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.label}</Typography>}
                  secondary={<Typography variant="caption" color="text.secondary">{item.path}</Typography>}
                />
                <Chip label={item.category} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600 }} />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearchDialog;
