import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  ArrowLeft, Edit, Wrench, Factory, MapPin, Calendar, CheckCircle, XCircle, Tag, DollarSign,
  Clipboard, Hash, User, Settings, Clock, Info, Image as ImageIcon
} from 'lucide-react';


const mockToolsMachinery = [
  {
    id: 'TLM001',
    assetId: 'MAC-CNC-001',
    name: 'CNC Milling Machine (XYZ-Pro)',
    type: 'Machining',
    serialNumber: 'XYZPRO2023001',
    manufacturer: 'XYZ Corp',
    modelNumber: 'ProMill 500',
    purchaseDate: '2022-01-15',
    cost: 75000.00,
    status: 'Operational', 
    location: 'Workshop A, Zone 1',
    lastMaintenanceDate: '2024-12-01',
    nextMaintenanceDate: '2025-06-01', // Example: Past due
    assignedTo: 'Production Dept.',
    notes: 'High-precision 5-axis milling. Critical asset.',
    imageUrl: 'data:image/jpeg;base64,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'
  },
  {
    id: 'TLM002',
    assetId: 'TOOL-DRL-005',
    name: 'Heavy Duty Drill Press',
    type: 'Hand Tool/Power Tool',
    serialNumber: 'DRLPRS2021005',
    manufacturer: 'PowerTools Inc.',
    modelNumber: 'HD-200',
    purchaseDate: '2021-03-20',
    cost: 1500.00,
    status: 'Operational',
    location: 'Workshop B, Tool Rack 3',
    lastMaintenanceDate: '2025-02-10',
    nextMaintenanceDate: '2025-08-10',
    assignedTo: 'Assembly Line 1',
    notes: 'Used for large bore drilling.',
    imageUrl: '/images/drill-press.jpg'
  },
  {
    id: 'TLM003',
    assetId: 'TEST-QAL-003',
    name: 'Universal Testing Machine',
    type: 'Testing Equipment',
    serialNumber: 'UTM-ALPHA-003',
    manufacturer: 'QualityCheck Systems',
    modelNumber: 'Alpha-9000',
    purchaseDate: '2023-07-01',
    cost: 30000.00,
    status: 'Under Maintenance',
    location: 'Quality Control Lab',
    lastMaintenanceDate: '2025-06-10',
    nextMaintenanceDate: '2025-12-10',
    assignedTo: 'QA Dept.',
    notes: 'Currently undergoing calibration.',
    imageUrl: '/images/testing-machine.jpg'
  },
  {
    id: 'TLM004',
    assetId: 'LIFT-FORK-001',
    name: 'Electric Forklift (Warehouse)',
    type: 'Material Handling',
    serialNumber: 'FLK-ELC-001',
    manufacturer: 'LiftMaster',
    modelNumber: 'E-5000',
    purchaseDate: '2020-09-01',
    cost: 25000.00,
    status: 'Operational',
    location: 'Main Warehouse',
    lastMaintenanceDate: '2025-04-01',
    nextMaintenanceDate: '2025-10-01',
    assignedTo: 'Logistics Dept.',
    notes: 'Used for moving heavy pallets.',
    imageUrl: '/images/forklift.jpg'
  },
  {
    id: 'TLM005',
    assetId: 'TOOL-WLD-002',
    name: 'MIG Welder (Portable)',
    type: 'Welding Equipment',
    serialNumber: 'MIG-PORT-002',
    manufacturer: 'WeldTech',
    modelNumber: 'ProMIG 180',
    purchaseDate: '2024-02-01',
    cost: 1800.00,
    status: 'Operational',
    location: 'Workshop C, Welding Bay',
    lastMaintenanceDate: null, // No previous maintenance
    nextMaintenanceDate: '2025-11-01',
    assignedTo: 'Fabrication Team',
    notes: 'Recently acquired for new project.',
    imageUrl: '/images/welder.jpg'
  },
];

const ToolMachineDetailsPage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();

  const [toolMachine, setToolMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' });

  useEffect(() => {
    const fetchToolMachineDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay for fetching data
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundToolMachine = mockToolsMachinery.find(tm => tm.id === id);

        if (foundToolMachine) {
          setToolMachine(foundToolMachine);
        } else {
          setError('Tool or Machine not found.');
          setModalContent({ title: 'Error', message: `Tool or Machine with ID "${id}" not found.`, type: 'error' });
          setModalOpen(true);
        }
      } catch (err) {
        setError('Failed to load tool or machine details.');
        setModalContent({ title: 'Error', message: 'Failed to load tool or machine details. Please try again.', type: 'error' });
        setModalOpen(true);
        console.error('Error fetching tool/machine details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchToolMachineDetails();
  }, [id]); // Re-run effect if ID changes

  // Helper to determine status styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'Operational': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'Out of Service': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  // Helper to check if next maintenance is overdue
  const isMaintenanceOverdue = (nextMaintenanceDate) => {
    if (!nextMaintenanceDate) return false;
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize to start of day
    const maintenanceDate = new Date(nextMaintenanceDate);
    maintenanceDate.setHours(0,0,0,0); // Normalize to start of day
    return maintenanceDate < today;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !toolMachine) { // Show error if no data was loaded
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="p-6">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
          <Button onClick={() => navigate('/inventory/tools-machinery')} variant="secondary">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
          </Button>
        </Card>
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
  }

  if (!toolMachine) {
    return null; // Or a very light spinner/placeholder if not caught by error state
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        <Wrench className="inline-block w-8 h-8 mr-2 text-blue-600" /> Tool/Machine Details: {toolMachine.name}
      </h1>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Image and General Info */}
          <div className="flex flex-col items-center">
            {toolMachine.imageUrl && (
              <img
                src={toolMachine.imageUrl}
                alt={toolMachine.name}
                className="w-full max-w-sm h-64 object-cover rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700"
              />
            )}
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100 text-center">{toolMachine.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">{toolMachine.assetId}</p>

            <div className="space-y-3 w-full max-w-sm">
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Tag className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-medium">Type:</span>
                <span className="ml-2">{toolMachine.type}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <MapPin className="w-5 h-5 mr-3 text-purple-500" />
                <span className="font-medium">Location:</span>
                <span className="ml-2">{toolMachine.location}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Info className="w-5 h-5 mr-3 text-orange-500" />
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${getStatusClass(toolMachine.status)}`}>
                  {toolMachine.status}
                </span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <User className="w-5 h-5 mr-3 text-green-500" />
                <span className="font-medium">Assigned To:</span>
                <span className="ml-2">{toolMachine.assignedTo || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Technical and Maintenance Details */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 border-b pb-2">Technical & Maintenance</h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Hash className="w-5 h-5 mr-3 text-cyan-500" />
                <span className="font-medium">Serial Number:</span>
                <span className="ml-2">{toolMachine.serialNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Factory className="w-5 h-5 mr-3 text-gray-500" />
                <span className="font-medium">Manufacturer:</span>
                <span className="ml-2">{toolMachine.manufacturer || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Settings className="w-5 h-5 mr-3 text-teal-500" />
                <span className="font-medium">Model Number:</span>
                <span className="ml-2">{toolMachine.modelNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Calendar className="w-5 h-5 mr-3 text-yellow-600" />
                <span className="font-medium">Purchase Date:</span>
                <span className="ml-2">{toolMachine.purchaseDate || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                <span className="font-medium">Purchase Cost:</span>
                <span className="ml-2">${toolMachine.cost ? toolMachine.cost.toFixed(2) : 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Clock className="w-5 h-5 mr-3 text-indigo-500" />
                <span className="font-medium">Last Maintenance:</span>
                <span className="ml-2">{toolMachine.lastMaintenanceDate || 'Never'}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Calendar className="w-5 h-5 mr-3 text-red-500" />
                <span className="font-medium">Next Maintenance:</span>
                {toolMachine.nextMaintenanceDate ? (
                  <span className={`ml-2 flex items-center ${isMaintenanceOverdue(toolMachine.nextMaintenanceDate) ? 'text-red-600 font-bold' : 'text-gray-700 dark:text-gray-200'}`}>
                    {isMaintenanceOverdue(toolMachine.nextMaintenanceDate) && <XCircle className="w-4 h-4 mr-1" />}
                    {toolMachine.nextMaintenanceDate}
                  </span>
                ) : (
                  <span className="ml-2 text-gray-400">Not scheduled</span>
                )}
              </div>
              <div className="text-gray-700 dark:text-gray-200">
                <div className="flex items-center mb-1">
                    <Clipboard className="w-5 h-5 mr-3 text-gray-500" />
                    <span className="font-medium">Notes:</span>
                </div>
                <p className="ml-8 text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  {toolMachine.notes || 'No additional notes.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={() => navigate('/inventory/tools-machinery')} variant="secondary">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
          </Button>
          <Button onClick={() => navigate(`/inventory/tools-machinery/${toolMachine.id}/edit`)} variant="primary">
            <Edit className="w-5 h-5 mr-2" /> Edit Tool/Machine
          </Button>
        </div>
      </Card>

      {/* Modal for error messages */}
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

export default ToolMachineDetailsPage;