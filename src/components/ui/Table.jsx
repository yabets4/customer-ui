import React from 'react';

const Table = ({ columns, data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-lg font-medium">
        <svg className="w-8 h-8 mr-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        No data to display.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Table Header */}
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.accessor || column.header || index}
                scope="col"
                className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider dark:text-gray-200"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {data.map((item, rowIndex) => (
            <tr
              key={item.id || rowIndex}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out"
            >
              {columns.map((column, colIndex) => {
                const key = `${rowIndex}-${column.accessor || colIndex}`;

                const getNestedValue = (obj, path) =>
                  path.split('.').reduce((acc, part) => acc?.[part], obj);

                const content = column.render
                  ? column.render(item)
                  : getNestedValue(item, column.accessor);

                return (
                  <td
                    key={key}
                    className="px-6 py-4 text-base text-gray-800 dark:text-gray-100 whitespace-nowrap"
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
