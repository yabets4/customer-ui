import { useState } from 'react';

const WorkshopLoad = () => {
  const [zones, setZones] = useState([
    {
      id: 1,
      name: 'Cutting Zone',
      capacity: 6,
      tasksToday: 5,
    },
    {
      id: 2,
      name: 'Assembly Zone',
      capacity: 6,
      tasksToday: 7,
    },
    {
      id: 3,
      name: 'Painting Zone',
      capacity: 6,
      tasksToday: 4,
    },
    {
      id: 4,
      name: 'Upholstery Zone',
      capacity: 6,
      tasksToday: 6,
    },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Workshop Load Balancing</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Zone</th>
            <th className="border p-2 text-center">Capacity</th>
            <th className="border p-2 text-center">Tasks Today</th>
            <th className="border p-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => {
            const isOverloaded = zone.tasksToday > zone.capacity;
            return (
              <tr key={zone.id}>
                <td className="border p-2">{zone.name}</td>
                <td className="border p-2 text-center">{zone.capacity}</td>
                <td className="border p-2 text-center">{zone.tasksToday}</td>
                <td
                  className={`border p-2 text-center font-semibold ${
                    isOverloaded ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {isOverloaded ? 'Overloaded' : 'Balanced'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WorkshopLoad;
