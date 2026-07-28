import DataTable from '../../components/common/DataTable';

export const DashboardTable = ({ title, subtitle, columns = [], data = [], loading = false, onAddClick, addButtonLabel }) => {
  return (
    <DataTable
      title={title}
      subtitle={subtitle}
      columns={columns}
      data={data}
      loading={loading}
      onAddClick={onAddClick}
      addButtonLabel={addButtonLabel}
    />
  );
};

export default DashboardTable;
