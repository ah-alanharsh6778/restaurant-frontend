import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const defaultTrendData = [
  { month: 'Jan', amount: 12400 },
  { month: 'Feb', amount: 14800 },
  { month: 'Mar', amount: 18100 },
  { month: 'Apr', amount: 15500 },
  { month: 'May', amount: 19400 },
  { month: 'Jun', amount: 16200 },
];

const defaultCategoryData = [
  { name: 'Utilities & Rent', value: 4500, color: '#2563EB' },
  { name: 'Staff Payroll', value: 9800, color: '#10B981' },
  { name: 'Raw Ingredients', value: 6200, color: '#F59E0B' },
  { name: 'Maintenance & Repairs', value: 1200, color: '#EF4444' },
  { name: 'Software SaaS', value: 850, color: '#8B5CF6' },
];

const defaultSupplierData = [
  { supplier: 'Fresh Produce Inc', total: 4200 },
  { supplier: 'Prime Meat Packers', total: 6800 },
  { supplier: 'Power & Gas Co', total: 1850 },
  { supplier: 'Beverage Direct', total: 3100 },
];

export const ExpenseCharts = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Monthly Expense Trend */}
      <Grid xs={12} lg={8}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" fontWeight={800}>
            Monthly Expense Spend Trend
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            6-month trajectory of gross operating disbursements ($)
          </Typography>
          <Box sx={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defaultTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                <Area type="monotone" dataKey="amount" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Category Wise Expenses */}
      <Grid xs={12} lg={4}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" fontWeight={800}>
            Expense Categories
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Spend allocation by ledger category
          </Typography>
          <Box sx={{ width: '100%', height: 280, display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={defaultCategoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {defaultCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Supplier Wise Expenses */}
      <Grid xs={12}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" fontWeight={800}>
            Top Supplier Disbursement Breakdown
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total payouts per approved vendor
          </Typography>
          <Box sx={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultSupplierData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="supplier" />
                <YAxis />
                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                <Bar dataKey="total" name="Total Payout ($)" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ExpenseCharts;
