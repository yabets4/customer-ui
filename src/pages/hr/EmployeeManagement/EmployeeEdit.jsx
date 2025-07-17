// pages/EmployeeManagement/EmployeeEdit.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    ArrowLeft, User, Mail, Phone, Briefcase, Building2, Calendar, MapPin,
    Globe, Info, CheckCircle, XCircle, Edit, Save, AlertCircle
} from 'lucide-react';

const mockEmployees = [
    {
        id: 'emp-001',
        firstName: 'Aisha',
        lastName: 'Demisse',
        email: 'aisha.demisse@example.com',
        phone: '+251911234567',
        address: 'Bole Road, Addis Ababa',
        jobTitle: 'Senior HR Manager',
        department: 'Human Resources',
        hireDate: '2020-01-15',
        employmentStatus: 'Active',
        nationality: 'Ethiopian',
        dateOfBirth: '1990-05-20',
        gender: 'Female',
    },
    {
        id: 'emp-002',
        firstName: 'Tesfaye',
        lastName: 'Gebre',
        email: 'tesfaye.gebre@example.com',
        phone: '+251922345678',
        address: 'Kazanchis, Addis Ababa',
        jobTitle: 'Software Engineer',
        department: 'IT',
        hireDate: '2021-03-01',
        employmentStatus: 'Active',
        nationality: 'Ethiopian',
        dateOfBirth: '1988-11-10',
        gender: 'Male',
    },
    // Add more mock employees as needed
];

const EmployeeEdit = () => {
    const { employeeId } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setSaveSuccess(false); // Reset save success status

        setTimeout(() => {
            const foundEmployee = mockEmployees.find(emp => emp.id === employeeId);
            if (foundEmployee) {
                setEmployee(foundEmployee);
            } else {
                setError('Employee not found.');
            }
            setLoading(false);
        }, 700);
    }, [employeeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSaveSuccess(false);

        try {
            // Simulate API call for saving data
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real app, you'd send 'employee' state to your backend
            console.log('Saving employee data:', employee);

            setSaveSuccess(true);
            // Optionally, refresh employee data from backend or update mock data
            // For now, we just show success and keep local state.
        } catch (err) {
            setError('Failed to save employee data. Please try again.');
            console.error('Save employee error:', err);
        } finally {
            setIsSaving(false);
            // Clear success message after a few seconds
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
                <LoadingSpinner />
                <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Loading employee details...</p>
            </div>
        );
    }

    if (error && !employee) { // Only show error if no employee data is loaded
        return (
            <div className="min-h-screen container mx-auto p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md flex items-center">
                    <AlertCircle className="mr-3 text-red-500 dark:text-red-300" size={24} />
                    <div>
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                </div>
                <Link to="/employees">
                    <Button variant="secondary" className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Employee List
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-4">
                    <Edit className="w-11 h-11 text-blue-600 dark:text-blue-400" />
                    Edit Employee: {employee?.firstName} {employee?.lastName}
                </h1>
                <Link to="/hr/employees" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Employee List
                    </Button>
                </Link>
            </div>

            {/* Save Success/Error Messages */}
            {saveSuccess && (
                <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-6 py-4 rounded-xl relative mb-6 shadow-md flex items-center" role="alert">
                    <CheckCircle className="mr-3 text-green-500 dark:text-green-300" size={24} />
                    <div>
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline ml-2">Employee data saved successfully.</span>
                    </div>
                </div>
            )}
            {error && employee && ( // Show error even if employee data is loaded (e.g., save error)
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md flex items-center" role="alert">
                    <AlertCircle className="mr-3 text-red-500 dark:text-red-300" size={24} />
                    <div>
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                </div>
            )}

            {employee && (
                <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
                            <User size={28} className="text-purple-600 dark:text-purple-400" /> Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Input
                                label="First Name"
                                name="firstName"
                                value={employee.firstName || ''}
                                onChange={handleChange}
                                required
                                icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                value={employee.lastName || ''}
                                onChange={handleChange}
                                required
                                icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={employee.email || ''}
                                onChange={handleChange}
                                required
                                icon={<Mail size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={employee.phone || ''}
                                onChange={handleChange}
                                icon={<Phone size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={employee.dateOfBirth || ''}
                                onChange={handleChange}
                                icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
 {/*                            <Select
                                label="Gender"
                                name="gender"
                                value={employee.gender || ''}
                                onChange={(value) => handleSelectChange('gender', value)}
                                options={[
                                    { value: '', label: 'Select Gender' },
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' },
                                ]}
                                icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                            />*/}
                            <Input
                                label="Address"
                                name="address"
                                value={employee.address || ''}
                                onChange={handleChange}
                                icon={<MapPin size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Nationality"
                                name="nationality"
                                value={employee.nationality || ''}
                                onChange={handleChange}
                                icon={<Globe size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
                            <Briefcase size={28} className="text-teal-600 dark:text-teal-400" /> Job Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Input
                                label="Job Title"
                                name="jobTitle"
                                value={employee.jobTitle || ''}
                                onChange={handleChange}
                                required
                                icon={<Briefcase size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Department"
                                name="department"
                                value={employee.department || ''}
                                onChange={handleChange}
                                required
                                icon={<Building2 size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Hire Date"
                                name="hireDate"
                                type="date"
                                value={employee.hireDate || ''}
                                onChange={handleChange}
                                required
                                icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Employment Status"
                                name="employmentStatus"
                                value={employee.employmentStatus || ''}
                                onChange={(value) => handleSelectChange('employmentStatus', value)}
                                options={[
                                    { value: '', label: 'Select Status' },
                                    { value: 'Active', label: 'Active' },
                                    { value: 'On Leave', label: 'On Leave' },
                                    { value: 'Terminated', label: 'Terminated' },
                                    { value: 'Retired', label: 'Retired' },
                                ]}
                                icon={<Info size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <Button
                                type="submit"
                                variant="primary"
                                className="px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <LoadingSpinner size={20} className="text-white" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} /> Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default EmployeeEdit;
