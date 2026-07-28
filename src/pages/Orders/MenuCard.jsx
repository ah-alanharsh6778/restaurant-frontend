import { Card, CardContent, CardMedia, Typography, Box, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const MenuCard = ({ item, onAddToCart }) => {
  const isAvailable = item.isAvailable !== false;

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'}
        alt={item.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2 }}>
              {item.name}
            </Typography>
            <Chip
              label={isAvailable ? 'IN STOCK' : 'OUT'}
              color={isAvailable ? 'success' : 'error'}
              size="small"
              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" display="block">
            {item.category?.name || item.categoryName || 'General Category'}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="h6" fontWeight={800} color="primary">
            ${Number(item.price || 0).toFixed(2)}
          </Typography>

          <Button
            size="small"
            variant="contained"
            disabled={!isAvailable}
            startIcon={<AddIcon />}
            onClick={() => onAddToCart(item)}
            sx={{ borderRadius: 2, py: 0.5, px: 1.5, fontWeight: 700 }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
