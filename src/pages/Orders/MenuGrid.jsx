import { useState, useMemo } from 'react';
import { Grid, TextField, InputAdornment, Box, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuCard from './MenuCard';
import EmptyState from '../../components/common/EmptyState';

export const MenuGrid = ({ menuItems = [], selectedCategory = 'ALL', loading = false, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const defaultItems = [
    { id: 'm1', name: 'Margherita Woodfired Pizza', categoryName: 'Main Course', price: 14.50, isAvailable: true },
    { id: 'm2', name: 'Truffle Pasta Carbonara', categoryName: 'Main Course', price: 18.00, isAvailable: true },
    { id: 'm3', name: 'Crispy Calamari Rings', categoryName: 'Starters & Appetizers', price: 9.50, isAvailable: true },
    { id: 'm4', name: 'Iced Artisan Latte', categoryName: 'Beverages & Drinks', price: 4.80, isAvailable: true },
    { id: 'm5', name: 'Classic Tiramisu Cake', categoryName: 'Desserts & Sweets', price: 7.20, isAvailable: true },
    { id: 'm6', name: 'Grilled Ribeye Steak 300g', categoryName: 'Main Course', price: 32.00, isAvailable: true },
  ];

  const items = menuItems.length > 0 ? menuItems : defaultItems;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchTerm.trim() ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'ALL' ||
        item.categoryId === selectedCategory ||
        item.category?.id === selectedCategory ||
        item.category?._id === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [items, searchTerm, selectedCategory]);

  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        placeholder="Search menu items by name or keywords..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Grid xs={12} sm={6} md={4} key={idx}>
              <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3.5 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No Dishes Found"
          description="Try clearing your search query or selecting another menu category."
        />
      ) : (
        <Grid container spacing={2}>
          {filteredItems.map((item) => (
            <Grid xs={12} sm={6} md={4} key={item.id || item._id}>
              <MenuCard item={item} onAddToCart={onAddToCart} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MenuGrid;
