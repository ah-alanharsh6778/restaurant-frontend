import { Chip } from '@mui/material';

export const CategoryChip = ({ category, size = 'small' }) => {
  const label = typeof category === 'object' ? category?.name : String(category || 'General');

  return (
    <Chip
      label={label}
      size={size}
      color="primary"
      variant="outlined"
      sx={{ fontWeight: 700, fontSize: '0.725rem', borderRadius: 2 }}
    />
  );
};

export default CategoryChip;
