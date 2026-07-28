import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import dayjs from 'dayjs';

export const DashboardHeader = ({ onRefresh, onExport }) => {
  const currentDateStr = dayjs().format('dddd, MMMM DD, YYYY');

  return (
    <PageHeader
      title="Restaurant Analytics & Overview"
      subtitle={`Live operational telemetry & sales dashboard • ${currentDateStr}`}
      breadcrumbs={[
        { label: 'RestaurantOS', path: '/dashboard' },
        { label: 'Analytics Dashboard', path: '/dashboard' },
      ]}
      onRefresh={onRefresh}
      onExport={onExport}
    />
  );
};

export default DashboardHeader;
