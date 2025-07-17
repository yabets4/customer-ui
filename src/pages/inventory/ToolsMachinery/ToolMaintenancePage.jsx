import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Still needed for potential future navigations or if you decide to go to details page
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  CalendarCheck, Plus, Search, Wrench, Calendar, User, DollarSign, Edit, Trash2, CheckSquare, Clock, XCircle, Tag
} from 'lucide-react';

// --- Mock Data ---
// Re-using mockToolsMachinery for linking names
// NOTE: In a real app, this would likely come from a central state or API call
const mockToolsMachinery = [
  { id: 'TLM001', name: 'CNC Milling Machine (XYZ-Pro)' },
  { id: 'TLM002', name: 'Heavy Duty Drill Press' },
  { id: 'TLM003', name: 'Universal Testing Machine' },
  { id: 'TLM004', name: 'Electric Forklift (Warehouse)' },
  { id: 'TLM005', name: 'MIG Welder (Portable)' },
];

// Maintenance records data (using 'let' for mutability in mock environment)
// This will be mutated by add/edit/delete operations
let mockToolMaintenanceRecords = [
  {
    id: 'TMR001',
    toolMachineId: 'TLM001',
    maintenanceType: 'Preventive',
    scheduledDate: '2025-06-01',
    completionDate: null,
    status: 'Scheduled',
    performedBy: 'Maintenance Team A',
    cost: null,
    notes: 'Annual routine maintenance.'
  },
  {
    id: 'TMR002',
    toolMachineId: 'TLM002',
    maintenanceType: 'Inspection',
    scheduledDate: '2025-07-20',
    completionDate: null,
    status: 'Scheduled',
    performedBy: 'John Doe',
    cost: null,
    notes: 'Pre-emptive check before heavy use period.'
  },
  {
    id: 'TMR003',
    toolMachineId: 'TLM003',
    maintenanceType: 'Calibration',
    scheduledDate: '2025-06-10',
    completionDate: '2025-06-10',
    status: 'Completed',
    performedBy: 'External Vendor (CalibrateX)',
    cost: 1200.00,
    notes: 'Full calibration and certification performed.'
  },
  {
    id: 'TMR004',
    toolMachineId: 'TLM004',
    maintenanceType: 'Preventive',
    scheduledDate: '2025-07-01',
    completionDate: '2025-07-01',
    status: 'Completed',
    performedBy: 'Maintenance Team B',
    cost: 350.00,
    notes: 'Oil change, fluid check, tire inspection.'
  },
  {
    id: 'TMR005',
    toolMachineId: 'TLM005',
    maintenanceType: 'Corrective',
    scheduledDate: '2025-07-14',
    completionDate: null,
    status: 'Scheduled',
    performedBy: 'Jane Smith',
    cost: null,
    notes: 'Welding wire feeder issue reported by fabrication team. Needs immediate attention.'
  },
  {
    id: 'TMR006',
    toolMachineId: 'TLM001',
    maintenanceType: 'Corrective',
    scheduledDate: '2025-07-15',
    completionDate: null,
    status: 'In Progress',
    performedBy: 'Maintenance Team A',
    cost: null,
    notes: 'Addressing minor spindle vibration.'
  },
   {
    id: 'TMR007',
    toolMachineId: 'NONEXISTENT_ID', // Example of a non-existent toolMachineId
    maintenanceType: 'Preventive',
    scheduledDate: '2025-07-25',
    completionDate: null,
    status: 'Scheduled',
    performedBy: 'Unknown Team',
    cost: null,
    notes: 'Maintenance for a tool that might have been removed.'
  },
];

const maintenanceStatuses = [
    { value: 'All', label: 'All Statuses' }, // For filter
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Cancelled', label: 'Cancelled' },
];

const maintenanceTypes = [
  { value: 'Preventive', label: 'Preventive' },
  { value: 'Corrective', label: 'Corrective' },
  { value: 'Calibration', label: 'Calibration' },
  { value: 'Inspection', label: 'Inspection' },
  { value: 'Upgrade', label: 'Upgrade' },
  { value: 'Other', label: 'Other' },
];

const ToolMaintenancePage = () => {
  const navigate = useNavigate();
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // State for Add/Edit Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null); // Null for Add, object for Edit
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);


  const fetchMaintenanceRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const today = new Date();
      today.setHours(0,0,0,0); // Normalize today's date to start of day for accurate comparison

      // Enrich records with toolMachineName and dynamically update 'Overdue' status
      const enrichedRecords = mockToolMaintenanceRecords.map(record => {
        const tool = mockToolsMachinery.find(tm => tm.id === record.toolMachineId);
        
        let currentRecordStatus = record.status;
        const scheduled = record.scheduledDate ? new Date(record.scheduledDate) : null;
        if (scheduled) {
            scheduled.setHours(0,0,0,0); // Normalize scheduled date to start of day
            // Only mark as overdue if it's Scheduled or In Progress and scheduled date has passed
            if ((currentRecordStatus === 'Scheduled' || currentRecordStatus === 'In Progress') && scheduled < today) {
                currentRecordStatus = 'Overdue';
            }
        }
       
        return {
          ...record,
          toolMachineName: tool ? tool.name : 'Unknown Tool/Machine', // Ensure this is always a string
          status: currentRecordStatus // Use the updated status
        };
      });
      setMaintenanceRecords(enrichedRecords);
    } catch (err) {
      setError('Failed to load maintenance records. Please try again.');
      console.error('Error fetching maintenance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    let filteredItems = [...maintenanceRecords];

    // Search by tool name, performed by, maintenance type, notes
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(record =>
        // Safely access properties, defaulting to empty string if undefined/null, then toLowerCase()
        (record.toolMachineName || '').toLowerCase().includes(lowerCaseSearchTerm) ||
        (record.performedBy || '').toLowerCase().includes(lowerCaseSearchTerm) ||
        (record.maintenanceType || '').toLowerCase().includes(lowerCaseSearchTerm) ||
        (record.notes || '').toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Filter by status
    if (filterStatus !== 'All') {
      filteredItems = filteredItems.filter(record => record.status === filterStatus);
    }

    // Filter by date range (scheduled date)
    if (filterDateFrom) {
      filteredItems = filteredItems.filter(record =>
        record.scheduledDate && new Date(record.scheduledDate) >= new Date(filterDateFrom)
      );
    }
    if (filterDateTo) {
      filteredItems = filteredItems.filter(record =>
        record.scheduledDate && new Date(record.scheduledDate) <= new Date(filterDateTo)
      );
    }

    // Sort by scheduled date, most recent first (or oldest if needed)
    filteredItems.sort((a, b) => {
        const dateA = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
        const dateB = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
        return dateB - dateA; // Descending order
    });

    return filteredItems;
  }, [maintenanceRecords, searchTerm, filterStatus, filterDateFrom, filterDateTo]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'Cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  // --- Form Modal Logic ---
  const handleAddClick = () => {
    setCurrentRecord({ // Initialize with default values for new record
      toolMachineId: '',
      maintenanceType: '',
      scheduledDate: '',
      completionDate: '',
      status: 'Scheduled',
      performedBy: '',
      cost: '',
      notes: '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleEditClick = (record) => {
    // Set current record with all its properties for editing
    setCurrentRecord({ ...record });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setCurrentRecord(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
    // Clear error for the field being changed
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!currentRecord.toolMachineId) newErrors.toolMachineId = 'Tool/Machine is required.';
    if (!currentRecord.maintenanceType) newErrors.maintenanceType = 'Maintenance Type is required.';
    if (!currentRecord.scheduledDate) newErrors.scheduledDate = 'Scheduled Date is required.';
    if (!currentRecord.status) newErrors.status = 'Status is required.';
    if (currentRecord.cost && (isNaN(currentRecord.cost) || parseFloat(currentRecord.cost) < 0)) newErrors.cost = 'Cost must be a non-negative number.';
    
    // Check if toolMachineId exists in mockToolsMachinery
    const toolExists = mockToolsMachinery.some(tool => tool.id === currentRecord.toolMachineId);
    if (currentRecord.toolMachineId && !toolExists) {
        newErrors.toolMachineId = 'Invalid Tool/Machine ID. Please select an existing one.';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setFormSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const dataToSave = {
        ...currentRecord,
        cost: currentRecord.cost !== '' ? parseFloat(currentRecord.cost) : null,
        completionDate: currentRecord.completionDate || null, // Ensure empty string becomes null
      };

      if (currentRecord.id) { // Editing existing record
        const index = mockToolMaintenanceRecords.findIndex(rec => rec.id === currentRecord.id);
        if (index !== -1) {
          mockToolMaintenanceRecords[index] = { ...mockToolMaintenanceRecords[index], ...dataToSave };
        }
      } else { // Adding new record
        const newId = `TMR${(mockToolMaintenanceRecords.length + 1).toString().padStart(3, '0')}`;
        mockToolMaintenanceRecords.push({ ...dataToSave, id: newId });
      }

      await fetchMaintenanceRecords(); // Re-fetch to update list and re-calculate overdue status
      setIsFormModalOpen(false);
      setCurrentRecord(null);

    } catch (err) {
      console.error("Form submission error:", err);
      setError(`Failed to ${currentRecord.id ? 'update' : 'add'} record.`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // --- Mark Complete Logic ---
  const handleMarkComplete = async (recordId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      const updatedRecords = mockToolMaintenanceRecords.map(record => {
        if (record.id === recordId) {
          const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD
          return {
            ...record,
            status: 'Completed',
            completionDate: today
          };
        }
        return record;
      });
      mockToolMaintenanceRecords = updatedRecords; // Update the source mock data
      setMaintenanceRecords(updatedRecords); // Update component state directly (or re-fetch if complex)
      console.log(`Maintenance record ${recordId} marked as completed.`);
    } catch (err) {
      setError('Failed to mark maintenance as complete.');
      console.error('Error marking complete:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Logic ---
  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (recordToDelete) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const updatedRecords = mockToolMaintenanceRecords.filter(record => record.id !== recordToDelete.id);
        mockToolMaintenanceRecords = updatedRecords;
        setMaintenanceRecords(updatedRecords); // Update component state

        setIsDeleteModalOpen(false);
        setRecordToDelete(null);
        console.log(`Maintenance record ${recordToDelete.id} deleted successfully (mock).`);
      } catch (err) {
        setError('Failed to delete maintenance record. Please try again.');
        console.error('Error deleting record:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !formSubmitting) { // Show full page spinner only if initial data is loading, not during form submission
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
        <CalendarCheck className="inline-block w-8 h-8 mr-2 text-indigo-600" /> Tool Maintenance Records
      </h1>

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <Input
            type="text"
            placeholder="Search by tool, person, type or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="w-full md:w-1/3"
          />
          <Select
            id="filterStatus"
            name="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={maintenanceStatuses}
            className="w-full md:w-auto"
            label="Filter by Status"
            hideLabel
          />
          <div className="flex space-x-2 w-full md:w-auto">
            <Input
                type="date"
                label="Scheduled From"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-1/2 md:w-auto"
            />
            <Input
                type="date"
                label="Scheduled To"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-1/2 md:w-auto"
            />
          </div>
          <Button
            onClick={handleAddClick} // Open modal for adding
            variant="primary"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Maintenance
          </Button>
        </div>

        {filteredRecords.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No maintenance records found. {searchTerm || filterStatus !== 'All' || filterDateFrom || filterDateTo ? "Try adjusting your filters." : ""}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tool/Machine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {record.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 flex items-center">
                      <Wrench className="w-4 h-4 mr-2" /> {record.toolMachineName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {record.maintenanceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" /> {record.scheduledDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 flex items-center">
                      {record.completionDate ? (
                        <> <CheckSquare className="w-4 h-4 mr-2 text-green-500" /> {record.completionDate} </>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <User className="w-4 h-4 mr-1 inline" /> {record.performedBy || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {record.cost ? `$${record.cost.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {record.status !== 'Completed' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleMarkComplete(record.id)}
                            title="Mark as Complete"
                            disabled={loading}
                          >
                            <CheckSquare className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditClick(record)} // Open modal for editing
                          title="Edit Maintenance Record"
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(record)}
                          title="Delete Maintenance Record"
                          disabled={loading}
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

      {/* Add/Edit Maintenance Modal */}
      <ModalWithForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={currentRecord?.id ? `Edit Maintenance Record: ${currentRecord.id}` : 'Add New Maintenance Record'}
      >
        {currentRecord && ( // Only render form if currentRecord is initialized
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tool/Machine ID */}
              <div>
                <Select
                  label="Tool/Machine"
                  id="toolMachineId"
                  name="toolMachineId"
                  value={currentRecord.toolMachineId}
                  onChange={handleFormChange}
                  options={mockToolsMachinery.map(tool => ({ value: tool.id, label: tool.name }))}
                  placeholder="Select Tool/Machine"
                  icon={<Wrench className="w-5 h-5" />}
                  error={formErrors.toolMachineId}
                  required
                />
              </div>

              {/* Maintenance Type */}
              <div>
                <Select
                  label="Maintenance Type"
                  id="maintenanceType"
                  name="maintenanceType"
                  value={currentRecord.maintenanceType}
                  onChange={handleFormChange}
                  options={maintenanceTypes}
                  placeholder="Select Type"
                  icon={<Tag className="w-5 h-5" />}
                  error={formErrors.maintenanceType}
                  required
                />
              </div>

              {/* Scheduled Date */}
              <div>
                <Input
                  label="Scheduled Date"
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  value={currentRecord.scheduledDate}
                  onChange={handleFormChange}
                  icon={<Calendar className="w-5 h-5" />}
                  error={formErrors.scheduledDate}
                  required
                />
              </div>

              {/* Completion Date */}
              <div>
                <Input
                  label="Completion Date"
                  id="completionDate"
                  name="completionDate"
                  type="date"
                  value={currentRecord.completionDate || ''} // Handle null
                  onChange={handleFormChange}
                  icon={<CalendarCheck className="w-5 h-5" />}
                  error={formErrors.completionDate}
                />
              </div>

              {/* Status */}
              <div>
                <Select
                  label="Status"
                  id="status"
                  name="status"
                  value={currentRecord.status}
                  onChange={handleFormChange}
                  options={maintenanceStatuses.filter(opt => opt.value !== 'All')} // Remove 'All' from form options
                  placeholder="Select Status"
                  icon={<Clock className="w-5 h-5" />}
                  error={formErrors.status}
                  required
                />
              </div>

              {/* Performed By */}
              <div>
                <Input
                  label="Performed By"
                  id="performedBy"
                  name="performedBy"
                  type="text"
                  value={currentRecord.performedBy || ''} // Handle null
                  onChange={handleFormChange}
                  placeholder="e.g., Maintenance Team A"
                  icon={<User className="w-5 h-5" />}
                  error={formErrors.performedBy}
                />
              </div>

              {/* Cost */}
              <div>
                <Input
                  label="Cost ($)"
                  id="cost"
                  name="cost"
                  type="number"
                  value={currentRecord.cost || ''} // Handle null
                  onChange={handleFormChange}
                  placeholder="e.g., 250.00"
                  step="0.01"
                  icon={<DollarSign className="w-5 h-5" />}
                  error={formErrors.cost}
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  <span className="inline-flex items-center"><span className="mr-1"><CalendarCheck size={16} /></span>Notes</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={currentRecord.notes || ''} // Handle null
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Any additional notes or details about the maintenance..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
                ></textarea>
                {formErrors.notes && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.notes}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsFormModalOpen(false)}
                disabled={formSubmitting}
              >
                <XCircle className="w-5 h-5 mr-2" /> Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" /> {currentRecord.id ? 'Saving...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <CalendarCheck className="w-5 h-5 mr-2" /> {currentRecord.id ? 'Save Changes' : 'Add Record'}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </ModalWithForm>


      {/* Delete Confirmation Modal */}
      <ModalWithForm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        className="border-red-500"
      >
        <p className="text-center text-lg mb-4">
          Are you sure you want to delete maintenance record "<strong>{recordToDelete?.id}</strong>" for "<strong>{recordToDelete?.toolMachineName}</strong>"?
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

export default ToolMaintenancePage;