import { Box, Typography, Button, Paper } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddIcon from '@mui/icons-material/Add';

export const EmptySupplierState = ({ onCreateSupplier }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 4,
        border: (theme) => `1px dashed ${theme.palette.divider}`,
        backgroundColor: 'transparent',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'primary.light',
          color: 'primary.main',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
          opacity: 0.85,
        }}
      >
        <LocalShippingIcon fontSize="large" />
      </Box>

      <Typography variant="h5" fontWeight={800} gutterBottom>
        No Suppliers Found
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 3 }}>
        There are currently no raw material vendors or suppliers matching your search or filters.
      </Typography>

      {onCreateSupplier && (
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={onCreateSupplier}
          sx={{ py: 1.2, px: 3, fontWeight: 800, borderRadius: 3 }}
        >
          Add Supplier
        </Button>
      )}
    </Paper>
  );
};

export default EmptySupplierState;
