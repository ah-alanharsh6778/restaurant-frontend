import { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import DashboardService from './DashboardService';
import DashboardLayout from './DashboardLayout';
import DashboardCards from './DashboardCards';
import RecentOrders from './RecentOrders';
import QuickActions from './QuickActions';
import ErrorState from '../../components/common/ErrorState';
import PageContainer from '../../components/layout/PageContainer';
import { useAuth } from '../../hooks/useAuth';

export const Dashboard = () => {
  const { user: authUser } = useAuth();
  const [data, setData] = useState({
    profile: authUser,
    tables: [],
    menu: [],
    orders: [],
    products: [],
    suppliers: [],
    purchaseOrders: [],
    expenses: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await DashboardService.getDashboardData();
      setData({
        profile: res.profile || authUser,
        tables: res.tables,
        menu: res.menu,
        orders: res.orders,
        products: res.products,
        suppliers: res.suppliers,
        purchaseOrders: res.purchaseOrders,
        expenses: res.expenses,
      });
    } catch (err) {
      setError('Failed to connect to backend server. Please verify backend service.');
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (error) {
    return (
      <PageContainer breadcrumbs={['Dashboard']}>
        <ErrorState
          title="Backend Operational Error"
          description={error}
          onRetry={fetchDashboardData}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer breadcrumbs={['Dashboard']}>
      <DashboardLayout
        profile={data.profile || authUser}
        loading={loading}
        onRetry={fetchDashboardData}
      >
        {/* Quick Actions Shortcuts */}
        <QuickActions />

        {/* 12 Metric Statistics Cards */}
        <DashboardCards data={data} loading={loading} />

        {/* Latest 5 Recent Orders */}
        <RecentOrders orders={data.orders} loading={loading} />
      </DashboardLayout>
    </PageContainer>
  );
};

export default Dashboard;
