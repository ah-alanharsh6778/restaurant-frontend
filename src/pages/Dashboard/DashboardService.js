import api from '../../services/api';

export const DashboardService = {
  getProfile: async () => {
    try {
      const res = await api.get('/users/profile');
      return res.data;
    } catch {
      return null;
    }
  },

  getTables: async () => {
    try {
      const res = await api.get('/tables');
      return res.data;
    } catch {
      return [];
    }
  },

  getMenu: async () => {
    try {
      const res = await api.get('/menu');
      return res.data;
    } catch {
      return [];
    }
  },

  getOrders: async () => {
    try {
      const res = await api.get('/orders');
      return res.data;
    } catch {
      return [];
    }
  },

  getProducts: async () => {
    try {
      const res = await api.get('/inventory/products');
      return res.data;
    } catch {
      return [];
    }
  },

  getSuppliers: async () => {
    try {
      const res = await api.get('/suppliers');
      return res.data;
    } catch {
      return [];
    }
  },

  getPurchaseOrders: async () => {
    try {
      const res = await api.get('/purchase-orders');
      return res.data;
    } catch {
      return [];
    }
  },

  getExpenses: async () => {
    try {
      const res = await api.get('/expenses');
      return res.data;
    } catch {
      return [];
    }
  },

  getDashboardData: async () => {
    const [profile, tables, menu, orders, products, suppliers, purchaseOrders, expenses] =
      await Promise.all([
        DashboardService.getProfile(),
        DashboardService.getTables(),
        DashboardService.getMenu(),
        DashboardService.getOrders(),
        DashboardService.getProducts(),
        DashboardService.getSuppliers(),
        DashboardService.getPurchaseOrders(),
        DashboardService.getExpenses(),
      ]);

    const normalizeList = (res, key) => {
      if (!res) return [];
      if (Array.isArray(res)) return res;
      if (key && Array.isArray(res[key])) return res[key];
      if (Array.isArray(res.data)) return res.data;
      return [];
    };

    const tablesList = normalizeList(tables, 'tables');
    const menuList = normalizeList(menu, 'items');
    const ordersList = normalizeList(orders, 'orders');
    const productsList = normalizeList(products, 'products');
    const suppliersList = normalizeList(suppliers, 'suppliers');
    const poList = normalizeList(purchaseOrders, 'purchaseOrders');
    const expensesList = normalizeList(expenses, 'expenses');

    return {
      profile: profile?.user || profile,
      tables: tablesList,
      menu: menuList,
      orders: ordersList,
      products: productsList,
      suppliers: suppliersList,
      purchaseOrders: poList,
      expenses: expensesList,
    };
  },
};

export default DashboardService;
