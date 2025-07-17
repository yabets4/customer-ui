import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  FileText, Filter, Calendar, Tag, Package, Box, RefreshCcw,
  ArrowDownCircle, ArrowUpCircle, ChevronsRightLeft, PlusCircle, MinusCircle, User, MapPin,
  Paperclip // For export
} from 'lucide-react';

// --- Mock Data for Raw Materials (Same as in other pages) ---
// This array represents your "in-memory database" for raw materials.
const mockRawMaterials = [
  {
    id: 'RM001',
    name: 'Oak Wood Planks',
    description: 'High-quality oak wood for furniture manufacturing, ideal for durable and aesthetic designs. Kiln-dried to prevent warping.',
    category: 'Wood',
    uom: 'Cubic Feet',
    supplierLinkage: 'Lumber & Timber Co.',
    costPrice: 50.00,
    currentStock: 150,
    minStockLevel: 50,
    shelfLife: '2026-12-31',
    specifications: 'Grade A, kiln-dried, moisture content 8-10%, dimensions: 1"x6"x8\'',
    imageUrl: '/images/oak-wood.jpg',
    location: 'Warehouse A, Shelf 10'
  },
  {
    id: 'RM002',
    name: 'Velvet Fabric (Blue)',
    description: 'Luxurious blue velvet fabric, perfect for upholstery, curtains, and decorative accents. Soft to touch and rich in color.',
    category: 'Fabric',
    uom: 'Meters',
    supplierLinkage: 'Textile Innovations Ltd.',
    costPrice: 15.75,
    currentStock: 300,
    minStockLevel: 100,
    shelfLife: 'N/A',
    specifications: 'Polyester blend, 150 GSM, 140cm width, color: Royal Blue #00008B',
    imageUrl: '/images/blue-velvet.jpg',
    location: 'Warehouse B, Rack 3'
  },
  {
    id: 'RM003',
    name: 'Strong Adhesive (Type A)',
    description: 'Industrial-grade wood adhesive for strong and lasting bonds. Suitable for various wood types and applications.',
    category: 'Adhesive',
    uom: 'Litres',
    supplierLinkage: 'Chemical Solutions Inc.',
    costPrice: 25.00,
    currentStock: 75,
    minStockLevel: 20,
    shelfLife: '2025-09-15',
    specifications: 'Waterproof, fast-drying (30 min set), temperature range -20°C to 80°C',
    imageUrl: '/images/adhesive.jpg',
    location: 'Workshop Store, Bin 5'
  },
  {
    id: 'RM004',
    name: 'Steel Rods (10mm)',
    description: 'High-tensile carbon steel rods for structural reinforcement and fabrication. Essential for durable frames.',
    category: 'Metal',
    uom: 'Meters',
    supplierLinkage: 'MetalWorks Supply',
    costPrice: 8.50,
    currentStock: 500,
    minStockLevel: 150,
    shelfLife: 'N/A',
    specifications: 'ASTM A36, 6m length, 10mm diameter, smooth finish',
    imageUrl: '/images/steel-rods.jpg',
    location: 'Warehouse A, Section C'
  },
  {
    id: 'RM005',
    name: 'Leather Hides (Brown)',
    description: 'Premium full-grain brown leather hides, ideal for high-end furniture and accessories. Ethically sourced.',
    category: 'Leather',
    uom: 'Sq. Feet',
    supplierLinkage: 'Global Leather Co.',
    costPrice: 120.00,
    currentStock: 80,
    minStockLevel: 30,
    shelfLife: 'N/A',
    specifications: 'Full-grain, vegetable-tanned, average 50 sq. ft. per hide, thickness 1.8-2.2mm',
    imageUrl: '/images/leather-hides.jpg',
    location: 'Showroom Backstore'
  },
];

// --- Mock Data for Movement History (Same as in other pages) ---
let mockRawMaterialMovements = [
    {
        id: 'MOV001',
        rawMaterialId: 'RM001',
        movementType: 'Inbound',
        quantity: 50,
        uom: 'Cubic Feet',
        movementDate: '2024-06-01',
        sourceDocument: 'PO-2024-001',
        supplier: 'Lumber & Timber Co.',
        notes: 'Initial receipt from latest purchase order.',
        fromLocation: null,
        toLocation: 'Warehouse A, Shelf 10',
        adjustmentReason: null,
        adjustmentType: null,
        departmentOrProject: null,
        responsiblePerson: 'John Doe'
    },
    {
        id: 'MOV002',
        rawMaterialId: 'RM002',
        movementType: 'Outbound',
        quantity: 20,
        uom: 'Meters',
        movementDate: '2024-06-05',
        destinationDocument: 'PROD-2024-010',
        departmentOrProject: 'Furniture Assembly Line A',
        notes: 'Issued for sofa production batch #1.',
        fromLocation: 'Warehouse B, Rack 3',
        toLocation: null,
        sourceDocument: null,
        supplier: null,
        adjustmentReason: null,
        adjustmentType: null,
        responsiblePerson: 'Jane Smith'
    },
    {
        id: 'MOV003',
        rawMaterialId: 'RM001',
        movementType: 'Outbound',
        quantity: 10,
        uom: 'Cubic Feet',
        movementDate: '2024-06-10',
        destinationDocument: 'PROD-2024-015',
        departmentOrProject: 'Furniture Assembly Line B',
        notes: 'Used for custom table order.',
        fromLocation: 'Warehouse A, Shelf 10',
        toLocation: null,
        sourceDocument: null,
        supplier: null,
        adjustmentReason: null,
        adjustmentType: null,
        responsiblePerson: 'Mark Johnson'
    },
    {
        id: 'MOV004',
        rawMaterialId: 'RM003',
        movementType: 'Adjustment',
        quantity: 5,
        uom: 'Litres',
        movementDate: '2024-06-12',
        adjustmentType: 'Decrease',
        adjustmentReason: 'Damage',
        notes: '5 litres found leaked from container.',
        fromLocation: 'Workshop Store, Bin 5', // Added for adjustment clarity
        toLocation: 'Workshop Store, Bin 5', // Added for adjustment clarity
        sourceDocument: null, supplier: null, destinationDocument: null, departmentOrProject: null,
        responsiblePerson: 'Emily White'
    },
    {
      id: 'MOV005',
      rawMaterialId: 'RM005',
      movementType: 'Inbound',
      quantity: 10,
      uom: 'Sq. Feet',
      movementDate: '2024-07-01',
      sourceDocument: 'PO-2024-010',
      supplier: 'Global Leather Co.',
      notes: 'New shipment of brown leather.',
      fromLocation: null,
      toLocation: 'Showroom Backstore',
      adjustmentReason: null,
      adjustmentType: null,
      departmentOrProject: null,
      responsiblePerson: 'Chris Green'
  }
];


const RawMaterialReportsPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' });

  const [reportType, setReportType] = useState('stockSummary'); // Default report
  const [filters, setFilters] = useState({
    rawMaterialId: '',
    category: '',
    startDate: '',
    endDate: '',
    movementType: '' // Specific to Movement History report
  });
  const [reportData, setReportData] = useState([]); // Data to display in the table

  // Options for filters
  const reportTypeOptions = [
    { value: 'stockSummary', label: 'Stock Summary Report', icon: <Package className="w-4 h-4" /> },
    { value: 'movementHistory', label: 'Movement History Report', icon: <RefreshCcw className="w-4 h-4" /> },
    { value: 'lowStockAlerts', label: 'Low Stock Alerts', icon: <Box className="w-4 h-4" /> },
  ];

  const rawMaterialOptions = [{ value: '', label: 'All Raw Materials' }, ...mockRawMaterials.map(rm => ({
    value: rm.id,
    label: `${rm.name} (${rm.id})`
  }))];

  const categoryOptions = [{ value: '', label: 'All Categories' }, ...[...new Set(mockRawMaterials.map(rm => rm.category))].map(cat => ({
    value: cat,
    label: cat
  }))];

  const movementTypeOptions = [{ value: '', label: 'All Movement Types' }, ...[
      { value: 'Inbound', label: 'Inbound' },
      { value: 'Outbound', label: 'Outbound' },
      { value: 'Transfer', label: 'Transfer' },
      { value: 'Adjustment', label: 'Adjustment' }
  ]];

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Generate Report based on filters and report type
  const generateReport = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let data = [];

    switch (reportType) {
      case 'stockSummary':
        data = mockRawMaterials.filter(rm => {
          const matchesMaterial = filters.rawMaterialId ? rm.id === filters.rawMaterialId : true;
          const matchesCategory = filters.category ? rm.category === filters.category : true;
          return matchesMaterial && matchesCategory;
        }).map(rm => ({
          ...rm,
          status: rm.currentStock <= rm.minStockLevel ? 'Low Stock' : 'Sufficient'
        }));
        break;

      case 'movementHistory':
        data = mockRawMaterialMovements.filter(mov => {
          const matchesMaterial = filters.rawMaterialId ? mov.rawMaterialId === filters.rawMaterialId : true;
          const matchesMovementType = filters.movementType ? mov.movementType === filters.movementType : true;

          // Date range filtering
          const movementDate = new Date(mov.movementDate);
          const startDate = filters.startDate ? new Date(filters.startDate) : null;
          const endDate = filters.endDate ? new Date(filters.endDate) : null;

          const matchesDateRange = (!startDate || movementDate >= startDate) && (!endDate || movementDate <= endDate);

          return matchesMaterial && matchesMovementType && matchesDateRange;
        }).map(mov => ({
          ...mov,
          rawMaterialName: mockRawMaterials.find(rm => rm.id === mov.rawMaterialId)?.name || 'N/A'
        }));
        // Sort movements by date descending
        data.sort((a, b) => new Date(b.movementDate) - new Date(a.movementDate));
        break;

      case 'lowStockAlerts':
        data = mockRawMaterials.filter(rm => rm.currentStock <= rm.minStockLevel && rm.minStockLevel > 0)
          .map(rm => ({
            id: rm.id,
            name: rm.name,
            category: rm.category,
            currentStock: rm.currentStock,
            minStockLevel: rm.minStockLevel,
            uom: rm.uom,
            difference: rm.currentStock - rm.minStockLevel,
            status: 'Low Stock'
          }));
        break;

      default:
        data = [];
    }

    setReportData(data);
    setLoading(false);
  };

  // Run report on initial load and when report type or filters change
  useEffect(() => {
    generateReport();
  }, [reportType, filters]); // Depend on reportType and filters

  const handleExportCsv = () => {
    if (reportData.length === 0) {
      setModalContent({ title: 'Export Error', message: 'No data to export.', type: 'error' });
      setModalOpen(true);
      return;
    }

    let csvContent = "";
    let headers = [];

    // Define headers based on report type
    if (reportType === 'stockSummary') {
      headers = ['ID', 'Name', 'Category', 'UoM', 'Current Stock', 'Min Stock Level', 'Cost Price', 'Location', 'Status'];
      csvContent = headers.join(',') + '\n' +
        reportData.map(row =>
          `${row.id},"${row.name}","${row.category}","${row.uom}",${row.currentStock},${row.minStockLevel},${row.costPrice},"${row.location}","${row.status}"`
        ).join('\n');
    } else if (reportType === 'movementHistory') {
      headers = ['Movement ID', 'Raw Material ID', 'Raw Material Name', 'Type', 'Quantity', 'UoM', 'Date', 'Source Doc', 'Destination Doc', 'From Location', 'To Location', 'Responsible Person', 'Notes'];
      csvContent = headers.join(',') + '\n' +
        reportData.map(row =>
          `${row.id},${row.rawMaterialId},"${row.rawMaterialName}","${row.movementType}",${row.quantity},"${row.uom}","${row.movementDate}",` +
          `"${row.sourceDocument || ''}","${row.destinationDocument || ''}","${row.fromLocation || ''}","${row.toLocation || ''}","${row.responsiblePerson}","${row.notes || ''}"`
        ).join('\n');
    } else if (reportType === 'lowStockAlerts') {
      headers = ['ID', 'Name', 'Category', 'Current Stock', 'Min Stock Level', 'UoM', 'Difference', 'Status'];
      csvContent = headers.join(',') + '\n' +
        reportData.map(row =>
          `${row.id},"${row.name}","${row.category}",${row.currentStock},${row.minStockLevel},"${row.uom}",${row.difference},"${row.status}"`
        ).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    setModalContent({ title: 'Export Successful', message: 'Report exported as CSV.', type: 'success' });
    setModalOpen(true);
  };


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        <FileText className="inline-block w-8 h-8 mr-2 text-blue-600" /> Raw Material Reports
      </h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Report Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Report Type Selector */}
          <div>
            <Select
              label="Select Report Type"
              id="reportType"
              name="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={reportTypeOptions}
              placeholder="Choose a report"
              icon={<FileText className="w-5 h-5" />}
              required
            />
          </div>

          {/* Filters specific to selected report type */}
          {reportType !== 'lowStockAlerts' && (
            <div>
              <Select
                label="Raw Material"
                id="rawMaterialId"
                name="rawMaterialId"
                value={filters.rawMaterialId}
                onChange={handleFilterChange}
                options={rawMaterialOptions}
                placeholder="All Raw Materials"
                icon={<Tag className="w-5 h-5" />}
              />
            </div>
          )}

          {reportType === 'stockSummary' && (
            <div>
              <Select
                label="Category"
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                options={categoryOptions}
                placeholder="All Categories"
                icon={<Filter className="w-5 h-5" />}
              />
            </div>
          )}

          {reportType === 'movementHistory' && (
            <>
              <div>
                <Select
                  label="Movement Type"
                  id="movementType"
                  name="movementType"
                  value={filters.movementType}
                  onChange={handleFilterChange}
                  options={movementTypeOptions}
                  placeholder="All Movement Types"
                  icon={<RefreshCcw className="w-5 h-5" />}
                />
              </div>
              <div>
                <Input
                  label="Start Date"
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  icon={<Calendar className="w-5 h-5" />}
                />
              </div>
              <div>
                <Input
                  label="End Date"
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  icon={<Calendar className="w-5 h-5" />}
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" onClick={generateReport} variant="primary">
            <Filter className="w-5 h-5 mr-2" /> Generate Report
          </Button>
          <Button type="button" onClick={handleExportCsv} variant="secondary">
            <Paperclip className="w-5 h-5 mr-2" /> Export to CSV
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Report Results</h2>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <LoadingSpinner />
          </div>
        ) : reportData.length === 0 ? (
          <p className="text-center text-gray-500">No data available for the selected filters and report type.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                {/* Table Headers based on Report Type */}
                <tr>
                  {reportType === 'stockSummary' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UoM</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                  )}
                  {reportType === 'movementHistory' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movement ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raw Material</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UoM</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From/To Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsible Person</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    </>
                  )}
                  {reportType === 'lowStockAlerts' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UoM</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {/* Table Rows based on Report Type */}
                {reportData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {reportType === 'stockSummary' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{row.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.currentStock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.minStockLevel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.uom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.costPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            row.status === 'Low Stock' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </>
                    )}
                    {reportType === 'movementHistory' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{row.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.rawMaterialName} ({row.rawMaterialId})</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <div className="flex items-center">
                            {row.movementType === 'Inbound' && <ArrowDownCircle className="w-4 h-4 mr-1 text-green-500" />}
                            {row.movementType === 'Outbound' && <ArrowUpCircle className="w-4 h-4 mr-1 text-red-500" />}
                            {row.movementType === 'Transfer' && <ChevronsRightLeft className="w-4 h-4 mr-1 text-blue-500" />}
                            {row.movementType === 'Adjustment' && <RefreshCcw className="w-4 h-4 mr-1 text-yellow-500" />}
                            {row.movementType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.uom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.movementDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {row.fromLocation && row.toLocation && row.movementType === 'Transfer' ? `${row.fromLocation} -> ${row.toLocation}` :
                           row.fromLocation && row.movementType === 'Outbound' ? `From: ${row.fromLocation}` :
                           row.toLocation && row.movementType === 'Inbound' ? `To: ${row.toLocation}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.responsiblePerson}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">{row.notes || 'N/A'}</td>
                      </>
                    )}
                    {reportType === 'lowStockAlerts' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{row.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.currentStock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.minStockLevel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 dark:text-red-300 font-semibold">{row.difference}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{row.uom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`}>
                            {row.status}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal for messages */}
      <ModalWithForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        className={`${modalContent.type === 'success' ? 'border-green-500' : 'border-red-500'}`}
      >
        <p className="text-center text-lg">{modalContent.message}</p>
        <div className="flex justify-center mt-4">
          <Button onClick={() => setModalOpen(false)} variant={modalContent.type === 'success' ? 'primary' : 'danger'}>
            Close
          </Button>
        </div>
      </ModalWithForm>
    </div>
  );
};

export default RawMaterialReportsPage;