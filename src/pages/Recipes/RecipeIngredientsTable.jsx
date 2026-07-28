import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const RecipeIngredientsTable = ({
  recipeIngredients = [],
  onRemoveIngredient,
}) => {
  if (!recipeIngredients || recipeIngredients.length === 0) {
    return (
      <Box p={3} textAlign="center" sx={{ border: '1px dashed grey', borderRadius: 2, bgcolor: 'action.hover' }}>
        <Typography variant="body2" color="text.secondary">
          No ingredients added to this recipe yet.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>INGREDIENT</TableCell>
            <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>QUANTITY & UNIT</TableCell>
            {onRemoveIngredient && (
              <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                ACTION
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {recipeIngredients.map((item) => {
            const ingName = item.ingredient?.name || item.name || 'Unknown Ingredient';
            const unit = item.ingredient?.unit || item.unit || '';
            const qty = item.quantity;

            return (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={700}>
                    {ingName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {qty} {unit}
                  </Typography>
                </TableCell>
                {onRemoveIngredient && (
                  <TableCell align="right">
                    <Tooltip title="Remove Ingredient">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onRemoveIngredient(item)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecipeIngredientsTable;
