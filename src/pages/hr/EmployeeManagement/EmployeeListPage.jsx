// pages/EmployeeManagement/EmployeeListPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Eye,
  Edit,
  PowerOff,
  Power,
  AlertCircle,
  CheckCircle,
  Info, // Still useful for the overall understanding section
} from 'lucide-react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import Table from '../../../components/ui/Table';
import Pagination from '../../../components/ui/Pagination';
import ModalWithForm from '../../../components/ui/modal';

// Mock API service for demonstration purposes
const mockEmployees = [
  { id: 'emp-001', employeeId: 'EMP001', fullName: 'Alice Johnson', email: 'alice.j@example.com', department: 'HR', jobTitle: 'HR Manager', status: 'active' },
  { id: 'emp-002', employeeId: 'EMP002', fullName: 'Bob Williams', email: 'bob.w@example.com', department: 'IT', jobTitle: 'Software Engineer', status: 'active' },
  { id: 'emp-003', employeeId: 'EMP003', fullName: 'Charlie Brown', email: 'charlie.b@example.com', department: 'Finance', jobTitle: 'Accountant', status: 'inactive' },
  { id: 'emp-004', employeeId: 'EMP004', fullName: 'Diana Miller', email: 'diana.m@example.com', department: 'Operations', jobTitle: 'Operations Coordinator', status: 'active' },
  { id: 'emp-005', employeeId: 'EMP005', fullName: 'Eve Davis', email: 'eve.d@example.com', department: 'HR', jobTitle: 'HR Assistant', status: 'active' },
  { id: 'emp-006', employeeId: 'EMP006', fullName: 'Frank White', email: 'frank.w@example.com', department: 'IT', jobTitle: 'Network Admin', status: 'inactive' },
  { id: 'emp-007', employeeId: 'EMP007', fullName: 'Grace Lee', email: 'grace.l@example.com', department: 'Finance', jobTitle: 'Financial Analyst', status: 'active' },
  { id: 'emp-008', employeeId: 'EMP008', fullName: 'Henry Taylor', email: 'henry.t@example.com', department: 'Operations', jobTitle: 'Logistics Manager', status: 'active' },
  { id: 'emp-009', employeeId: 'EMP009', fullName: 'Ivy Green', email: 'ivy.g@example.com', department: 'HR', jobTitle: 'Recruiter', status: 'active' },
  { id: 'emp-010', employeeId: 'EMP010', fullName: 'Jack Adams', email: 'jack.a@example.com', department: 'IT', jobTitle: 'IT Support Specialist', status: 'inactive' },
  { id: 'emp-011', employeeId: 'EMP011', fullName: 'Karen Hall', email: 'karen.h@example.com', department: 'Finance', jobTitle: 'Payroll Specialist', status: 'active' },
  { id: 'emp-012', employeeId: 'EMP012', fullName: 'Liam King', email: 'liam.k@example.com', department: 'Operations', jobTitle: 'Project Manager', status: 'active' },
  { id: 'emp-013', employeeId: 'EMP013', fullName: 'Mia Wright', email: 'mia.w@example.com', department: 'HR', jobTitle: 'HR Specialist', status: 'on-leave' },
  { id: 'emp-014', employeeId: 'EMP014', fullName: 'Noah Turner', email: 'noah.t@example.com', department: 'IT', jobTitle: 'Cybersecurity Analyst', status: 'active' },
  { id: 'emp-015', employeeId: 'EMP015', fullName: 'Olivia Hill', email: 'olivia.h@example.com', department: 'Finance', jobTitle: 'Tax Consultant', status: 'inactive' },
];
const fetchEmployees = async ({ page, limit, search, department, status }) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = mockEmployees.filter(emp => {
    const matchesSearch = search ?
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) : true;

    const matchesDepartment = department ? emp.department === department : true;
    const matchesStatus = status === 'all' ? true : emp.status === status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedEmployees = filtered.slice(startIndex, endIndex);

  return {
    data: {
      employees: paginatedEmployees,
      totalItems,
      totalPages,
      currentPage: page,
    },
  };
};

const deactivateEmployee = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`Deactivating employee with ID: ${id}`);
  return { success: true };
};

const activateEmployee = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`Activating employee with ID: ${id}`);
  return { success: true };
};
// End Mock API service

const EmployeeListPage = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalActionType, setModalActionType] = useState('');

  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'Operations', label: 'Operations' },
  ];

  const employeeStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on-leave', label: 'On Leave' },
    { value: 'all', label: 'All Statuses' },
  ];

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchEmployees({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        department: filterDepartment,
        status: filterStatus,
      });
      setEmployees(response.data.employees);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch employees. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, filterDepartment, filterStatus]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value) => {
    setFilterDepartment(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const confirmAction = (employee, actionType) => {
    setSelectedEmployee(employee);
    setModalActionType(actionType);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const handleConfirmModalAction = useCallback(async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);
      if (modalActionType === 'deactivate') {
        await deactivateEmployee(selectedEmployee.id);
        setEmployees(prev => prev.map(emp =>
          emp.id === selectedEmployee.id ? { ...emp, status: 'inactive' } : emp
        ));
      } else if (modalActionType === 'activate') {
        await activateEmployee(selectedEmployee.id);
        setEmployees(prev => prev.map(emp =>
          emp.id === selectedEmployee.id ? { ...emp, status: 'active' } : emp
        ));
      }
      handleCloseConfirmModal();
      setSelectedEmployee(null);
    } catch (err) {
      setError(`Failed to ${modalActionType} employee. ${err.message || 'Please try again.'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee, modalActionType, handleCloseConfirmModal]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDepartment('');
    setFilterStatus('active');
    setCurrentPage(1);
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'terminated':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusTooltipText = (status) => {
    switch (status) {
      case 'active':
        return 'This employee is currently active and has full system access.';
      case 'inactive':
        return 'This employee is currently inactive. Their system access is restricted.';
      case 'on-leave':
        return 'This employee is currently on leave but retains system access.';
      case 'terminated':
        return 'This employee\'s employment has been terminated.';
      default:
        return `Status: ${status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}`;
    }
  };


  const employeeTableColumns = [
    { header: 'Employee ID', accessor: 'employeeId' },
    { header: 'Full Name', accessor: 'fullName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    { header: 'Job Title', accessor: 'jobTitle' },
    {
      header: 'Status',
      render: (employee) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(employee.status)}`}
          title={getStatusTooltipText(employee.status)} // Add tooltip here
        >
          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1).replace('-', ' ')}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (employee) => (
        <div className="flex items-center space-x-2">
          <Link to={`/hr/employees/${employee.id}`}>
            <Button variant="ghost" size="icon" title="View Employee Details"> {/* Improved tooltip */}
              <Eye size={18} />
            </Button>
          </Link>
          <Link to={`/hr/employees/edit/${employee.id}`}>
            <Button variant="ghost" size="icon" title="Edit Employee Information"> {/* Improved tooltip */}
              <Edit size={18} />
            </Button>
          </Link>
          {employee.status === 'active' || employee.status === 'on-leave' ? (
            <Button
              variant="ghost"
              size="icon"
              title="Deactivate Employee (Restrict Access)" // Improved tooltip
              onClick={() => confirmAction(employee, 'deactivate')}
              className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <PowerOff size={18} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              title="Activate Employee (Restore Access)" // Improved tooltip
              onClick={() => confirmAction(employee, 'activate')}
              className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900"
            >
              <Power size={18} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 text-gray-800 dark:text-gray-100">
          <Users className="text-purple-600 dark:text-purple-400 w-9 h-9" />
          Employee Directory
        </h1>
        <Link to="/hr/new-employees">
          <Button variant="primary" className="flex items-center px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <PlusCircle className="mr-2 w-5 h-5" />
            Add New Employee
          </Button>
        </Link>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Filter size={20} className="text-blue-500 dark:text-blue-400" /> Filter & Search
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search by name, ID, email..."
            value={searchTerm}
            onChange={handleSearchChange}
            icon={<Search size={20} className="text-gray-400 dark:text-gray-500" />}
            className="col-span-full lg:col-span-1"
          />
          <Select
            options={departments}
            value={filterDepartment}
            onChange={handleDepartmentChange}
            placeholder="Select Department"
          />
          <Select
            options={employeeStatuses}
            value={filterStatus}
            onChange={handleStatusChange}
            placeholder="Select Status"
          />
          <Button
            variant="outline"
            onClick={clearFilters}
            className="col-span-full md:col-span-1 flex items-center justify-center gap-2"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full text-blue-500" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4">Loading employees...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle size={20} /> {error}
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No employees found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your filters or adding new employees.</p>
          </div>
        ) : (
          <>
            <Table columns={employeeTableColumns} data={employees} />
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>

      {/* Status and Action Explanations (optional, but good for holistic understanding) */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Info size={20} className="text-teal-500 dark:text-teal-400" /> Understanding Employee Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Employee Statuses:</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
              <li>
                <span className="font-semibold text-green-600 dark:text-green-400">Active:</span> Employee is currently working and has full system access.
              </li>
              <li>
                <span className="font-semibold text-red-600 dark:text-red-400">Inactive:</span> Employee's access is revoked, and they are no longer actively working.
              </li>
              <li>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">On Leave:</span> Employee is temporarily away, but remains active in the system.
              </li>
              <li>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Terminated:</span> Employee's employment has ended permanently.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Available Actions:</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
              <li>
                <span className="font-semibold flex items-center gap-1">
                  <Eye size={16} /> View:
                </span> Access a detailed profile of the employee.
              </li>
              <li>
                <span className="font-semibold flex items-center gap-1">
                  <Edit size={16} /> Edit:
                </span> Modify the employee's information.
              </li>
              <li>
                <span className="font-semibold flex items-center gap-1">
                  <PowerOff size={16} className="text-red-600" /> Deactivate:
                </span> Restrict an **Active** or **On Leave** employee's system access and mark them as inactive.
              </li>
              <li>
                <span className="font-semibold flex items-center gap-1">
                  <Power size={16} className="text-green-600" /> Activate:
                </span> Restore system access and active status for an **Inactive** employee.
              </li>
            </ul>
          </div>
        </div>
      </div>

     
        <ModalWithForm
          isOpen={showConfirmModal}
          onClose={handleCloseConfirmModal}
          title={modalActionType === 'deactivate' ? 'Confirm Deactivation' : 'Confirm Activation'}
          icon={
            modalActionType === 'deactivate' ? (
              <AlertCircle className="text-red-500" size={24} />
            ) : (
              <CheckCircle className="text-green-500" size={24} />
            )
          }
          fields={[]} // ✅ Must pass empty array if no fields are required
          footer={
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleCloseConfirmModal} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant={modalActionType === 'deactivate' ? 'danger' : 'success'}
                onClick={handleConfirmModalAction}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div
                      className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      role="status"
                    >
                      <span className="sr-only">Processing...</span>
                    </div>
                    Processing...
                  </>
                ) : (
                  <>
                    {modalActionType === 'deactivate' ? <PowerOff size={18} /> : <Power size={18} />}
                    {modalActionType === 'deactivate' ? 'Deactivate' : 'Activate'}
                  </>
                )}
              </Button>
            </div>
          }
        >
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Are you sure you want to <strong>{modalActionType}</strong> employee{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {selectedEmployee?.fullName}
            </span>
            ?
          </p>
          {modalActionType === 'deactivate' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              Deactivating an employee will restrict their access to the system and related modules.
              They will no longer appear in active employee lists.
            </p>
          )}
          {modalActionType === 'activate' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              Activating this employee will restore their system access and visibility in active employee lists.
            </p>
          )}
        </ModalWithForm>


    </div>
  );
};

export default EmployeeListPage;