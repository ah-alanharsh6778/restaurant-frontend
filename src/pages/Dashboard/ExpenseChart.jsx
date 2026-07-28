import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const ExpenseChart = ({ data = [] }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: '#FFFFFF',
        height: 340,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
          Monthly Expense History
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Track operating costs and vendor invoice totals
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', height: 240, minHeight: 240 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={240}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Total Expense']}
            />
            <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
            <Bar dataKey="amount" name="Expense ($)" fill="#7C3AED" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ExpenseChart;
