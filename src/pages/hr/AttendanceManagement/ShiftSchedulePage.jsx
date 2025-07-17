// pages/AttendanceManagement/ShiftSchedulePage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Modal from '../../../components/ui/modal'; // Assuming a generic Modal component

// Lucide React Icons
import {
    Calendar, ArrowLeft, MapPin , Search, Clock, Plus, Edit, Trash2, AlertCircle,
    Building2, UserCheck, Info, Sun, Moon, X, FileText // Added FileText for notes field
} from 'lucide-react';

const ShiftSchedulePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEmployeeId, setFilterEmployeeId] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // State for managing shifts (now mutable)
    const [shifts, setShifts] = useState([
        {
            id: 'shift-001', employee: { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' },
            date: '2024-07-15', startTime: '09:00', endTime: '17:00', type: 'Regular',
            location: 'Main Office', notes: 'Lead HR policy review meeting.'
        },
        {
            id: 'shift-002', employee: { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' },
            date: '2024-07-15', startTime: '08:00', endTime: '16:00', type: 'Regular',
            location: 'Remote', notes: 'Work on backend API development.'
        },
        {
            id: 'shift-003', employee: { id: 'emp-003', name: 'Sara Ali', department: 'Operations' },
            date: '2024-07-15', startTime: '10:00', endTime: '18:00', type: 'Late Shift',
            location: 'Warehouse', notes: 'Oversee inventory dispatch.'
        },
        {
            id: 'shift-004', employee: { id: 'emp-004', name: 'Kebede Worku', department: 'Finance' },
            date: '2024-07-15', startTime: '09:00', endTime: '17:00', type: 'Regular',
            location: 'Main Office', notes: 'Payroll processing.'
        },
        {
            id: 'shift-005', employee: { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' },
            date: '2024-07-16', startTime: '09:00', endTime: '17:00', type: 'Regular',
            location: 'Main Office', notes: ''
        },
        {
            id: 'shift-006', employee: { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' },
            date: '2024-07-16', startTime: '08:00', endTime: '16:00', type: 'Regular',
            location: 'Remote', notes: 'Team meeting at 10 AM.'
        },
        {
            id: 'shift-007', employee: { id: 'emp-003', name: 'Sara Ali', department: 'Operations' },
            date: '2024-07-16', startTime: '10:00', endTime: '18:00', type: 'Late Shift',
            location: 'Warehouse', notes: 'New stock arrival.'
        },
        {
            id: 'shift-008', employee: { id: 'emp-004', name: 'Kebede Worku', department: 'Finance' },
            date: '2024-07-16', startTime: '09:00', endTime: '17:00', type: 'Regular',
            location: 'Main Office', notes: 'Budget review.'
        },
        {
            id: 'shift-009', employee: { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' },
            date: '2024-07-17', startTime: '09:00', endTime: '17:00', type: 'Regular',
            location: 'Main Office', notes: ''
        },
        {
            id: 'shift-010', employee: { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' },
            date: '2024-07-17', startTime: '08:00', endTime: '16:00', type: 'Regular',
            location: 'Main Office', notes: 'On-site support.'
        },
        {
            id: 'shift-011', employee: { id: 'emp-005', name: 'Zewdu Kebede', department: 'Sales' },
            date: '2024-07-17', startTime: '17:00', endTime: '01:00', type: 'Night Shift',
            location: 'Remote', notes: 'Client calls for Asia region.'
        },
        {
            id: 'shift-012', employee: { id: 'emp-006', name: 'Helen Getachew', department: 'Marketing' },
            date: '2024-07-18', startTime: '09:00', endTime: '17:00', type: 'Regular',
            location: 'Main Office', notes: 'Content planning meeting.'
        },
    ]);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [shiftToDelete, setShiftToDelete] = useState(null);

    // State for Add/Edit Shift Modal
    const [showShiftFormModal, setShowShiftFormModal] = useState(false);
    const [currentShift, setCurrentShift] = useState(null); // Holds data for shift being edited, or null for new
    const [shiftFormErrors, setShiftFormErrors] = useState({});

    const mockEmployeesForFilter = [
        { value: '', label: 'All Employees' },
        { value: 'emp-001', label: 'Aisha Demisse' },
        { value: 'emp-002', label: 'Tesfaye Gebre' },
        { value: 'emp-003', label: 'Sara Ali' },
        { value: 'emp-004', label: 'Kebede Worku' },
        { value: 'emp-005', label: 'Zewdu Kebede' },
        { value: 'emp-006', label: 'Helen Getachew' },
    ];

    const mockDepartmentsForFilter = [
        { value: '', label: 'All Departments' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'IT', label: 'Information Technology' },
        { value: 'Operations', label: 'Operations' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
    ];

    const mockShiftTypes = [
        { value: '', label: 'Select Type' },
        { value: 'Regular', label: 'Regular' },
        { value: 'Late Shift', label: 'Late Shift' },
        { value: 'Night Shift', label: 'Night Shift' },
        { value: 'Weekend', label: 'Weekend' },
    ];

    const mockLocations = [
        { value: '', label: 'Select Location' },
        { value: 'Main Office', label: 'Main Office' },
        { value: 'Remote', label: 'Remote' },
        { value: 'Warehouse', label: 'Warehouse' },
        { value: 'Client Site A', label: 'Client Site A' },
    ];


    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // Simulate data fetch
            setLoading(false);
        }, 700);
    }, []);

    const filteredShifts = useMemo(() => {
        let currentFiltered = shifts.filter(shift => { // Use 'shifts' state here
            const matchesSearchTerm = searchTerm.trim() === '' ||
                shift.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shift.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shift.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shift.notes.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesEmployee = filterEmployeeId === '' || shift.employee.id === filterEmployeeId;
            const matchesDepartment = filterDepartment === '' || shift.employee.department === filterDepartment;

            const shiftDate = new Date(shift.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchesDateRange = (!start || shiftDate >= start) && (!end || shiftDate <= end);

            return matchesSearchTerm && matchesEmployee && matchesDepartment && matchesDateRange;
        });

        // Sort by date and then by start time
        currentFiltered.sort((a, b) => {
            const dateComparison = new Date(a.date) - new Date(b.date);
            if (dateComparison !== 0) return dateComparison;
            return a.startTime.localeCompare(b.startTime);
        });

        return currentFiltered;
    }, [shifts, searchTerm, filterEmployeeId, filterDepartment, startDate, endDate]); // Depend on 'shifts' state

    // Group shifts by date for a calendar-like view
    const groupedShifts = useMemo(() => {
        return filteredShifts.reduce((acc, shift) => {
            const date = shift.date; // Assuming date is YYYY-MM-DD
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(shift);
            return acc;
        }, {});
    }, [filteredShifts]);


    const handleEditShift = (shift) => {
        setCurrentShift({ ...shift, employeeId: shift.employee.id }); // Set employeeId for the Select component
        setShowShiftFormModal(true);
    };

    const handleAddShift = () => {
        setCurrentShift({
            id: null, // Indicates a new shift
            employee: { id: '', name: '', department: '' }, // Placeholder for new employee
            employeeId: '', // For the select input
            date: new Date().toISOString().slice(0, 10),
            startTime: '09:00',
            endTime: '17:00',
            type: 'Regular',
            location: 'Main Office',
            notes: ''
        });
        setShowShiftFormModal(true);
    };

    const confirmDeleteShift = (shiftId) => {
        setShiftToDelete(shiftId);
        setShowDeleteConfirmModal(true);
    };

    const handleDeleteConfirmed = () => {
        setLoading(true); // Show loading spinner during deletion
        setTimeout(() => {
            setShifts(prevShifts => prevShifts.filter(shift => shift.id !== shiftToDelete));
            setShowDeleteConfirmModal(false);
            setShiftToDelete(null);
            setLoading(false);
            console.log(`Shift ID: ${shiftToDelete} deleted successfully.`);
        }, 500); // Simulate API call
    };

    const handleDeleteCancelled = () => {
        setShiftToDelete(null);
        setShowDeleteConfirmModal(false);
    };

    const handleShiftFormChange = (name, value) => { // Modified to match ModalWithForm's onFieldChange signature
        if (name === 'employeeId') {
            const selectedEmployee = mockEmployeesForFilter.find(emp => emp.value === value);
            setCurrentShift(prev => ({
                ...prev,
                employeeId: value,
                employee: {
                    id: value,
                    name: selectedEmployee ? selectedEmployee.label : '',
                    department: selectedEmployee ? (shifts.find(s => s.employee.id === value)?.employee.department || '') : '' // Try to get department from existing shifts or leave empty
                }
            }));
        } else {
            setCurrentShift(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setShiftFormErrors(prev => ({ ...prev, [name]: undefined })); // Clear error on change
    };

    const validateShiftForm = () => {
        const errors = {};
        if (!currentShift.employeeId) errors.employeeId = 'Employee is required.';
        if (!currentShift.date) errors.date = 'Date is required.';
        if (!currentShift.startTime) errors.startTime = 'Start Time is required.';
        if (!currentShift.endTime) errors.endTime = 'End Time is required.';
        if (!currentShift.type) errors.type = 'Shift Type is required.';
        if (!currentShift.location) errors.location = 'Location is required.';

        // Time validation
        if (currentShift.startTime && currentShift.endTime) {
            const start = new Date(`2000/01/01 ${currentShift.startTime}`);
            const end = new Date(`2000/01/01 ${currentShift.endTime}`);
            if (end <= start) {
                errors.endTime = 'End time must be after start time.';
            }
        }

        setShiftFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveShift = (formDataFromModal) => { // Changed to receive formData from ModalWithForm's onSubmit
        // Use formDataFromModal instead of currentShift directly for submission
        // Need to reconstruct employee object from employeeId for our shifts state
        const selectedEmployee = mockEmployeesForFilter.find(e => e.value === formDataFromModal.employeeId);
        const employeeData = {
            id: formDataFromModal.employeeId,
            name: selectedEmployee ? selectedEmployee.label : 'Unknown Employee',
            // Attempt to get department from existing shifts or default
            department: shifts.find(s => s.employee.id === formDataFromModal.employeeId)?.employee.department || 'N/A'
        };

        setLoading(true); // Show loading spinner during save
        setTimeout(() => {
            if (formDataFromModal.id) {
                // Edit existing shift
                setShifts(prevShifts => prevShifts.map(shift =>
                    shift.id === formDataFromModal.id ? {
                        ...formDataFromModal,
                        employee: employeeData
                    } : shift
                ));
                console.log('Shift updated successfully!');
            } else {
                // Add new shift
                const newId = `shift-${Date.now()}`; // Simple unique ID
                const newShift = {
                    ...formDataFromModal,
                    id: newId,
                    employee: employeeData
                };
                setShifts(prevShifts => [...prevShifts, newShift]);
                console.log('New shift added successfully!');
            }
            setShowShiftFormModal(false);
            setCurrentShift(null); // Clear current shift data
            setLoading(false);
        }, 500); // Simulate API call
    };


    const clearFilters = () => {
        setSearchTerm('');
        setFilterEmployeeId('');
        setFilterDepartment('');
        setStartDate('');
        setEndDate('');
    };

    // Helper to get dynamic classes for shift types
    const getShiftTypeClasses = (type) => {
        switch (type) {
            case 'Regular': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'Late Shift': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'Night Shift': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
            case 'Weekend': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        }
    };

    // Helper to get icon for shift type
    const getShiftTypeIcon = (type) => {
        switch (type) {
            case 'Regular': return <Sun size={18} className="text-blue-600 dark:text-blue-400" />;
            case 'Late Shift': return <Clock size={18} className="text-purple-600 dark:text-purple-400" />;
            case 'Night Shift': return <Moon size={18} className="text-indigo-600 dark:text-indigo-400" />;
            case 'Weekend': return <Calendar size={18} className="text-green-600 dark:text-green-400" />;
            default: return <Info size={18} className="text-gray-500 dark:text-gray-400" />;
        }
    };

    // Define the fields for the shift form modal
    const shiftFormFields = useMemo(() => [
        {
            name: 'employeeId',
            label: 'Employee',
            type: 'select',
            options: mockEmployeesForFilter.filter(emp => emp.value !== ''), // Exclude "All Employees"
            required: true,
            placeholder: 'Select Employee',
        },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'startTime', label: 'Start Time', type: 'time', required: true },
        { name: 'endTime', label: 'End Time', type: 'time', required: true },
        {
            name: 'type',
            label: 'Shift Type',
            type: 'select',
            options: mockShiftTypes.filter(type => type.value !== ''),
            required: true,
            placeholder: 'Select Shift Type',
        },
        {
            name: 'location',
            label: 'Location',
            type: 'select',
            options: mockLocations.filter(loc => loc.value !== ''),
            required: true,
            placeholder: 'Select Location',
        },
        { name: 'notes', label: 'Notes', type: 'textarea', rows: 3, placeholder: 'Any specific notes for this shift...' },
    ], [mockEmployeesForFilter, mockShiftTypes, mockLocations]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-4">
                    <Calendar className="w-11 h-11 text-blue-600 dark:text-blue-400" /> Shift Schedule
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Button
                        variant="primary"
                        onClick={handleAddShift} // Open modal for adding
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform text-white"
                    >
                        <Plus size={20} /> Add New Shift
                    </Button>
                    <Link to="/hr/employees" className="w-full">
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <ArrowLeft size={20} /> Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading shift schedules...</p>
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3 text-red-500 dark:text-red-300" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Content when not loading and no error */}
            {!loading && !error && (
                <>
                    {/* Filter and Search Section */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <Search size={28} className="text-blue-600 dark:text-blue-400" /> Filter Shifts
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Input
                                label="Search Shifts"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by employee, type, location..."
                                icon={<Search size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full lg:col-span-1"
                            />
                            <Select
                                label="Filter by Employee"
                                name="filterEmployeeId"
                                options={mockEmployeesForFilter}
                                value={filterEmployeeId}
                                onChange={(value) => setFilterEmployeeId(value)}
                                icon={<UserCheck size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full lg:col-span-1"
                            />
                            <Select
                                label="Filter by Department"
                                name="filterDepartment"
                                options={mockDepartmentsForFilter}
                                value={filterDepartment}
                                onChange={(value) => setFilterDepartment(value)}
                                icon={<Building2 size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full lg:col-span-1"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-full lg:col-span-1">
                                <Input
                                    label="Start Date"
                                    name="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                                />
                                <Input
                                    label="End Date"
                                    name="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                                />
                            </div>
                        </div>
                        <div className="mt-6 text-right">
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </Card>

                    {/* Shift List - Grouped by Date */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <Clock size={28} className="text-blue-600 dark:text-blue-400" /> Scheduled Shifts
                        </h2>
                        {Object.keys(groupedShifts).length > 0 ? (
                            <div className="space-y-8"> {/* Container for date groups */}
                                {Object.keys(groupedShifts).sort().map(date => (
                                    <div key={date}>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                                            <Calendar size={20} className="text-purple-500 dark:text-purple-300" />
                                            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {groupedShifts[date].map(shift => (
                                                <div key={shift.id} className={`p-6 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200 transform hover:scale-[1.01] ${getShiftTypeClasses(shift.type)}`}>
                                                    <div>
                                                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                                                            <UserCheck size={22} className="text-indigo-600 dark:text-indigo-400" /> {shift.employee.name}
                                                        </p>
                                                        <p className="text-md text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                            <Building2 size={16} className="text-gray-500 dark:text-gray-400" /> {shift.employee.department}
                                                        </p>
                                                        <hr className="border-gray-300 dark:border-gray-600 my-3" />
                                                        <p className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                                                            {getShiftTypeIcon(shift.type)} {shift.type} Shift
                                                        </p>
                                                        <p className="text-md text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                            <Clock size={18} className="text-blue-600 dark:text-blue-400" /> {shift.startTime} - {shift.endTime}
                                                        </p>
                                                        <p className="text-md text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                            <MapPin size={18} className="text-purple-600 dark:text-purple-400" /> {shift.location}
                                                        </p>
                                                        {shift.notes && (
                                                            <div className="mt-3 p-3 bg-opacity-70 dark:bg-opacity-70 rounded-lg border text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(0,0,0,0.1)' }}>
                                                                <p className="text-gray-800 dark:text-gray-100 italic flex items-start gap-2">
                                                                    <Info size={16} className="flex-shrink-0 mt-0.5" />
                                                                    Notes: {shift.notes}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-end gap-3 mt-5">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditShift(shift)} // Pass the full shift object
                                                            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        >
                                                            <Edit size={16} /> Edit
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => confirmDeleteShift(shift.id)}
                                                            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                                                        >
                                                            <Trash2 size={16} /> Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg font-medium">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                No shifts found matching your criteria.
                                <p className="text-sm mt-2">Adjust your filters or add new shifts.</p>
                            </div>
                        )}
                    </Card>
                </>
            )}

            {/* Add/Edit Shift Modal */}
            {showShiftFormModal && (
                <Modal
                    isOpen={showShiftFormModal}
                    onClose={() => { setShowShiftFormModal(false); setCurrentShift(null); setShiftFormErrors({}); }}
                    title={currentShift && currentShift.id ? "Edit Shift" : "Add New Shift"}
                    icon={currentShift && currentShift.id ? <Edit size={24} className="text-blue-500" /> : <Plus size={24} className="text-green-500" />}
                    fields={shiftFormFields} // Pass the fields array here
                    formData={currentShift} // Pass the current shift data
                    onFieldChange={handleShiftFormChange} // Pass the handler for field changes
                    onSubmit={handleSaveShift} // Pass the submit handler
                    errors={shiftFormErrors} // Pass validation errors
                >
                    {/* Children are no longer directly used for form fields as ModalWithForm renders them */}
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirmModal}
                onClose={handleDeleteCancelled}
                title="Confirm Delete Shift"
                icon={<AlertCircle className="text-red-500" size={24} />}
                footer={
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={handleDeleteCancelled} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteConfirmed}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size={20} className="text-white" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    Delete
                                </>
                            )}
                        </Button>
                    </div>
                }
            >
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Are you sure you want to delete the shift for employee{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {shifts.find(s => s.id === shiftToDelete)?.employee.name}
                    </span> on{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {shifts.find(s => s.id === shiftToDelete)?.date}
                    </span>?
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
};

export default ShiftSchedulePage;
