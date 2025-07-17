// pages/PayrollManagement/CompensationSettingsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal'; // Assuming ModalWithForm for form editing
import Table from '../../../components/ui/Table'; // Assuming a reusable Table component
import Input from '../../../components/ui/input'; // Assuming Input component for form fields
import Select from '../../../components/ui/Select'; // Assuming Select component for form fields

// Lucide React Icons
import {
    DollarSign, ArrowLeft, Settings, CreditCard, Percent, Maximize2, Plus, Edit, Trash2,
    AlertCircle, Save, BookText, Banknote, Landmark, Gift, Clock, PiggyBank, Scale, FileText,
    Info, TrendingDown
} from 'lucide-react';

const CompensationSettingsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for Loan Types
    const [loanTypes, setLoanTypes] = useState([]);
    const [showLoanTypeModal, setShowLoanTypeModal] = useState(false);
    const [currentLoanType, setCurrentLoanType] = useState(null);

    // State for Bonus Policies
    const [bonusPolicies, setBonusPolicies] = useState([]);
    const [showBonusPolicyModal, setShowBonusPolicyModal] = useState(false);
    const [currentBonusPolicy, setCurrentBonusPolicy] = useState(null);

    // State for Overtime Rules
    const [overtimeRules, setOvertimeRules] = useState([]);
    const [showOvertimeRuleModal, setShowOvertimeRuleModal] = useState(false);
    const [currentOvertimeRule, setCurrentOvertimeRule] = useState(null);

    // State for Allowance Types
    const [allowanceTypes, setAllowanceTypes] = useState([]);
    const [showAllowanceTypeModal, setShowAllowanceTypeModal] = useState(false);
    const [currentAllowanceType, setCurrentAllowanceType] = useState(null);

    // State for Salary Bands
    const [salaryBands, setSalaryBands] = useState([]);
    const [showSalaryBandModal, setShowSalaryBandModal] = useState(false);
    const [currentSalaryBand, setCurrentSalaryBand] = useState(null);

    // State for Tax Configurations
    const [taxConfigurations, setTaxConfigurations] = useState([]);
    const [showTaxConfigurationModal, setShowTaxConfigurationModal] = useState(false);
    const [currentTaxConfiguration, setCurrentTaxConfiguration] = useState(null);


    // --- Inline Mock Data ---
    const mockLoanTypesData = [
        { id: 'loan-001', name: 'Emergency Loan', interestRate: 5, maxAmount: 10000, description: 'Short-term loan for urgent needs.' },
        { id: 'loan-002', name: 'Housing Advance', interestRate: 3, maxAmount: 50000, description: 'Advance for housing-related expenses.' },
        { id: 'loan-003', name: 'Education Loan', interestRate: 4, maxAmount: 20000, description: 'Support for employee education or dependents.' },
    ];

    const mockBonusPoliciesData = [
        { id: 'bonus-001', name: 'Annual Performance Bonus', type: 'Percentage', value: 10, criteria: 'Based on individual performance review (1-5 scale)', description: 'Awarded annually based on performance.' },
        { id: 'bonus-002', name: 'Project Completion Bonus', type: 'Fixed Amount', value: 5000, criteria: 'Successful completion of critical projects', description: 'One-time bonus for project milestones.' },
    ];

    const mockOvertimeRulesData = [
        { id: 'ot-001', name: 'Weekday Overtime', multiplier: 1.5, applicableHours: 'After 8 hours', description: '1.5x pay for hours worked beyond standard 8 hours on weekdays.' },
        { id: 'ot-002', name: 'Weekend Overtime', multiplier: 2.0, applicableHours: 'All hours', description: '2.0x pay for all hours worked on weekends.' },
    ];

    const mockAllowanceTypesData = [
        { id: 'allow-001', name: 'Transport Allowance', type: 'Fixed Amount', value: 1500, description: 'Monthly allowance for commuting expenses.' },
        { id: 'allow-002', name: 'Housing Allowance', type: 'Percentage', value: 20, description: '20% of base salary for housing.' },
        { id: 'allow-003', name: 'Meal Allowance', type: 'Fixed Amount', value: 500, description: 'Monthly allowance for meals.' },
    ];

    const mockSalaryBandsData = [
        { id: 'band-001', name: 'Junior Associate', grade: 'A1', minSalary: 15000, maxSalary: 25000, description: 'Entry-level positions.' },
        { id: 'band-002', name: 'Senior Specialist', grade: 'B2', minSalary: 30000, maxSalary: 50000, description: 'Experienced professional roles.' },
        { id: 'band-003', name: 'Team Lead', grade: 'C1', minSalary: 55000, maxSalary: 80000, description: 'First-line management roles.' },
    ];

    const mockTaxConfigurationsData = [
        { id: 'tax-001', name: 'Income Tax (Ethiopia)', type: 'Slab', description: 'Progressive tax based on income brackets.' },
        { id: 'tax-002', name: 'Pension Contribution (Employee)', type: 'Percentage', value: 7, description: 'Employee contribution to pension fund.' },
        { id: 'tax-003', name: 'Pension Contribution (Employer)', type: 'Percentage', value: 11, description: 'Employer contribution to pension fund.' },
    ];
    // --- End Inline Mock Data ---

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            setLoanTypes(mockLoanTypesData);
            setBonusPolicies(mockBonusPoliciesData);
            setOvertimeRules(mockOvertimeRulesData);
            setAllowanceTypes(mockAllowanceTypesData);
            setSalaryBands(mockSalaryBandsData);
            setTaxConfigurations(mockTaxConfigurationsData);
            setLoading(false);
        }, 700);
    }, []);

    // --- CRUD Handlers ---

    // Generic save function for all types
    const handleSave = async (type, formData, setData, currentData, closeModal) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

            if (formData.id) {
                // Edit existing
                const updatedData = currentData.map(item =>
                    item.id === formData.id ? { ...formData, ...parseNumbers(formData) } : item
                );
                setData(updatedData);
                alert(`${type} updated successfully!`);
            } else {
                // Add new
                const newItem = {
                    id: `${type.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`, // Simple unique ID
                    ...formData,
                    ...parseNumbers(formData),
                };
                setData([...currentData, newItem]);
                alert(`New ${type.toLowerCase()} added successfully!`);
            }
            closeModal(false);
        } catch (err) {
            setError(`Failed to save ${type.toLowerCase()}. ${err.message || ''}`);
            console.error(`Save ${type.toLowerCase()} error:`, err);
        } finally {
            setLoading(false);
        }
    };

    // Helper to parse numbers from form data
    const parseNumbers = (formData) => {
        const parsed = {};
        for (const key in formData) {
            if (typeof formData[key] === 'string' && !isNaN(Number(formData[key])) && key !== 'description' && key !== 'criteria') {
                parsed[key] = Number(formData[key]);
            }
        }
        return parsed;
    };

    // Generic delete function for all types
    const handleDelete = (type, id, setData, currentData) => {
        alert(`Are you sure you want to delete this ${type.toLowerCase()}? This action cannot be undone.`);
        // In a real app, you'd have a custom confirmation modal here.
        setLoading(true);
        setError(null);
        setTimeout(() => {
            const updatedData = currentData.filter(item => item.id !== id);
            setData(updatedData);
            alert(`${type} deleted successfully.`);
            setLoading(false);
        }, 500);
    };

    // --- Loan Type Handlers ---
    const handleAddLoanType = () => { setCurrentLoanType(null); setShowLoanTypeModal(true); };
    const handleEditLoanType = (loanType) => { setCurrentLoanType(loanType); setShowLoanTypeModal(true); };
    const handleDeleteLoanType = (id) => handleDelete('Loan Type', id, setLoanTypes, loanTypes);
    const handleSaveLoanType = (formData) => handleSave('Loan Type', formData, setLoanTypes, loanTypes, setShowLoanTypeModal);

    // --- Bonus Policy Handlers ---
    const handleAddBonusPolicy = () => { setCurrentBonusPolicy(null); setShowBonusPolicyModal(true); };
    const handleEditBonusPolicy = (policy) => { setCurrentBonusPolicy(policy); setShowBonusPolicyModal(true); };
    const handleDeleteBonusPolicy = (id) => handleDelete('Bonus Policy', id, setBonusPolicies, bonusPolicies);
    const handleSaveBonusPolicy = (formData) => handleSave('Bonus Policy', formData, setBonusPolicies, bonusPolicies, setShowBonusPolicyModal);

    // --- Overtime Rule Handlers ---
    const handleAddOvertimeRule = () => { setCurrentOvertimeRule(null); setShowOvertimeRuleModal(true); };
    const handleEditOvertimeRule = (rule) => { setCurrentOvertimeRule(rule); setShowOvertimeRuleModal(true); };
    const handleDeleteOvertimeRule = (id) => handleDelete('Overtime Rule', id, setOvertimeRules, overtimeRules);
    const handleSaveOvertimeRule = (formData) => handleSave('Overtime Rule', formData, setOvertimeRules, overtimeRules, setShowOvertimeRuleModal);

    // --- Allowance Type Handlers ---
    const handleAddAllowanceType = () => { setCurrentAllowanceType(null); setShowAllowanceTypeModal(true); };
    const handleEditAllowanceType = (type) => { setCurrentAllowanceType(type); setShowAllowanceTypeModal(true); };
    const handleDeleteAllowanceType = (id) => handleDelete('Allowance Type', id, setAllowanceTypes, allowanceTypes);
    const handleSaveAllowanceType = (formData) => handleSave('Allowance Type', formData, setAllowanceTypes, allowanceTypes, setShowAllowanceTypeModal);

    // --- Salary Band Handlers ---
    const handleAddSalaryBand = () => { setCurrentSalaryBand(null); setShowSalaryBandModal(true); };
    const handleEditSalaryBand = (band) => { setCurrentSalaryBand(band); setShowSalaryBandModal(true); };
    const handleDeleteSalaryBand = (id) => handleDelete('Salary Band', id, setSalaryBands, salaryBands);
    const handleSaveSalaryBand = (formData) => handleSave('Salary Band', formData, setSalaryBands, salaryBands, setShowSalaryBandModal);

    // --- Tax Configuration Handlers ---
    const handleAddTaxConfiguration = () => { setCurrentTaxConfiguration(null); setShowTaxConfigurationModal(true); };
    const handleEditTaxConfiguration = (config) => { setCurrentTaxConfiguration(config); setShowTaxConfigurationModal(true); };
    const handleDeleteTaxConfiguration = (id) => handleDelete('Tax Configuration', id, setTaxConfigurations, taxConfigurations);
    const handleSaveTaxConfiguration = (formData) => handleSave('Tax Configuration', formData, setTaxConfigurations, taxConfigurations, setShowTaxConfigurationModal);

    // --- Table Columns Definitions ---
    const loanTypeTableColumns = [
        { header: 'Loan Type Name', accessor: 'name' },
        { header: 'Interest Rate (%)', accessor: 'interestRate' },
        { header: 'Maximum Amount (ETB)', render: (row) => `ETB ${row.maxAmount.toLocaleString()}` },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditLoanType(row)} className="flex items-center gap-1">
                        <Edit size={16} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteLoanType(row.id)} className="flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </Button>
                </div>
            ),
        },
    ];

    const bonusPolicyTableColumns = [
        { header: 'Policy Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'Value', render: (row) => row.type === 'Percentage' ? `${row.value}%` : `ETB ${row.value.toLocaleString()}` },
        { header: 'Criteria', accessor: 'criteria' },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditBonusPolicy(row)} className="flex items-center gap-1">
                        <Edit size={16} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteBonusPolicy(row.id)} className="flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </Button>
                </div>
            ),
        },
    ];

    const overtimeRuleTableColumns = [
        { header: 'Rule Name', accessor: 'name' },
        { header: 'Multiplier', accessor: 'multiplier' },
        { header: 'Applicable Hours', accessor: 'applicableHours' },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditOvertimeRule(row)} className="flex items-center gap-1">
                        <Edit size={16} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteOvertimeRule(row.id)} className="flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </Button>
                </div>
            ),
        },
    ];

    const allowanceTypeTableColumns = [
        { header: 'Allowance Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'Value', render: (row) => row.type === 'Percentage' ? `${row.value}%` : `ETB ${row.value.toLocaleString()}` },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditAllowanceType(row)} className="flex items-center gap-1">
                        <Edit size={16} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteAllowanceType(row.id)} className="flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </Button>
                </div>
            ),
        },
    ];

    const salaryBandTableColumns = [
        { header: 'Band Name', accessor: 'name' },
        { header: 'Grade', accessor: 'grade' },
        { header: 'Min Salary (ETB)', render: (row) => `ETB ${row.minSalary.toLocaleString()}` },
        { header: 'Max Salary (ETB)', render: (row) => `ETB ${row.maxSalary.toLocaleString()}` },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditSalaryBand(row)} className="flex items-center gap-1">
                        <Edit size={16} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteSalaryBand(row.id)} className="flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </Button>
                </div>
            ),
        },
    ];

    const taxConfigurationTableColumns = [
        { header: 'Tax Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'Value/Rate', render: (row) => row.type === 'Percentage' ? `${row.value}%` : 'Defined by Slabs' }, // Slabs would be handled in a more complex modal
        { header: 'Description', accessor: 'description' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditTaxConfiguration(row)} className="flex items-center gap-1">
                        <Edit size={16} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteTaxConfiguration(row.id)} className="flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </Button>
                </div>
            ),
        },
    ];

    // --- Form Fields Definitions ---
    const loanTypeFormFields = [
        { name: 'name', label: 'Loan Type Name', type: 'text', required: true, placeholder: 'e.g., Emergency Loan', icon: BookText },
        { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', required: true, placeholder: 'e.g., 5', icon: Percent },
        { name: 'maxAmount', label: 'Maximum Amount (ETB)', type: 'number', required: true, placeholder: 'e.g., 10000', icon: Banknote },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Briefly describe the loan type.', icon: BookText },
    ];

    const bonusPolicyFormFields = [
        { name: 'name', label: 'Policy Name', type: 'text', required: true, placeholder: 'e.g., Annual Performance Bonus', icon: Gift },
        { name: 'type', label: 'Bonus Type', type: 'select', options: [{ value: 'Percentage', label: 'Percentage' }, { value: 'Fixed Amount', label: 'Fixed Amount' }], required: true, icon: Info },
        { name: 'value', label: 'Value', type: 'number', required: true, placeholder: 'e.g., 10 (for %), or 5000 (for fixed)', icon: DollarSign },
        { name: 'criteria', label: 'Criteria', type: 'textarea', rows: 2, placeholder: 'e.g., Based on individual performance review (1-5 scale)', icon: FileText },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Detailed description of the bonus policy.', icon: BookText },
    ];

    const overtimeRuleFormFields = [
        { name: 'name', label: 'Rule Name', type: 'text', required: true, placeholder: 'e.g., Weekday Overtime', icon: Clock },
        { name: 'multiplier', label: 'Multiplier', type: 'number', step: '0.1', required: true, placeholder: 'e.g., 1.5', icon: Percent },
        { name: 'applicableHours', label: 'Applicable Hours', type: 'text', required: true, placeholder: 'e.g., After 8 hours or All hours', icon: Clock },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Description of the overtime calculation rule.', icon: BookText },
    ];

    const allowanceTypeFormFields = [
        { name: 'name', label: 'Allowance Name', type: 'text', required: true, placeholder: 'e.g., Transport Allowance', icon: PiggyBank },
        { name: 'type', label: 'Allowance Type', type: 'select', options: [{ value: 'Percentage', label: 'Percentage' }, { value: 'Fixed Amount', label: 'Fixed Amount' }], required: true, icon: Info },
        { name: 'value', label: 'Value', type: 'number', required: true, placeholder: 'e.g., 1500 (for fixed), or 10 (for %)', icon: DollarSign },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Description of the allowance type.', icon: BookText },
    ];

    const salaryBandFormFields = [
        { name: 'name', label: 'Band Name', type: 'text', required: true, placeholder: 'e.g., Junior Associate', icon: Scale },
        { name: 'grade', label: 'Grade', type: 'text', required: true, placeholder: 'e.g., A1', icon: Maximize2 },
        { name: 'minSalary', label: 'Minimum Salary (ETB)', type: 'number', required: true, placeholder: 'e.g., 15000', icon: Banknote },
        { name: 'maxSalary', label: 'Maximum Salary (ETB)', type: 'number', required: true, placeholder: 'e.g., 25000', icon: Banknote },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Description of the salary band.', icon: BookText },
    ];

    const taxConfigurationFormFields = [
        { name: 'name', label: 'Tax Name', type: 'text', required: true, placeholder: 'e.g., Income Tax (Ethiopia)', icon: Landmark },
        { name: 'type', label: 'Tax Type', type: 'select', options: [{ value: 'Percentage', label: 'Percentage' }, { value: 'Slab', label: 'Slab' }], required: true, icon: Info },
        { name: 'value', label: 'Value (%)', type: 'number', placeholder: 'e.g., 7 (if percentage type)', icon: Percent, condition: (formData) => formData.type === 'Percentage' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Description of the tax configuration.', icon: BookText },
        // For 'Slab' type, a more complex sub-form or separate modal would be needed for slab details.
    ];


    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                    <Settings className="w-10 h-10 text-purple-600 dark:text-purple-400" /> Compensation Settings
                </h1>
                <Link to="/hr/Payroll"> {/* Link back to a main dashboard or HR settings overview */}
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Payroll
                    </Button>
                </Link>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading compensation settings...</p>
                </div>
            )}

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

            {!loading && (
                <>
                    {/* Loan Types Section */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <CreditCard size={24} className="text-blue-500 dark:text-blue-400" /> Loan Types & Advances
                            </h2>
                            <Button variant="primary" onClick={handleAddLoanType} className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <Plus size={20} /> Add New Loan Type
                            </Button>
                        </div>
                        {loanTypes.length > 0 ? (
                            <Table columns={loanTypeTableColumns} data={loanTypes} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                                No loan types defined yet. Click "Add New Loan Type" to get started.
                            </div>
                        )}
                    </Card>

                    {/* Bonus Policies Section */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <Gift size={24} className="text-red-500 dark:text-red-400" /> Bonus Policies
                            </h2>
                            <Button variant="primary" onClick={handleAddBonusPolicy} className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <Plus size={20} /> Add New Bonus Policy
                            </Button>
                        </div>
                        {bonusPolicies.length > 0 ? (
                            <Table columns={bonusPolicyTableColumns} data={bonusPolicies} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                                No bonus policies defined yet. Click "Add New Bonus Policy" to get started.
                            </div>
                        )}
                    </Card>

                    {/* Overtime Calculation Rules Section */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <Clock size={24} className="text-green-500 dark:text-green-400" /> Overtime Rules
                            </h2>
                            <Button variant="primary" onClick={handleAddOvertimeRule} className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <Plus size={20} /> Add New Overtime Rule
                            </Button>
                        </div>
                        {overtimeRules.length > 0 ? (
                            <Table columns={overtimeRuleTableColumns} data={overtimeRules} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                                No overtime rules defined yet. Click "Add New Overtime Rule" to get started.
                            </div>
                        )}
                    </Card>

                    {/* Allowance Types and Rates Section */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <PiggyBank size={24} className="text-orange-500 dark:text-orange-400" /> Allowance Types & Rates
                            </h2>
                            <Button variant="primary" onClick={handleAddAllowanceType} className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <Plus size={20} /> Add New Allowance Type
                            </Button>
                        </div>
                        {allowanceTypes.length > 0 ? (
                            <Table columns={allowanceTypeTableColumns} data={allowanceTypes} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                                No allowance types defined yet. Click "Add New Allowance Type" to get started.
                            </div>
                        )}
                    </Card>

                    {/* Salary Band Management Section */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <Scale size={24} className="text-teal-500 dark:text-teal-400" /> Salary Band Management
                            </h2>
                            <Button variant="primary" onClick={handleAddSalaryBand} className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <Plus size={20} /> Add New Salary Band
                            </Button>
                        </div>
                        {salaryBands.length > 0 ? (
                            <Table columns={salaryBandTableColumns} data={salaryBands} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                                No salary bands defined yet. Click "Add New Salary Band" to get started.
                            </div>
                        )}
                    </Card>

                    {/* Tax Configuration Settings Section */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <Landmark size={24} className="text-indigo-500 dark:text-indigo-400" /> Tax Configuration Settings
                            </h2>
                            <Button variant="primary" onClick={handleAddTaxConfiguration} className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <Plus size={20} /> Add New Tax Configuration
                            </Button>
                        </div>
                        {taxConfigurations.length > 0 ? (
                            <Table columns={taxConfigurationTableColumns} data={taxConfigurations} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                                No tax configurations defined yet. Click "Add New Tax Configuration" to get started.
                            </div>
                        )}
                    </Card>
                </>
            )}

            {/* Modals for each section */}
            <ModalWithForm
                isOpen={showLoanTypeModal}
                onClose={() => setShowLoanTypeModal(false)}
                onSubmit={handleSaveLoanType}
                title={currentLoanType ? 'Edit Loan Type' : 'Add New Loan Type'}
                fields={loanTypeFormFields}
                formData={currentLoanType || {}}
            />
            <ModalWithForm
                isOpen={showBonusPolicyModal}
                onClose={() => setShowBonusPolicyModal(false)}
                onSubmit={handleSaveBonusPolicy}
                title={currentBonusPolicy ? 'Edit Bonus Policy' : 'Add New Bonus Policy'}
                fields={bonusPolicyFormFields}
                formData={currentBonusPolicy || {}}
            />
            <ModalWithForm
                isOpen={showOvertimeRuleModal}
                onClose={() => setShowOvertimeRuleModal(false)}
                onSubmit={handleSaveOvertimeRule}
                title={currentOvertimeRule ? 'Edit Overtime Rule' : 'Add New Overtime Rule'}
                fields={overtimeRuleFormFields}
                formData={currentOvertimeRule || {}}
            />
            <ModalWithForm
                isOpen={showAllowanceTypeModal}
                onClose={() => setShowAllowanceTypeModal(false)}
                onSubmit={handleSaveAllowanceType}
                title={currentAllowanceType ? 'Edit Allowance Type' : 'Add New Allowance Type'}
                fields={allowanceTypeFormFields}
                formData={currentAllowanceType || {}}
            />
            <ModalWithForm
                isOpen={showSalaryBandModal}
                onClose={() => setShowSalaryBandModal(false)}
                onSubmit={handleSaveSalaryBand}
                title={currentSalaryBand ? 'Edit Salary Band' : 'Add New Salary Band'}
                fields={salaryBandFormFields}
                formData={currentSalaryBand || {}}
            />
            <ModalWithForm
                isOpen={showTaxConfigurationModal}
                onClose={() => setShowTaxConfigurationModal(false)}
                onSubmit={handleSaveTaxConfiguration}
                title={currentTaxConfiguration ? 'Edit Tax Configuration' : 'Add New Tax Configuration'}
                fields={taxConfigurationFormFields}
                formData={currentTaxConfiguration || {}}
            />
        </div>
    );
};

export default CompensationSettingsPage;
