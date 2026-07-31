import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Autocomplete,
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export const PurchaseOrderDialog = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  suppliers = [],
  warehouses = [],
  ingredientsList = [],
  loading = false,
}) => {
  const isEdit = Boolean(initialData?.id || initialData?._id);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      supplier: null,
      warehouse: null,
      expectedDelivery: '',
      notes: '',
      gstAmount: 0,
      discountAmount: 0,
      shippingAmount: 0,
      items: [{ ingredient: null, quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = useWatch({ control, name: 'items' }) || [];
  const watchedGst = useWatch({ control, name: 'gstAmount' }) || 0;
  const watchedDiscount = useWatch({ control, name: 'discountAmount' }) || 0;
  const watchedShipping = useWatch({ control, name: 'shippingAmount' }) || 0;

  // Financial calculations
  const subtotal = useMemo(() => {
    return watchedItems.reduce((acc, item) => {
      const qty = parseFloat(item?.quantity) || 0;
      const price = parseFloat(item?.price) || 0;
      return acc + qty * price;
    }, 0);
  }, [watchedItems]);

  const grandTotal = useMemo(() => {
    const gst = parseFloat(watchedGst) || 0;
    const discount = parseFloat(watchedDiscount) || 0;
    const shipping = parseFloat(watchedShipping) || 0;
    return subtotal + gst + shipping - discount;
  }, [subtotal, watchedGst, watchedDiscount, watchedShipping]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        const supId = initialData.supplierId || initialData.supplier?.id || initialData.supplier?._id;
        const foundSupplier = suppliers.find((s) => String(s.id || s._id) === String(supId)) || initialData.supplier || null;

        const whId = initialData.warehouseId || initialData.warehouse?.id || initialData.warehouse?._id;
        const foundWarehouse = warehouses.find((w) => String(w.id || w._id) === String(whId)) || initialData.warehouse || null;

        const formattedItems = (initialData.purchaseItems || initialData.items || []).map((item) => {
          const ingId = item.ingredientId || item.ingredient?.id || item.ingredient?._id;
          const ing = item.ingredient || ingredientsList.find((i) => String(i.id || i._id) === String(ingId)) || null;
          return {
            ingredient: ing,
            quantity: item.quantity || 1,
            price: item.price !== undefined ? item.price : (ing?.costPerUnit || 0),
          };
        });

        reset({
          supplier: foundSupplier,
          warehouse: foundWarehouse,
          expectedDelivery: initialData.expectedDelivery
            ? new Date(initialData.expectedDelivery).toISOString().split('T')[0]
            : '',
          notes: initialData.notes || '',
          gstAmount: initialData.gstAmount || 0,
          discountAmount: initialData.discountAmount || 0,
          shippingAmount: initialData.shippingAmount || 0,
          items: formattedItems.length > 0 ? formattedItems : [{ ingredient: null, quantity: 1, price: 0 }],
        });
      } else {
        reset({
          supplier: null,
          warehouse: warehouses.length > 0 ? warehouses[0] : null,
          expectedDelivery: '',
          notes: '',
          gstAmount: 0,
          discountAmount: 0,
          shippingAmount: 0,
          items: [{ ingredient: null, quantity: 1, price: 0 }],
        });
      }
    }
  }, [open, initialData, suppliers, warehouses, ingredientsList, reset]);

  const handleFormSubmit = (data) => {
    if (!data.supplier) {
      toast.error('Please select a supplier vendor');
      return;
    }

    const validItems = (data.items || [])
      .filter((item) => item.ingredient && Number(item.quantity) > 0 && Number(item.price) >= 0)
      .map((item) => ({
        ingredientId: item.ingredient.id || item.ingredient._id,
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));

    if (validItems.length === 0) {
      toast.error('Please add at least one line item with valid ingredient, quantity > 0, and price >= 0');
      return;
    }

    onSubmit({
      supplierId: data.supplier.id || data.supplier._id,
      warehouseId: data.warehouse ? (data.warehouse.id || data.warehouse._id) : null,
      expectedDelivery: data.expectedDelivery || null,
      notes: data.notes || '',
      gstAmount: Number(data.gstAmount) || 0,
      discountAmount: Number(data.discountAmount) || 0,
      shippingAmount: Number(data.shippingAmount) || 0,
      items: validItems,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        {isEdit ? `Edit Purchase Order (${initialData.poNumber})` : 'Create Purchase Order'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Supplier Selector */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="supplier"
              control={control}
              rules={{ required: 'Supplier is required' }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={suppliers}
                  isOptionEqualToValue={(option, val) => (option?.id || option?._id) === (val?.id || val?._id)}
                  getOptionLabel={(option) =>
                    option ? `${option.name} (${option.contactPerson || 'Vendor'})` : ''
                  }
                  value={value}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Supplier"
                      placeholder="Search vendor by name..."
                      error={!!errors.supplier}
                      helperText={errors.supplier?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          {/* Warehouse Selector */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="warehouse"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={warehouses}
                  isOptionEqualToValue={(option, val) => (option?.id || option?._id) === (val?.id || val?._id)}
                  getOptionLabel={(option) =>
                    option ? `${option.name} (${option.location || 'Main'})` : ''
                  }
                  value={value}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Destination Warehouse"
                      placeholder="Warehouse destination..."
                    />
                  )}
                />
              )}
            />
          </Grid>

          {/* Expected Delivery Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expected Delivery Date"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('expectedDelivery')}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Notes / Instructions"
              placeholder="e.g. Handle fragile ingredients with care"
              {...register('notes')}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* PO Items Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>
            Purchase Order Line Items ({fields.length})
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => append({ ingredient: null, quantity: 1, price: 0 })}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Add Line Item
          </Button>
        </Box>

        {/* Dynamic Item Rows */}
        {fields.map((fieldItem, index) => {
          const qty = parseFloat(watchedItems[index]?.quantity) || 0;
          const prc = parseFloat(watchedItems[index]?.price) || 0;
          const rowSubtotal = qty * prc;

          return (
            <Paper
              key={fieldItem.id}
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2.5,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 2, minWidth: 200 }}>
                  <Controller
                    name={`items.${index}.ingredient`}
                    control={control}
                    rules={{ required: 'Ingredient is required' }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={ingredientsList}
                        isOptionEqualToValue={(option, val) => (option?.id || option?._id) === (val?.id || val?._id)}
                        getOptionLabel={(option) =>
                          option ? `${option.name} (${option.unit || 'unit'})` : ''
                        }
                        value={value}
                        onChange={(_, newValue) => {
                          onChange(newValue);
                          if (newValue && newValue.costPerUnit !== undefined) {
                            setValue(`items.${index}.price`, newValue.costPerUnit);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label={`Ingredient #${index + 1}`}
                            placeholder="Select ingredient..."
                            error={!!errors.items?.[index]?.ingredient}
                            helperText={errors.items?.[index]?.ingredient?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: 100 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Quantity"
                    type="number"
                    slotProps={{ htmlInput: { min: 0.01, step: 'any' } }}
                    {...register(`items.${index}.quantity`, {
                      required: 'Qty > 0',
                      validate: (val) => Number(val) > 0 || 'Min > 0',
                    })}
                    error={!!errors.items?.[index]?.quantity}
                    helperText={errors.items?.[index]?.quantity?.message}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: 110 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Unit Price ($)"
                    type="number"
                    slotProps={{ htmlInput: { min: 0, step: 'any' } }}
                    {...register(`items.${index}.price`, {
                      required: 'Price >= 0',
                      validate: (val) => Number(val) >= 0 || 'Min >= 0',
                    })}
                    error={!!errors.items?.[index]?.price}
                    helperText={errors.items?.[index]?.price?.message}
                  />
                </Box>

                <Box sx={{ minWidth: 100, textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Line Total
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700}>
                    ${rowSubtotal.toFixed(2)}
                  </Typography>
                </Box>

                {fields.length > 1 && (
                  <IconButton color="error" size="small" onClick={() => remove(index)} sx={{ mt: 0.5 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Paper>
          );
        })}

        <Divider sx={{ my: 3 }} />

        {/* Financial Breakdown & Adjustments */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="GST / Tax Amount ($)"
              type="number"
              slotProps={{ htmlInput: { min: 0, step: 'any' } }}
              {...register('gstAmount')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Shipping Cost ($)"
              type="number"
              slotProps={{ htmlInput: { min: 0, step: 'any' } }}
              {...register('shippingAmount')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Discount Amount ($)"
              type="number"
              slotProps={{ htmlInput: { min: 0, step: 'any' } }}
              {...register('discountAmount')}
            />
          </Grid>
        </Grid>

        {/* Financial Summary Card */}
        <Paper elevation={0} sx={{ p: 2, mt: 3, background: (theme) => theme.palette.action.hover, borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              ${subtotal.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              GST Tax:
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              +${(parseFloat(watchedGst) || 0).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Shipping:
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              +${(parseFloat(watchedShipping) || 0).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Discount:
            </Typography>
            <Typography variant="body2" fontWeight={600} color="error.main">
              -${(parseFloat(watchedDiscount) || 0).toFixed(2)}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight={800}>
              Grand Total:
            </Typography>
            <Typography variant="subtitle1" fontWeight={800} color="primary.main">
              ${grandTotal.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={loading || fields.length === 0}
          sx={{ px: 3, fontWeight: 800 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : isEdit ? 'Save Changes' : 'Create Purchase Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderDialog;
