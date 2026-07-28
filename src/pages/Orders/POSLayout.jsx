import { Grid } from '@mui/material';
import TableSelector from './TableSelector';
import CategoryTabs from './CategoryTabs';
import MenuGrid from './MenuGrid';
import OrderCart from './OrderCart';

export const POSLayout = ({
  tables = [],
  selectedTableId,
  onSelectTable,
  categories = [],
  selectedCategory,
  onSelectCategory,
  menuItems = [],
  loading = false,
  cartItems = [],
  tableName = 'Takeout Order',
  subtotal = 0,
  submitting = false,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}) => {
  return (
    <Grid container spacing={3}>
      {/* Left Column: Menu Catalog & Table Selection */}
      <Grid xs={12} lg={8}>
        <TableSelector
          tables={tables}
          selectedTableId={selectedTableId}
          onSelectTable={onSelectTable}
        />

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />

        <MenuGrid
          menuItems={menuItems}
          selectedCategory={selectedCategory}
          loading={loading}
          onAddToCart={onAddToCart}
        />
      </Grid>

      {/* Right Column: POS Cart */}
      <Grid xs={12} lg={4}>
        <OrderCart
          cartItems={cartItems}
          tableName={tableName}
          subtotal={subtotal}
          loading={submitting}
          onIncreaseQuantity={onIncreaseQuantity}
          onDecreaseQuantity={onDecreaseQuantity}
          onRemoveItem={onRemoveItem}
          onClearCart={onClearCart}
          onPlaceOrder={onPlaceOrder}
        />
      </Grid>
    </Grid>
  );
};

export default POSLayout;
