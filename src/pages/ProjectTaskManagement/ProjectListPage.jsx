import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Table from '../../components/ui/Table'; // Reusable Table component
import ModalWithForm from '../../components/ui/modal'; // Reusable ModalWithForm component

// Lucide React Icons
import {
    ClipboardList, Plus, Edit, Eye, Search, Filter, CheckCircle, User, ListChecks, Trash2 ,
    AlertCircle, Users, Calendar, DollarSign, Briefcase, Building2, TrendingUp, Clock,
    ArrowLeft // Added ArrowLeft for back to dashboard link
} from 'lucide-react';

const ProjectListPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'Active', 'Completed', 'On Hold', 'Canceled'
    const [filterManager, setFilterManager] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');

    const [projects, setProjects] = useState([]);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [currentProject, setCurrentProject] = useState(null); // For editing/viewing project details
    const [modalMode, setModalMode] = useState('add'); // 'add', 'view', 'edit'

    // --- Inline Mock Data ---
    const mockProjects = [
        {
            id: 'proj-001', name: 'Website Redesign', type: 'Client Job', customer: 'ABC Corp', description: 'Complete overhaul of the company website.',
            startDate: '2025-01-10', endDate: '2025-08-30', status: 'Active',
            manager: { id: 'mgr-001', name: 'John Smith' },
            department: 'Marketing', budget: 150000,
            teamMembers: [{ id: 'emp-001', name: 'Aisha Demisse' }, { id: 'emp-002', name: 'Tesfaye Gebre' }],
            progress: 75
        },
        {
            id: 'proj-002', name: 'New HR System Implementation', type: 'Internal', customer: 'Internal', description: 'Deploying a new HRIS platform.',
            startDate: '2024-11-01', endDate: '2025-07-15', status: 'Completed',
            manager: { id: 'mgr-002', name: 'Jane Doe' },
            department: 'HR', budget: 200000,
            teamMembers: [{ id: 'emp-001', name: 'Aisha Demisse' }, { id: 'emp-003', name: 'Sara Ali' }],
            progress: 100
        },
        {
            id: 'proj-003', name: 'Mobile App Development', type: 'Client Job', customer: 'XYZ Ltd', description: 'Building a customer-facing mobile application.',
            startDate: '2025-03-01', endDate: '2025-12-31', status: 'Active',
            manager: { id: 'mgr-001', name: 'John Smith' },
            department: 'IT', budget: 300000,
            teamMembers: [{ id: 'emp-002', name: 'Tesfaye Gebre' }, { id: 'emp-004', name: 'Kebede Worku' }],
            progress: 40
        },
        {
            id: 'proj-004', name: 'Annual Financial Audit', type: 'Internal', customer: 'Internal', description: 'External audit of company financials.',
            startDate: '2025-02-01', endDate: '2025-04-30', status: 'Completed',
            manager: { id: 'mgr-003', name: 'Michael Brown' },
            department: 'Finance', budget: 80000,
            teamMembers: [{ id: 'emp-004', name: 'Kebede Worku' }],
            progress: 100
        },
        {
            id: 'proj-005', name: 'Office Expansion Project', type: 'Internal', customer: 'Internal', description: 'Renovation and expansion of office space.',
            startDate: '2025-06-01', endDate: '2026-01-31', status: 'On Hold',
            manager: { id: 'mgr-002', name: 'Jane Doe' },
            department: 'Operations', budget: 500000,
            teamMembers: [{ id: 'emp-003', name: 'Sara Ali' }],
            progress: 10
        },
    ];

    const mockManagers = [
        { value: 'all', label: 'All Managers' },
        { value: 'mgr-001', label: 'John Smith' },
        { value: 'mgr-002', label: 'Jane Doe' },
        { value: 'mgr-003', label: 'Michael Brown' },
    ];

    const mockDepartments = [
        { value: 'all', label: 'All Departments' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'IT', label: 'Information Technology' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Operations', label: 'Operations' },
    ];

    const projectStatuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Active', label: 'Active' },
        { value: 'Completed', label: 'Completed' },
        { value: 'On Hold', label: 'On Hold' },
        { value: 'Canceled', label: 'Canceled' },
    ];

    const projectTypes = [
        { value: 'Client Job', label: 'Client Job' },
        { value: 'Internal', label: 'Internal' },
    ];
    // --- End Inline Mock Data ---

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            setProjects(mockProjects);
            setLoading(false);
        }, 700);
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearchTerm = searchTerm.trim() === '' ||
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.manager.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
            const matchesManager = filterManager === 'all' || project.manager.id === filterManager;
            const matchesDepartment = filterDepartment === 'all' || project.department === filterDepartment;

            return matchesSearchTerm && matchesStatus && matchesManager && matchesDepartment;
        }).sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Sort by start date descending
    }, [projects, searchTerm, filterStatus, filterManager, filterDepartment]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Active': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'On Hold': return 'bg-yellow-100 text-yellow-800';
            case 'Canceled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAddProject = () => {
        setCurrentProject(null);
        setModalMode('add');
        setShowProjectModal(true);
    };

    const handleViewProject = (project) => {
        setCurrentProject(project);
        setModalMode('view');
        setShowProjectModal(true);
    };

    const handleEditProject = (project) => {
        setCurrentProject(project);
        setModalMode('edit');
        setShowProjectModal(true);
    };

    const handleDeleteProject = (id) => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            setLoading(true);
            setError(null);
            setTimeout(() => {
                setProjects(prev => prev.filter(proj => proj.id !== id));
                alert('Project deleted successfully.');
                setLoading(false);
            }, 500);
        }
    };

    const handleSaveProject = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

            const selectedManager = mockManagers.find(mgr => mgr.value === formData.managerId) || { id: formData.managerId, name: 'Unknown Manager' };

            const projectData = {
                ...formData,
                manager: { id: selectedManager.value, name: selectedManager.label },
                budget: Number(formData.budget),
                progress: Number(formData.progress),
                // For simplicity, teamMembers are not managed in this modal,
                // but would be in a more complex ProjectFormPage.
                teamMembers: currentProject ? currentProject.teamMembers : [],
            };

            if (modalMode === 'edit' && currentProject) {
                setProjects(prev => prev.map(proj => proj.id === currentProject.id ? { ...proj, ...projectData, id: currentProject.id } : proj));
                alert('Project updated successfully!');
            } else {
                setProjects(prev => [...prev, { ...projectData, id: `proj-${Date.now()}` }]);
                alert('New project added successfully!');
            }
            setShowProjectModal(false);
        } catch (err) {
            setError(`Failed to save project. ${err.message || ''}`);
            console.error('Save project error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fields for the Project Add/Edit/View Modal
    const projectFormFields = useMemo(() => {
        const fields = [
            { name: 'name', label: 'Project Name', type: 'text', required: true, placeholder: 'e.g., Website Redesign', icon: ClipboardList, readOnly: modalMode === 'view' },
            { name: 'type', label: 'Project Type', type: 'select', options: projectTypes, required: true, icon: Briefcase, readOnly: modalMode === 'view' },
            { name: 'customer', label: 'Customer', type: 'text', placeholder: 'e.g., ABC Corp', icon: Users, readOnly: modalMode === 'view' },
            { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Brief description of the project.', icon: Briefcase, readOnly: modalMode === 'view' },
            { name: 'startDate', label: 'Start Date', type: 'date', required: true, icon: Calendar, readOnly: modalMode === 'view' },
            { name: 'endDate', label: 'End Date', type: 'date', required: true, icon: Calendar, readOnly: modalMode === 'view' },
            {
                name: 'status', label: 'Status', type: 'select',
                options: projectStatuses.filter(s => s.value !== 'all'),
                required: true, icon: CheckCircle, readOnly: modalMode === 'view'
            },
            {
                name: 'managerId', label: 'Project Manager', type: 'select',
                options: mockManagers.filter(m => m.value !== 'all'),
                required: true, placeholder: 'Select Manager', icon: User, readOnly: modalMode === 'view'
            },
            {
                name: 'department', label: 'Department', type: 'select',
                options: mockDepartments.filter(d => d.value !== 'all'),
                required: true, placeholder: 'Select Department', icon: Building2, readOnly: modalMode === 'view'
            },
            { name: 'budget', label: 'Budget (ETB)', type: 'number', placeholder: 'e.g., 150000', icon: DollarSign, readOnly: modalMode === 'view' },
            { name: 'progress', label: 'Progress (%)', type: 'number', placeholder: '0-100', icon: TrendingUp, readOnly: modalMode === 'view' },
        ];

        // Add display-only fields for view mode that are not directly editable form fields
        if (modalMode === 'view') {
            fields.unshift(
                { name: 'managerNameDisplay', label: 'Manager Name', type: 'text', readOnly: true, icon: User },
            );
        }

        return fields;
    }, [modalMode]);

    const projectModalFormData = useMemo(() => {
        if (!currentProject) {
            return {
                name: '', type: '', customer: '', description: '', startDate: new Date().toISOString().slice(0, 10), endDate: '',
                status: 'Active', managerId: '', department: '', budget: '', progress: 0
            };
        }
        return {
            ...currentProject,
            managerId: currentProject.manager.id,
            managerNameDisplay: currentProject.manager.name,
        };
    }, [currentProject]);


    const projectTableColumns = [
        { header: 'Project ID', accessor: 'id' },
        { header: 'Title/Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'Customer', accessor: 'customer' },
        { header: 'Manager', accessor: 'manager.name' },
        { header: 'Department', accessor: 'department' },
        { header: 'Start Date', accessor: 'startDate' },
        { header: 'End Date', accessor: 'endDate' },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(row.status)}`}>
                    {row.status}
                </span>
            ),
        },
        {
            header: 'Progress',
            render: (row) => (
                <div className="w-24 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${row.progress}%` }}></div>
                    <span className="text-xs text-gray-700 ml-2">{row.progress}%</span>
                </div>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewProject(row)} className="flex items-center gap-1">
                        <Eye size={16} /> View
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleEditProject(row)} className="flex items-center gap-1">
                        <Edit size={16} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteProject(row.id)} className="flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </Button>
                    <Link to={`/projects/${row.id}/details`}> {/* Link to ProjectDetailsPage */}
                        <Button variant="info" size="sm" className="flex items-center gap-1">
                            <ListChecks size={16} /> Tasks
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    // Calculate summary totals
    const summaryTotals = useMemo(() => {
        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => p.status === 'Active').length;
        const completedProjects = projects.filter(p => p.status === 'Completed').length;
        const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

        return { totalProjects, activeProjects, completedProjects, totalBudget };
    }, [projects]);

    return (
        <div className="w-full p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <ClipboardList className="w-10 h-10 text-blue-600" /> Project List
                </h1>
                <div className="flex gap-4">
                    <Link to={'/projects/new'}>
                    <Button variant="primary"  className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <Plus size={20} /> Create New Project
                    </Button>
                    </Link>

                </div>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading projects...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <>
                    {/* Project Summary Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                            <ClipboardList size={36} className="text-indigo-500 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700">Total Projects</h3>
                            <p className="text-4xl font-bold text-gray-900 mt-2">{summaryTotals.totalProjects}</p>
                        </Card>
                        <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                            <Clock size={36} className="text-blue-500 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700">Active Projects</h3>
                            <p className="text-4xl font-bold text-gray-900 mt-2">{summaryTotals.activeProjects}</p>
                        </Card>
                        <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                            <CheckCircle size={36} className="text-green-500 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700">Completed Projects</h3>
                            <p className="text-4xl font-bold text-gray-900 mt-2">{summaryTotals.completedProjects}</p>
                        </Card>
                        <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                            <DollarSign size={36} className="text-purple-500 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700">Total Budget</h3>
                            <p className="text-4xl font-bold text-gray-900 mt-2">ETB {summaryTotals.totalBudget.toLocaleString()}</p>
                        </Card>
                    </div>

                    {/* Filter and Search Section */}
                    <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Input
                                label="Search Projects"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, customer, manager..."
                                icon={<Search size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Status"
                                name="filterStatus"
                                options={projectStatuses}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                icon={<Filter size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Manager"
                                name="filterManager"
                                options={mockManagers}
                                value={filterManager}
                                onChange={(e) => setFilterManager(e.target.value)}
                                icon={<User size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Department"
                                name="filterDepartment"
                                options={mockDepartments}
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                                icon={<Building2 size={18} className="text-gray-400" />}
                            />
                        </div>
                    </Card>

                    {/* Project List Table */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <ListChecks size={24} className="text-blue-500" /> All Projects
                        </h2>
                        {filteredProjects.length > 0 ? (
                            <Table columns={projectTableColumns} data={filteredProjects} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-lg">
                                No projects found matching your criteria.
                            </div>
                        )}
                    </Card>
                </>
            )}

            {/* Project Add/Edit/View Modal */}
            <ModalWithForm
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                onSubmit={handleSaveProject}
                title={
                    modalMode === 'add' ? 'Create New Project' :
                    modalMode === 'edit' ? 'Edit Project Details' :
                    'Project Details'
                }
                fields={projectFormFields}
                formData={projectModalFormData}
            />
        </div>
    );
};

export default ProjectListPage;
