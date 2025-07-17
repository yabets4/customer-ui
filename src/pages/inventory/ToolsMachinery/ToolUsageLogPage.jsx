import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  History, Plus, Search, Calendar, User, Wrench, Clock, Edit, Trash2, Tag
} from 'lucide-react';

// --- Mock Data ---
// Re-using mockToolsMachinery for linking names
const mockToolsMachinery = [
  { id: 'TLM001', name: 'CNC Milling Machine (XYZ-Pro)' },
  { id: 'TLM002', name: 'Heavy Duty Drill Press' },
  { id: 'TLM003', name: 'Universal Testing Machine' },
  { id: 'TLM004', name: 'Electric Forklift (Warehouse)' },
  { id: 'TLM005', name: 'MIG Welder (Portable)' },
];

// Usage logs data (using 'let' for mutability in mock environment)
let mockToolUsageLogs = [
  {
    id: 'TUL001',
    toolMachineId: 'TLM001',
    usageDate: '2025-07-01',
    usedBy: 'Alice Johnson',
    purpose: 'Production Run - Part A',
    durationHours: 8.5,
    notes: 'Smooth operation. Completed 100 units.'
  },
  {
    id: 'TUL002',
    toolMachineId: 'TLM002',
    usageDate: '2025-07-02',
    usedBy: 'Bob Williams',
    purpose: 'Assembly - Furniture Frames',
    durationHours: 4.0,
    notes: 'Routine drilling tasks. No issues.'
  },
  {
    id: 'TUL003',
    toolMachineId: 'TLM004',
    usageDate: '2025-07-03',
    usedBy: 'Charlie Davis',
    purpose: 'Receiving Raw Materials',
    durationHours: 2.0,
    notes: 'Unloaded 5 pallets of timber.'
  },
  {
    id: 'TUL004',
    toolMachineId: 'TLM001',
    usageDate: '2025-07-05',
    usedBy: 'Alice Johnson',
    purpose: 'Maintenance Check',
    durationHours: 1.5,
    notes: 'Pre-shift inspection. All clear.'
  },
  {
    id: 'TUL005',
    toolMachineId: 'TLM003',
    usageDate: '2025-07-06',
    usedBy: 'David Lee',
    purpose: 'Product Quality Test',
    durationHours: 3.0,
    notes: 'Tested 5 samples for tensile strength.'
  },
  {
    id: 'TUL006',
    toolMachineId: 'TLM002',
    usageDate: '2025-07-08',
    usedBy: 'Eve Green',
    purpose: 'Assembly - Custom Order',
    durationHours: 6.0,
    notes: 'Worked on custom furniture piece. Requires precision.'
  }
];

const ToolUsageLogPage = () => {
  const navigate = useNavigate();
  const [usageLogs, setUsageLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);

  const fetchUsageLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Enrich logs with toolMachineName for display
      const enrichedLogs = mockToolUsageLogs.map(log => {
        const tool = mockToolsMachinery.find(tm => tm.id === log.toolMachineId);
        return {
          ...log,
          toolMachineName: tool ? tool.name : 'Unknown Tool/Machine'
        };
      });
      setUsageLogs(enrichedLogs);
    } catch (err) {
      setError('Failed to load usage logs. Please try again.');
      console.error('Error fetching usage logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    let filteredItems = [...usageLogs];

    // Search by tool name, user, purpose, or notes
    if (searchTerm) {
      filteredItems = filteredItems.filter(log =>
        log.toolMachineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.usedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (filterDateFrom) {
      filteredItems = filteredItems.filter(log =>
        new Date(log.usageDate) >= new Date(filterDateFrom)
      );
    }
    if (filterDateTo) {
      filteredItems = filteredItems.filter(log =>
        new Date(log.usageDate) <= new Date(filterDateTo)
      );
    }

    // Sort by usage date, most recent first
    filteredItems.sort((a, b) => new Date(b.usageDate) - new Date(a.usageDate));

    return filteredItems;
  }, [usageLogs, searchTerm, filterDateFrom, filterDateTo]);

  const handleDeleteClick = (log) => {
    setLogToDelete(log);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (logToDelete) {
      setLoading(true); // Indicate deletion is in progress
      try {
        // Simulate API call for deletion
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update the mock data
        const updatedLogs = mockToolUsageLogs.filter(log => log.id !== logToDelete.id);
        mockToolUsageLogs = updatedLogs; // Update the source mock data
        setUsageLogs(updatedLogs); // Update component state

        setIsDeleteModalOpen(false);
        setLogToDelete(null);
        console.log(`Usage log ${logToDelete.id} deleted successfully (mock).`);
      } catch (err) {
        setError('Failed to delete usage log. Please try again.');
        console.error('Error deleting usage log:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 dark:text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        <History className="inline-block w-8 h-8 mr-2 text-purple-600" /> Tool Usage Log
      </h1>

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <Input
            type="text"
            placeholder="Search by tool, user, purpose or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="w-full md:w-1/2"
          />
          <div className="flex space-x-2 w-full md:w-auto">
            <Input
                type="date"
                label="From"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-1/2 md:w-auto"
            />
            <Input
                type="date"
                label="To"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-1/2 md:w-auto"
            />
          </div>
          <Button
            onClick={() => navigate('/inventory/tools-machinery/usage-logs/new')}
            variant="primary"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Usage Log
          </Button>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No usage logs found. {searchTerm && "Try adjusting your search or date filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-300 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Log ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tool/Machine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration (Hrs)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {log.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 flex items-center">
                      <Wrench className="w-4 h-4 mr-2" /> {log.toolMachineName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" /> {log.usageDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 flex items-center">
                      <User className="w-4 h-4 mr-2" /> {log.usedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {log.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {log.durationHours ? log.durationHours.toFixed(1) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* Assuming edit page will be /usage-logs/:id/edit */}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/inventory/tools-machinery/usage-logs/${log.id}/edit`)}
                          title="Edit Usage Log"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(log)}
                          title="Delete Usage Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ModalWithForm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        className="border-red-500"
      >
        <p className="text-center text-lg mb-4">
          Are you sure you want to delete usage log "<strong>{logToDelete?.id}</strong>" for "<strong>{logToDelete?.toolMachineName}</strong>"?
          This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="danger">
            {loading ? <LoadingSpinner size="sm" /> : 'Delete'}
          </Button>
        </div>
      </ModalWithForm>
    </div>
  );
};

export default ToolUsageLogPage;