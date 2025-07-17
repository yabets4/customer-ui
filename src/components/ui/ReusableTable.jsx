import React from 'react';

const ReusableTable = ({
  columns = [],
  data = [],
  onRowClick = null,
  actions = null,
  emptyText = "No data available",
  className = "",
}) => {
  return (
    <div className={`overflow-x-auto border rounded-xl ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium text-gray-700">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center px-4 py-6 text-gray-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 transition"
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 space-x-2">
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
