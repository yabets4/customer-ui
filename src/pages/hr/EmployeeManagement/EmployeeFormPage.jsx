// pages/EmployeeManagement/EmployeeFormPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Card from '../../../components/ui/Card';

// Lucide React Icons
import {
    User, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign,
    GraduationCap, FileText, Plus, Minus, Save, ArrowLeft, Building2,
    Book, Award, Banknote, ClipboardList, AlertCircle, Flag, Heart 
} from 'lucide-react';

const EmployeeFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // --- Mock Data for Dropdowns and Initial Employee Fetch (Inline) ---
    const mockDepartments = [
        { value: '', label: 'Select Department' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'Finance', label: 'Finance' },
        { value: 'IT', label: 'Information Technology' },
        { value: 'Operations', label: 'Operations' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
    ];

    const mockJobTitles = {
        HR: [
            { value: '', label: 'Select Job Title' },
            { value: 'HR Manager', label: 'HR Manager' },
            { value: 'HR Assistant', label: 'HR Assistant' },
            { value: 'Recruitment Specialist', label: 'Recruitment Specialist' },
        ],
        IT: [
            { value: '', label: 'Select Job Title' },
            { value: 'Software Engineer', label: 'Software Engineer' },
            { value: 'DevOps Engineer', label: 'DevOps Engineer' },
            { value: 'IT Support Specialist', label: 'IT Support Specialist' },
        ],
        // Add more job titles for other departments
        default: [{ value: '', label: 'Select Job Title' }],
    };

    const mockWorkLocations = [
        { value: 'Addis Ababa Main Office', label: 'Addis Ababa Main Office' },
        { value: 'Dire Dawa Branch', label: 'Dire Dawa Branch' },
        { value: 'Remote', label: 'Remote' },
    ];

    const mockEmployeeTypes = [
        { value: '', label: 'Select Type' },
        { value: 'Full-time', label: 'Full-time' },
        { value: 'Part-time', label: 'Part-time' },
        { value: 'Contractor', label: 'Contractor' },
    ];

    const mockContractTypes = [
        { value: '', label: 'Select Type' },
        { value: 'Permanent', label: 'Permanent' },
        { value: 'Fixed-term', label: 'Fixed-term' },
        { value: 'Temporary', label: 'Temporary' },
    ];

    const mockGenders = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ];

    const mockMaritalStatuses = [
        { value: '', label: 'Select Status' },
        { value: 'Single', label: 'Single' },
        { value: 'Married', label: 'Married' },
        { value: 'Divorced', label: 'Divorced' },
        { value: 'Widowed', label: 'Widowed' },
    ];

    const mockNationalities = [
        { value: '', label: 'Select Nationality' },
        { value: 'Ethiopian', label: 'Ethiopian' },
        // ... more nationalities
    ];

    // Mock employees for edit mode (inline)
    const inlineMockEmployees = [
        {
            id: 'emp-001',
            employeeId: 'EMP-AD001',
            fullName: 'Aisha Demisse',
            profilePhoto: '[https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D](https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            email: 'aisha.demisse@example.com',
            phoneNumber: '+251912345678',
            address: 'Bole Road, Addis Ababa, Ethiopia',
            dateOfBirth: '1990-03-15',
            gender: 'Female',
            nationality: 'Ethiopian',
            maritalStatus: 'Married',
            jobTitle: 'HR Manager',
            department: 'HR',
            workLocation: 'Addis Ababa Main Office',
            hireDate: '2018-07-01',
            employeeType: 'Full-time',
            contractType: 'Permanent',
            status: 'active',
            reportsTo: '',
            emergencyContacts: [
                { name: 'Kebede Demisse', relationship: 'Husband', phone: '+251911223344' },
            ],
            skills: ['Talent Acquisition', 'HR Policy Development'],
            certifications: [
                { name: 'Certified HR Professional (CHRP)', issuedBy: 'HRCI', expiryDate: '2025-12-31' },
            ],
            documents: [],
            payroll: { baseSalary: 45000, payFrequency: 'Monthly', bankAccount: '1000123456789' },
        },
        {
            id: 'emp-002',
            employeeId: 'EMP-TG002',
            fullName: 'Tesfaye Gebre',
            profilePhoto: '[https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D](https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
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
            skills: ['React', 'Node.js'],
            certifications: [
                { name: 'AWS Certified Developer', issuedBy: 'Amazon', expiryDate: '2026-03-01' },
            ],
            documents: [],
            payroll: { baseSalary: 30000, payFrequency: 'Monthly', bankAccount: '1000987654321' },
        },
    ];
    // --- End Mock Data ---


    const initialFormData = {
        employeeId: '',
        fullName: '',
        profilePhoto: '',
        email: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        maritalStatus: '',
        jobTitle: '',
        department: '',
        workLocation: '',
        hireDate: '',
        employeeType: '',
        contractType: '',
        status: 'active',
        reportsTo: '',
        emergencyContacts: [{ name: '', relationship: '', phone: '' }],
        skills: [],
        newSkill: '',
        certifications: [{ name: '', issuedBy: '', expiryDate: '' }],
        documents: [],
        payroll: {
            baseSalary: '',
            payFrequency: 'Monthly',
            bankAccount: '',
        },
        dynamicRoles: [],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [formValidationErrors, setFormValidationErrors] = useState({});

    // Load employee data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            setTimeout(() => {
                const employeeToEdit = inlineMockEmployees.find(emp => emp.id === id);
                if (employeeToEdit) {
                    setFormData({
                        ...employeeToEdit,
                        emergencyContacts: employeeToEdit.emergencyContacts.length > 0 ? employeeToEdit.emergencyContacts : [{ name: '', relationship: '', phone: '' }],
                        certifications: employeeToEdit.certifications.length > 0 ? employeeToEdit.certifications : [{ name: '', issuedBy: '', expiryDate: '' }],
                        skills: employeeToEdit.skills || [],
                        newSkill: '',
                    });
                } else {
                    setSubmitError('Employee not found for editing.');
                }
                setLoading(false);
            }, 500);
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'number' ? parseFloat(value) : value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
        if (formValidationErrors[name]) {
            setFormValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleArrayChange = (index, field, value, arrayName) => {
        setFormData(prev => {
            const newArray = [...prev[arrayName]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayName]: newArray };
        });
    };

    const addArrayItem = (arrayName, emptyItem) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], emptyItem],
        }));
    };

    const removeArrayItem = (index, arrayName) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index),
        }));
    };

    const handleAddSkill = () => {
        if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, formData.newSkill.trim()],
                newSkill: '',
            }));
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove),
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.fullName.trim()) errors.fullName = 'Full Name is required.';
        if (!formData.email.trim()) {
            errors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email address is invalid.';
        }
        if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone Number is required.';
        if (!formData.department) errors.department = 'Department is required.';
        if (!formData.jobTitle) errors.jobTitle = 'Job Title is required.';
        if (!formData.hireDate) errors.hireDate = 'Hire Date is required.';
        if (!formData.employeeType) errors.employeeType = 'Employee Type is required.';
        if (!formData.contractType) errors.contractType = 'Contract Type is required.';
        if (formData.payroll.baseSalary && isNaN(formData.payroll.baseSalary)) errors['payroll.baseSalary'] = 'Base Salary must be a number.';

        if (formData.emergencyContacts.some(contact => (contact.name.trim() || contact.phone.trim()) && (!contact.name.trim() || !contact.phone.trim()))) {
            errors.emergencyContacts = 'Please ensure all emergency contacts have both a name and a phone number, or leave both empty.';
        }


        setFormValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validateForm()) {
            setSubmitError('Please correct the highlighted errors in the form.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                console.log('Updating Employee:', formData);
            } else {
                console.log('Adding New Employee:', formData);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert(`Employee ${isEditMode ? 'updated' : 'added'} successfully! (Check console for data)`);
            navigate('/employees');
        } catch (err) {
            setSubmitError(`Failed to ${isEditMode ? 'update' : 'add'} employee. ${err.message || ''}`);
            console.error('Submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredJobTitles = () => {
        return mockJobTitles[formData.department] || mockJobTitles.default;
    };

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    {isEditMode ? (
                        <>
                            <User className="w-10 h-10 text-blue-600" /> Edit Employee
                        </>
                    ) : (
                        <>
                            <User className="w-10 h-10 text-indigo-600" /> Add New Employee
                        </>
                    )}
                </h1>
                <Link to="/hr/employees">
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to List
                    </Button>
                </Link>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">{isEditMode ? 'Loading employee data...' : 'Submitting...'}</p>
                </div>
            )}

            {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{submitError}</span>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card className="p-8 mt-1 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <User size={24} className="text-blue-500" /> Personal Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Input
                                label="Employee ID"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                placeholder="e.g., EMP-001"
                                disabled={isEditMode}
                                error={formValidationErrors.employeeId}
                                icon={<ClipboardList size={18} className="text-gray-400" />}
                            />
                            <Input
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                error={formValidationErrors.fullName}
                                icon={<User size={18} className="text-gray-400" />}
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john.doe@example.com"
                                required
                                error={formValidationErrors.email}
                                icon={<Mail size={18} className="text-gray-400" />}
                            />
                            <Input
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+2519..."
                                required
                                error={formValidationErrors.phoneNumber}
                                icon={<Phone size={18} className="text-gray-400" />}
                            />
                            <Input
                                label="Profile Photo URL"
                                name="profilePhoto"
                                value={formData.profilePhoto}
                                onChange={handleChange}
                                icon={<User size={18} className="text-gray-400" />}
                            />
                            <Input
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Bole Road, Addis Ababa"
                                icon={<MapPin size={18} className="text-gray-400" />}
                            />
                            <Input
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                icon={<Calendar size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Gender"
                                name="gender"
                                options={mockGenders}
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                icon={<User size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Nationality"
                                name="nationality"
                                options={mockNationalities}
                                value={formData.nationality}
                                onChange={handleChange}
                                required
                                icon={<Flag size={18} className="text-gray-400" />} 
                            />
                            <Select
                                label="Marital Status"
                                name="maritalStatus"
                                options={mockMaritalStatuses}
                                value={formData.maritalStatus}
                                onChange={handleChange}
                                required
                                icon={<Heart size={18} className="text-gray-400" />} 
                            />
                        </div>
                    </Card>

                    {/* Employment Details */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <Briefcase size={24} className="text-green-500" /> Employment Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Select
                                label="Department"
                                name="department"
                                options={mockDepartments}
                                value={formData.department}
                                onChange={handleChange}
                                required
                                error={formValidationErrors.department}
                                icon={<Building2 size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Job Title"
                                name="jobTitle"
                                options={getFilteredJobTitles()}
                                value={formData.jobTitle}
                                onChange={handleChange}
                                
                                required
                                error={formValidationErrors.jobTitle}
                                icon={<Award size={18} className="text-gray-400" />}
                            />
                            <Input
                                label="Hire Date"
                                name="hireDate"
                                type="date"
                                value={formData.hireDate}
                                onChange={handleChange}
                                required
                                error={formValidationErrors.hireDate}
                                icon={<Calendar size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Work Location"
                                name="workLocation"
                                options={mockWorkLocations}
                                value={formData.workLocation}
                                onChange={handleChange}
                                required
                                icon={<MapPin size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Employee Type"
                                name="employeeType"
                                options={mockEmployeeTypes}
                                value={formData.employeeType}
                                onChange={handleChange}
                                required
                                error={formValidationErrors.employeeType}
                                icon={<User size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Contract Type"
                                name="contractType"
                                options={mockContractTypes}
                                value={formData.contractType}
                                onChange={handleChange}
                                required
                                error={formValidationErrors.contractType}
                                icon={<FileText size={18} className="text-gray-400" />}
                            />
                            <Input
                                label="Reports To (Manager's Name/ID)"
                                name="reportsTo"
                                value={formData.reportsTo}
                                onChange={handleChange}
                                placeholder="e.g., Jane Doe / EMP-002"
                                icon={<User size={18} className="text-gray-400" />}
                            />
                        </div>
                    </Card>

                    {/* Emergency Contacts */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <Phone size={24} className="text-red-500" /> Emergency Contacts
                        </h2>
                        {formValidationErrors.emergencyContacts && (
                            <p className="text-red-500 text-sm mb-3 flex items-center gap-1">
                                <AlertCircle size={16} /> {formValidationErrors.emergencyContacts}
                            </p>
                        )}
                        {formData.emergencyContacts.map((contact, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <Input
                                    label="Contact Name"
                                    name={`contact-name-${index}`}
                                    value={contact.name}
                                    onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'emergencyContacts')}
                                    placeholder="Contact Person Name"
                                    icon={<User size={18} className="text-gray-400" />}
                                />
                                <Input
                                    label="Relationship"
                                    name={`contact-relationship-${index}`}
                                    value={contact.relationship}
                                    onChange={(e) => handleArrayChange(index, 'relationship', e.target.value, 'emergencyContacts')}
                                    placeholder="e.g., Parent, Spouse"
                                    icon={<Heart size={18} className="text-gray-400" />}
                                />
                                <Input
                                    label="Phone"
                                    name={`contact-phone-${index}`}
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(e) => handleArrayChange(index, 'phone', e.target.value, 'emergencyContacts')}
                                    placeholder="+251..."
                                    icon={<Phone size={18} className="text-gray-400" />}
                                />
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeArrayItem(index, 'emergencyContacts')}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <Minus size={18} /> Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => addArrayItem('emergencyContacts', { name: '', relationship: '', phone: '' })}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <Plus size={20} /> Add Emergency Contact
                        </Button>
                    </Card>

                    {/* Skills & Certifications */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <GraduationCap size={24} className="text-purple-500" /> Skills & Certifications
                        </h2>
                        {/* Skills Section */}
                        <h3 className="text-xl font-medium mb-3 text-gray-800 flex items-center gap-2">
                            <Book size={20} className="text-gray-600" /> Skills
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {formData.skills.map((skill, index) => (
                                <span key={index} className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200 shadow-sm">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="ml-2 -mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 text-blue-900 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Minus size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2 mb-6">
                            <Input
                                name="newSkill"
                                value={formData.newSkill}
                                onChange={handleChange}
                                placeholder="Add new skill..."
                                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                                className="flex-grow"
                                icon={<Plus size={18} className="text-gray-400" />}
                            />
                            <Button type="button" onClick={handleAddSkill} className="flex items-center gap-2">
                                <Plus size={20} /> Add Skill
                            </Button>
                        </div>

                        {/* Certifications Section */}
                        <h3 className="text-xl font-medium mb-3 text-gray-800 flex items-center gap-2">
                            <Award size={20} className="text-gray-600" /> Certifications
                        </h3>
                        {formData.certifications.map((cert, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <Input
                                    label="Certification Name"
                                    name={`cert-name-${index}`}
                                    value={cert.name}
                                    onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'certifications')}
                                    placeholder="e.g., PMP"
                                    icon={<FileText size={18} className="text-gray-400" />}
                                />
                                <Input
                                    label="Issued By"
                                    name={`cert-issuedBy-${index}`}
                                    value={cert.issuedBy}
                                    onChange={(e) => handleArrayChange(index, 'issuedBy', e.target.value, 'certifications')}
                                    placeholder="e.g., PMI"
                                    icon={<Building2 size={18} className="text-gray-400" />}
                                />
                                <Input
                                    label="Expiry Date"
                                    name={`cert-expiryDate-${index}`}
                                    type="date"
                                    value={cert.expiryDate}
                                    onChange={(e) => handleArrayChange(index, 'expiryDate', e.target.value, 'certifications')}
                                    icon={<Calendar size={18} className="text-gray-400" />}
                                />
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeArrayItem(index, 'certifications')}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <Minus size={18} /> Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => addArrayItem('certifications', { name: '', issuedBy: '', expiryDate: '' })}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <Plus size={20} /> Add Certification
                        </Button>
                    </Card>

                    {/* Payroll Information */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <DollarSign size={24} className="text-teal-500" /> Payroll Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Base Salary (ETB)"
                                name="payroll.baseSalary"
                                type="number"
                                value={formData.payroll.baseSalary}
                                onChange={handleChange}
                                placeholder="e.g., 25000"
                                error={formValidationErrors['payroll.baseSalary']}
                                icon={<Banknote size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Pay Frequency"
                                name="payroll.payFrequency"
                                options={[
                                    { value: 'Monthly', label: 'Monthly' },
                                    { value: 'Bi-Weekly', label: 'Bi-Weekly' },
                                    { value: 'Weekly', label: 'Weekly' },
                                ]}
                                value={formData.payroll.payFrequency}
                                onChange={handleChange}
                                icon={<Calendar size={18} className="text-gray-400" />}
                            />
                            <Input
                                label="Bank Account Number"
                                name="payroll.bankAccount"
                                value={formData.payroll.bankAccount}
                                onChange={handleChange}
                                placeholder="e.g., 1000123456789"
                                className="md:col-span-2"
                                icon={<Banknote size={18} className="text-gray-400" />}
                            />
                        </div>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/hr/employees')}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (
                                <>
                                    <Save size={20} /> {isEditMode ? 'Update Employee' : 'Add Employee'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EmployeeFormPage;
