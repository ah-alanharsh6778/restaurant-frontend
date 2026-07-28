import { Paper, Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const defaultOrderStatusData = [
  { name: 'Completed & Paid', value: 94, color: '#10B981' },
  { name: 'Served to Table', value: 28, color: '#3B82F6' },
  { name: 'In Kitchen (Preparing)', value: 12, color: '#F59E0B' },
  { name: 'Pending Ticket', value: 6, color: '#6B7280' },
  { name: 'Cancelled', value: 2, color: '#EF4444' },
];

export const OrderStatusChart = ({ data = defaultOrderStatusData }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3.5,
        height: '100%',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h6" fontWeight={800}>
        Order Workflow Distribution
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Status of today's dining room and takeaway tickets
      </Typography>

      <Box sx={{ width: '100%', height: 280, display: 'flex', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => `${val} Orders`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default OrderStatusChart;
