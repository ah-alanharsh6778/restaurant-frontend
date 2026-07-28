import { Box, Chip } from '@mui/material';

export const CategoryTabs = ({ categories = [], selectedCategory, onSelectCategory }) => {
  const defaultCategories = [
    { id: 'ALL', name: 'All Menu Dishes' },
    { id: '1', name: 'Starters & Appetizers' },
    { id: '2', name: 'Main Course' },
    { id: '3', name: 'Beverages & Drinks' },
    { id: '4', name: 'Desserts & Sweets' },
  ];

  const catList = categories.length > 0 ? [{ id: 'ALL', name: 'All Menu Dishes' }, ...categories] : defaultCategories;

  return (
    <Box display="flex" gap={1} mb={3} sx={{ overflowX: 'auto', pb: 1 }}>
      {catList.map((cat) => {
        const isSelected = selectedCategory === (cat.id || cat._id);

        return (
          <Chip
            key={cat.id || cat._id}
            label={cat.name}
            clickable
            color={isSelected ? 'primary' : 'default'}
            variant={isSelected ? 'filled' : 'outlined'}
            onClick={() => onSelectCategory(cat.id || cat._id)}
            sx={{
              fontWeight: 700,
              fontSize: '0.85rem',
              py: 2,
              px: 1,
              borderRadius: 2.5,
            }}
          />
        );
      })}
    </Box>
  );
};

export default CategoryTabs;
