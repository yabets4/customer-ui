// pages/EmployeeManagement/EmployeeDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // For getting employee ID from URL
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner'; // Assuming a loading spinner component
import Card from '../../../components/ui/Card'; // A generic card component for sections

// Lucide React Icons
import {
    User, Briefcase, Phone, Mail, MapPin, Calendar, HeartHandshake, Award, FileText,
    Wallet, Banknote, Clock, ClipboardList, CalendarCheck, Star, Wrench, ArrowLeft,
    AlertCircle, CircleCheck, CircleX, Home, Hash, ReceiptText, CalendarDays,Plane , BriefcaseMedical , Flag, Users, UserCog, Building,
    BookText, Lightbulb, ClipboardCopy, Megaphone, Gauge, Laptop, Smartphone,
    Mars
} from 'lucide-react';

const EmployeeDetailsPage = () => {
    const { id } = useParams(); // Get employee ID from URL, e.g., /employees/123
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Inline Mock Employee Data ---
    const inlineMockEmployees = [
        {
            id: 'emp-001',
            employeeId: 'EMP-AD001',
            PayId: 'pay-001',
            fullName: 'Aisha Demisse',
            profilePhoto: 'https://media.istockphoto.com/id/845569386/photo/posing-dog-with-sunglasses.jpg?s=2048x2048&w=is&k=20&c=PEhKgL-p55nWH8xMnssBmTSzxDtTIrHY6zmCTNQeZIw=',
            email: 'aisha.demisse@example.com',
            phoneNumber: '+251912345678',
            address: 'Bole Road, Addis Ababa, Ethiopia',
            dateOfBirth: '1990-03-15',
            gender: 'Female',
            nationality: 'Ethiopian',
            maritalStatus: 'Married',
            jobTitle: 'Senior HR Manager',
            department: 'Human Resources',
            workLocation: 'Addis Ababa Main Office',
            hireDate: '2018-07-01',
            employeeType: 'Full-time',
            contractType: 'Permanent',
            status: 'active',
            reportsTo: 'N/A',
            emergencyContacts: [
                { name: 'Kebede Demisse', relationship: 'Husband', phone: '+251911223344' },
                { name: 'Sara Lemma', relationship: 'Sister', phone: '+251923456789' },
            ],
            skills: ['Talent Acquisition', 'HR Policy Development', 'Employee Relations', 'Conflict Resolution', 'Payroll Management'],
            certifications: [
                { name: 'Certified HR Professional (CHRP)', issuedBy: 'HRCI', expiryDate: '2025-12-31' },
                { name: 'Project Management Professional (PMP)', issuedBy: 'PMI', expiryDate: '2023-06-10' }, // Expired
            ],
            documents: [
                { name: 'Employment Contract - Aisha Demisse.pdf', type: 'Contract', url: '/docs/emp-001/contract.pdf' },
                { name: 'Educational Certificate - Masters.pdf', type: 'Education', url: '/docs/emp-001/masters.pdf' },
            ],
            payroll: {
                baseSalary: 45000, // ETB
                payFrequency: 'Monthly',
                bankAccount: '1000123456789 (Commercial Bank of Ethiopia)',
            },
            attendanceSummary: {
                presentDays: 20,
                lateOccasions: 2,
                absentDays: 1,
            },
            leaveBalances: [
                { type: 'Annual Leave', totalDays: 15, remainingDays: 10 },
                { type: 'Sick Leave', totalDays: 10, remainingDays: 8 },
                { type: 'Maternity Leave', totalDays: 90, remainingDays: 90 },
            ],
            performance: {
                lastReviewDate: '2024-06-15',
                overallRating: 'Excellent',
                feedbackCountLast30Days: 5,
            },
            assignedAssets: [
                { name: 'Dell Latitude Laptop', serialNumber: 'DLX-4567', assignedDate: '2018-07-01' },
                { name: 'Office Mobile Phone', serialNumber: 'SAMS-9876', assignedDate: '2019-01-10' },
            ],
        },
        {
            id: 'emp-002',
            employeeId: 'EMP-TG002',
            PayId: 'pay-001',
            fullName: 'Tesfaye Gebre',
            profilePhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            email: 'tesfaye.gebre@example.com',
            phoneNumber: '+251934567890',
            address: 'Gerji, Addis Ababa, Ethiopia',
            dateOfBirth: '1985-11-22',
            gender: 'Male',
            nationality: 'Ethiopian',
            maritalStatus: 'Single',
            jobTitle: 'Software Engineer',
            department: 'IT',
            workLocation: 'Addis Ababa Main Office',
            hireDate: '2020-01-15',
            employeeType: 'Full-time',
            contractType: 'Permanent',
            status: 'active',
            reportsTo: 'Aisha Demisse',
            emergencyContacts: [
                { name: 'Zewditu Kebede', relationship: 'Mother', phone: '+251911998877' },
            ],
            skills: ['React', 'Node.js', 'Python', 'Database Design', 'Cloud Computing (AWS)'],
            certifications: [
                { name: 'AWS Certified Developer', issuedBy: 'Amazon', expiryDate: '2026-03-01' },
            ],
            documents: [],
            payroll: {
                baseSalary: 30000,
                payFrequency: 'Monthly',
                bankAccount: '1000987654321 (Awash Bank)',
            },
            attendanceSummary: {
                presentDays: 22,
                lateOccasions: 0,
                absentDays: 0,
            },
            leaveBalances: [
                { type: 'Annual Leave', totalDays: 15, remainingDays: 14 },
                { type: 'Sick Leave', totalDays: 10, remainingDays: 10 },
            ],
            performance: {
                lastReviewDate: '2024-05-20',
                overallRating: 'Good',
                feedbackCountLast30Days: 2,
            },
            assignedAssets: [
                { name: 'MacBook Pro', serialNumber: 'MBP-2022-XYZ', assignedDate: '2020-01-15' },
                { name: 'External Monitor', serialNumber: 'MON-ABC123', assignedDate: '2020-01-15' },
            ],
        },
        // Add more mock employees as needed
    ];
    // --- End Inline Mock Employee Data ---

    useEffect(() => {
        const fetchEmployee = async () => {
            setLoading(true);
            setError(null);
            try {
                // Simulate API call with a delay
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

                const data = inlineMockEmployees.find(emp => emp.id === id);
                if (data) {
                    setEmployee(data);
                } else {
                    setError('Employee not found with the provided ID.');
                }
            } catch (err) {
                setError('Failed to load employee details. Please try again later.');
                console.error('Error fetching employee details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]); // Re-fetch if ID changes

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
                <LoadingSpinner />
                <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Loading employee details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen container mx-auto p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md flex items-center">
                    <AlertCircle className="mr-3 text-red-500 dark:text-red-300" size={24} />
                    <div>
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                </div>
                <Link to="/hr/employees">
                    <Button variant="secondary" className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Employee List
                    </Button>
                </Link>
            </div>
        );
    }

    if (!employee) {
        // This case should ideally be caught by the error state if employee is truly not found
        // but adding a fallback for robustness.
        return (
            <div className="min-h-screen container mx-auto p-6 text-center flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
                <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-6 py-4 rounded-xl relative mb-6 shadow-md flex items-center">
                    <AlertCircle className="mr-3 text-yellow-500 dark:text-yellow-300" size={24} />
                    <div>
                        <strong className="font-bold">Information:</strong>
                        <span className="block sm:inline ml-2">Employee data could not be loaded or does not exist.</span>
                    </div>
                </div>
                <Link to="/hr/employees">
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
                    <User size={40} className="text-blue-600 dark:text-blue-400" /> Employee Details
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link to={`/hr/employees/edit/${employee.id}`} className="w-full">
                        <Button variant="primary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white">
                            <UserCog size={20} /> Edit Employee
                        </Button>
                    </Link>
                    <Link to="/hr/employees" className="w-full">
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <ArrowLeft size={20} /> Back to List
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Employee Profile Header */}
            <Card className="mb-10 p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex-shrink-0">
                    <img
                        src={employee.profilePhoto || 'https://placehold.co/150x150/E0F2F7/334155?text=No+Photo'}
                        alt={employee.fullName}
                        className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-xl transition-transform duration-300 hover:scale-105"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/E0F2F7/334155?text=No+Photo'; }}
                    />
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">
                        {employee.fullName}
                    </h2>
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-center md:justify-start gap-2">
                        <Briefcase size={20} className="text-purple-500 dark:text-purple-400" /> {employee.jobTitle} - {employee.department}
                    </p>
                    <p className="text-md text-gray-600 dark:text-gray-400 mb-3 flex items-center justify-center md:justify-start gap-2">
                        <Hash size={18} className="text-gray-500 dark:text-gray-400" /> Employee ID: {employee.employeeId}
                    </p>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm
                        ${employee.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                        {employee.status === 'active' ? <CircleCheck size={16} className="mr-1" /> : <CircleX size={16} className="mr-1" />}
                        Status: {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card className="col-span-1 lg:col-span-2 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <User size={24} className="text-blue-600 dark:text-blue-400" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <DetailItem icon={<Calendar size={18} />} label="Date of Birth" value={employee.dateOfBirth} />
                        <DetailItem icon={<Mars size={18} />} label="Gender" value={employee.gender} />
                        <DetailItem icon={<Flag size={18} />} label="Nationality" value={employee.nationality} />
                        <DetailItem icon={<HeartHandshake size={18} />} label="Marital Status" value={employee.maritalStatus} />
                        <DetailItem icon={<Mail size={18} />} label="Contact Email" value={employee.email} isLink={true} linkPrefix="mailto:" />
                        <DetailItem icon={<Phone size={18} />} label="Phone Number" value={employee.phoneNumber} isLink={true} linkPrefix="tel:" />
                        <div className="md:col-span-2">
                            <DetailItem icon={<MapPin size={18} />} label="Address" value={employee.address} />
                        </div>
                    </div>
                </Card>

                {/* Employment Details */}
                <Card className="col-span-1 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <Briefcase size={24} className="text-purple-600 dark:text-purple-400" /> Employment Details
                    </h3>
                    <div className="space-y-5">
                        <DetailItem icon={<CalendarCheck size={18} />} label="Hire Date" value={employee.hireDate} />
                        <DetailItem icon={<Building size={18} />} label="Work Location" value={employee.workLocation} />
                        <DetailItem icon={<Users size={18} />} label="Reporting To" value={employee.reportsTo || 'N/A'} />
                        <DetailItem icon={<UserCog size={18} />} label="Employee Type" value={employee.employeeType} />
                        <DetailItem icon={<BookText size={18} />} label="Contract Type" value={employee.contractType} />
                    </div>
                </Card>

                {/* Emergency Contacts */}
                <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <HeartHandshake size={24} className="text-pink-600 dark:text-pink-400" /> Emergency Contacts
                    </h3>
                    {employee.emergencyContacts && employee.emergencyContacts.length > 0 ? (
                        <div className="space-y-4">
                            {employee.emergencyContacts.map((contact, index) => (
                                <div key={index} className="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
                                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <User size={16} /> {contact.name}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">Relationship: {contact.relationship}</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 ml-6 flex items-center gap-1">
                                        <Phone size={14} /> {contact.phone}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No emergency contacts listed.</p>
                    )}
                </Card>

                {/* Skills & Certifications */}
                <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <Lightbulb size={24} className="text-yellow-600 dark:text-yellow-400" /> Skills & Certifications
                    </h3>
                    <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <ClipboardList size={20} /> Skills
                    </h4>
                    {employee.skills && employee.skills.length > 0 ? (
                        <ul className="list-none space-y-2 pl-0">
                            {employee.skills.map((skill, index) => (
                                <li key={index} className="text-md text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <span className="text-blue-500 dark:text-blue-400">●</span> {skill}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No skills listed.</p>
                    )}
                    <h4 className="text-lg font-semibold mt-8 mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Award size={20} /> Certifications
                    </h4>
                    {employee.certifications && employee.certifications.length > 0 ? (
                        <div className="space-y-4">
                            {employee.certifications.map((cert, index) => (
                                <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
                                    <div>
                                        <p className="text-md font-medium text-gray-900 dark:text-gray-100">{cert.name}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">Issued By: {cert.issuedBy}</p>
                                    </div>
                                    <p className={`text-sm mt-1 sm:mt-0 ${new Date(cert.expiryDate) < new Date() ? 'text-red-500 dark:text-red-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                                        Expiry: {cert.expiryDate}
                                        {new Date(cert.expiryDate) < new Date() && <span className="ml-1">(Expired)</span>}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No certifications listed.</p>
                    )}
                </Card>

                {/* Documents & Attachments */}
                <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <FileText size={24} className="text-teal-600 dark:text-teal-400" /> Documents & Attachments
                    </h3>
                    {employee.documents && employee.documents.length > 0 ? (
                        <ul className="space-y-3">
                            {employee.documents.map((doc, index) => (
                                <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                                        <ClipboardCopy size={18} /> {doc.name}
                                    </a>
                                    <span className="text-sm text-gray-700 dark:text-gray-300 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md">{doc.type}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No documents attached.</p>
                    )}
                </Card>

                {/* Payroll & Compensation Summary */}
                <Card className="lg:col-span-3 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <Wallet size={24} className="text-green-600 dark:text-green-400" /> Payroll & Compensation Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
                        <DetailItem icon={<Banknote size={18} />} label="Base Salary" value={`ETB ${employee.payroll?.baseSalary?.toLocaleString() || 'N/A'}`} />
                        <DetailItem icon={<Clock size={18} />} label="Pay Frequency" value={employee.payroll?.payFrequency || 'N/A'} />
                        <DetailItem icon={<Home size={18} />} label="Bank Account" value={employee.payroll?.bankAccount || 'Not set'} />
                    </div>
                    <div className="mt-6">
                        <Link to={`/hr/payroll/view/${employee.PayId}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <ReceiptText size={16} /> View Payslip History
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Attendance Summary */}
                <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <ClipboardList size={24} className="text-indigo-600 dark:text-indigo-400" /> Attendance Summary
                    </h3>
                    <div className="space-y-4">
                        <DetailItem icon={<CalendarCheck size={18} />} label="Total Days Present (This Month)" value={employee.attendanceSummary?.presentDays || 0} />
                        <DetailItem icon={<Clock size={18} />} label="Total Lates (This Month)" value={employee.attendanceSummary?.lateOccasions || 0} />
                        <DetailItem icon={<CalendarDays size={18} />} label="Total Absences (This Month)" value={employee.attendanceSummary?.absentDays || 0} />
                    </div>
                    <div className="mt-6">
                        <Link to={`/attendance/log/${employee.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <FileText size={16} /> View Full Attendance Log
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Leave Balances */}
                <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <Plane size={24} className="text-orange-600 dark:text-orange-400" /> Leave Balances
                    </h3>
                    {employee.leaveBalances && employee.leaveBalances.length > 0 ? (
                        <div className="space-y-4">
                            {employee.leaveBalances.map((leave, index) => (
                                <div key={index} className="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
                                    <p className="text-md text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        {getLeaveBalanceIcon(leave.type)} {leave.type}:
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 ml-6">
                                        {leave.remainingDays} <span className="text-sm text-gray-700 dark:text-gray-300">days remaining (out of {leave.totalDays})</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No leave balance data.</p>
                    )}
                    <div className="mt-6">
                        <Link to={`/hr/leave-request/${employee.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <FileText size={16} /> View Leave Request History
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Performance Snapshot */}
                <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <Star size={24} className="text-red-600 dark:text-red-400" /> Performance Snapshot
                    </h3>
                    <div className="space-y-4">
                        <DetailItem icon={<Calendar size={18} />} label="Last Review Date" value={employee.performance?.lastReviewDate || 'N/A'} />
                        <DetailItem icon={<Gauge size={18} />} label="Overall Rating (Last Review)" value={employee.performance?.overallRating || 'N/A'} />
                        <DetailItem icon={<Megaphone size={18} />} label="Feedback Count (Last 30 days)" value={employee.performance?.feedbackCountLast30Days || 0} />
                    </div>
                    <div className="mt-6">
                        <Link to={`/performance/reviews/${employee.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <BookText size={16} /> View Performance Reviews
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Tool & Asset Assignment */}
                <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <Wrench size={24} className="text-cyan-600 dark:text-cyan-400" /> Assigned Tools & Assets
                    </h3>
                    {employee.assignedAssets && employee.assignedAssets.length > 0 ? (
                        <ul className="space-y-4">
                            {employee.assignedAssets.map((asset, index) => (
                                <li key={index} className="text-md text-gray-900 dark:text-gray-100 flex items-start gap-2 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
                                    {getAssetIcon(asset.name)}
                                    <div>
                                        <p className="font-semibold">{asset.name}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">Serial: {asset.serialNumber || 'N/A'}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">Assigned: {asset.assignedDate}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No tools or assets currently assigned.</p>
                    )}
                    <div className="mt-6">
                        <Link to={`/tools/assignment-log/${employee.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <FileText size={16} /> View Asset History
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// Helper component for consistent detail item display
const DetailItem = ({ icon, label, value, isLink = false, linkPrefix = '' }) => (
    <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-1">
            {icon} {label}:
        </p>
        {isLink ? (
            <a href={`${linkPrefix}${value}`} className="text-md text-blue-600 dark:text-blue-400 hover:underline break-all">
                {value}
            </a>
        ) : (
            <p className="text-md text-gray-900 dark:text-gray-100">{value}</p>
        )}
    </div>
);

// Helper function to get specific icons for leave types
const getLeaveBalanceIcon = (type) => {
    switch (type) {
        case 'Annual Leave': return <Plane size={18} className="text-blue-500 dark:text-blue-400" />;
        case 'Sick Leave': return <BriefcaseMedical size={18} className="text-red-500 dark:text-red-400" />;
        case 'Maternity Leave': return <Home size={18} className="text-pink-500 dark:text-pink-400" />;
        case 'Paternity Leave': return <Users size={18} className="text-indigo-500 dark:text-indigo-400" />;
        default: return <Info size={18} className="text-gray-500 dark:text-gray-400" />;
    }
};

// Helper function to get specific icons for assets
const getAssetIcon = (assetName) => {
    const lowerCaseName = assetName.toLowerCase();
    if (lowerCaseName.includes('laptop')) return <Laptop size={18} className="text-green-500 dark:text-green-400" />;
    if (lowerCaseName.includes('mobile') || lowerCaseName.includes('phone')) return <Smartphone size={18} className="text-purple-500 dark:text-purple-400" />;
    return <Wrench size={18} className="text-gray-500 dark:text-gray-400" />;
};


export default EmployeeDetailsPage;
