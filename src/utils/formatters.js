/**
 * RestaurantOS — POS Order & Table Formatting Utilities
 * Standardizes clean table names (Table 1, Table 2, Table 3) and clean order numbers (#ORD-001, #ORD-101).
 */

/**
 * Formats table objects/numbers to clean human-readable table labels (e.g. "Table 1", "Table 2", "Table 3")
 */
export const getCleanTableName = (tableData, fallbackTableId, tablesList = []) => {
  let raw = '';
  if (tableData && typeof tableData === 'object') {
    raw = tableData.tableNumber || tableData.number || tableData.name || tableData.id || '';
  } else if (tableData != null && String(tableData).trim() !== '') {
    raw = String(tableData);
  } else if (fallbackTableId && Array.isArray(tablesList) && tablesList.length > 0) {
    const found = tablesList.find((t) => t.id === fallbackTableId || t._id === fallbackTableId);
    if (found) {
      raw = found.tableNumber || found.number || found.name || found.id || '';
    }
  }

  raw = String(raw).trim();
  if (!raw || raw.length > 20) return 'Table 1';

  // Normalize "Table T-01" or "table 1"
  if (/^table\s*/i.test(raw)) {
    const numPart = raw.replace(/^table\s*/i, '').replace(/^T-?/i, '').replace(/^0+/, '');
    return `Table ${numPart || '1'}`;
  }

  // Normalize "T-01" or "T1"
  if (/^T-?/i.test(raw)) {
    const numOnly = raw.replace(/^T-?/i, '').replace(/^0+/, '');
    return `Table ${numOnly || '1'}`;
  }

  return `Table ${raw}`;
};

/**
 * Formats order numbers to clean sequential badges (e.g. "#ORD-001", "#ORD-101", "#ORD-2445")
 */
export const getCleanOrderNumber = (orderNumber, orderId) => {
  if (!orderNumber) {
    const suffix = String(orderId || '101').slice(-4).toUpperCase();
    return `#ORD-${suffix}`;
  }
  const str = String(orderNumber).trim();
  if (str.startsWith('#')) return str;

  // Shorten long timestamp order numbers like ORD-1785248991173-2445 to #ORD-2445
  const timestampMatch = str.match(/ORD-\d+-(\d+)/);
  if (timestampMatch) {
    return `#ORD-${timestampMatch[1]}`;
  }

  return `#${str}`;
};
