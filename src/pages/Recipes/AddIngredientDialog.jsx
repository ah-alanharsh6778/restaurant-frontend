import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const AddIngredientDialog = ({
  open,
  onClose,
  onAdd,
  ingredientsList = [],
  existingIngredients = [],
  loading = false,
}) => {
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      setSelectedIngredientId(ingredientsList[0]?.id || ingredientsList[0]?._id || '');
      setQuantity(1);
      setErrorMsg('');
    }
  }, [open, ingredientsList]);

  const handleAdd = () => {
    setErrorMsg('');
    if (!selectedIngredientId) {
      setErrorMsg('Please select an ingredient');
      return;
    }
    if (Number(quantity) <= 0) {
      setErrorMsg('Quantity must be greater than zero');
      return;
    }

    // Check duplicate ingredients in same recipe
    const isDuplicate = existingIngredients.some(
      (item) => String(item.ingredientId || item.ingredient?.id || item.ingredient?._id) === String(selectedIngredientId)
    );

    if (isDuplicate) {
      setErrorMsg('This ingredient is already added to the recipe.');
      return;
    }

    const ingObj = ingredientsList.find((i) => String(i.id || i._id) === String(selectedIngredientId));

    onAdd({
      ingredientId: selectedIngredientId,
      ingredient: ingObj,
      quantity: Number(quantity),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Link Ingredient to Recipe
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <TextField
          select
          fullWidth
          margin="normal"
          id="ingredientId"
          label="Select Raw Ingredient"
          value={selectedIngredientId}
          onChange={(e) => setSelectedIngredientId(e.target.value)}
          sx={{ mb: 2.5 }}
        >
          {ingredientsList.map((ing) => (
            <MenuItem key={ing.id || ing._id} value={ing.id || ing._id}>
              {ing.name} ({ing.unit || 'unit'})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          id="quantity"
          label="Required Quantity per Serving"
          type="number"
          inputProps={{ min: 0.01, step: 'any' }}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {errorMsg && (
          <Typography variant="caption" color="error.main" fontWeight={700} sx={{ mt: 1, display: 'block' }}>
            {errorMsg}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleAdd} variant="contained" disabled={loading} sx={{ px: 3, fontWeight: 800 }}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Add to Recipe'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIngredientDialog;
