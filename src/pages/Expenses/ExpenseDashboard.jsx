import { Box } from '@mui/material';
import ExpenseSummaryCards from './ExpenseSummaryCards';
import ExpenseCharts from './ExpenseCharts';

export const ExpenseDashboard = ({ stats = {} }) => {
  return (
    <Box>
      <ExpenseSummaryCards stats={stats} />
      <ExpenseCharts />
    </Box>
  );
};

export default ExpenseDashboard;
