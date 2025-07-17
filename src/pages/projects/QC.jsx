import { useState } from 'react';

const QC = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      task: 'Cutting Task #101',
      grade: 'A',
      checklist: ['Measurement accurate', 'No chipping'],
      photos: ['before.jpg', 'after.jpg'],
      notes: 'Clean edges, perfect fit.',
      officer: 'Daniel',
      status: 'Pass',
    },
    {
      id: 2,
      task: 'Upholstery Task #88',
      grade: 'C',
      checklist: ['Fabric aligned', 'No tears'],
      photos: ['upholstery1.jpg'],
      notes: 'Loose stitching on right arm.',
      officer: 'Lily',
      status: 'Rework Required',
    },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">✅ Quality Control</h1>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Task</th>
            <th className="border p-2">Grade</th>
            <th className="border p-2">Checklist</th>
            <th className="border p-2">Photos</th>
            <th className="border p-2">Notes</th>
            <th className="border p-2">Officer</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((qc) => (
            <tr key={qc.id}>
              <td className="border p-2">{qc.task}</td>
              <td className="border p-2 font-bold">{qc.grade}</td>
              <td className="border p-2">{qc.checklist.join(', ')}</td>
              <td className="border p-2 text-blue-600">
                {qc.photos.length} photo{qc.photos.length > 1 ? 's' : ''}
              </td>
              <td className="border p-2">{qc.notes}</td>
              <td className="border p-2">{qc.officer}</td>
              <td
                className={`border p-2 font-semibold ${
                  qc.status === 'Pass'
                    ? 'text-green-600'
                    : qc.status === 'Rework Required'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {qc.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QC;
