import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Search, PlusCircle, Eye, Edit, Archive, Play, LayoutGrid } from 'lucide-react';

// --- INLINE MOCK DESIGN TEMPLATE DATA ---
// Using 'let' so it can be modified by other pages (e.g., form pages) if they were also inlined
let mockDesignTemplates = [
  {
    id: 'DTEMP001',
    name: 'Scandinavian Minimalist',
    description: 'Clean lines, light woods, neutral colors, and functional simplicity. Focuses on natural light and airy spaces.',
    type: 'Interior Style', // e.g., 'Interior Style', 'Component Design', 'Material Palette'
    status: 'Active', // 'Active', 'Archived', 'Draft'
    tags: ['minimalist', 'nordic', 'light wood', 'neutral'],
    applicableProducts: ['Dining Tables', 'Living Room Sofas', 'Accent Chairs'], // Categories or specific products
    media: ['data:image/jpeg;base64,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'],
    version: '1.0',
    lastUpdated: '2024-06-15',
  },
  {
    id: 'DTEMP002',
    name: 'Industrial Loft Aesthetic',
    description: 'Exposed brick, metal accents, concrete textures, and dark, muted tones. Emphasizes raw, unfinished materials.',
    type: 'Interior Style',
    status: 'Active',
    tags: ['industrial', 'urban', 'metal', 'concrete'],
    applicableProducts: ['Storage & Shelving', 'Lighting', 'Dining Tables'],
    media: ['data:image/jpeg;base64,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'],
    version: '1.1',
    lastUpdated: '2024-07-01',
  },
  {
    id: 'DTEMP003',
    name: 'Geometric Pattern Set A',
    description: 'A collection of modern geometric patterns suitable for upholstery and accent pillows.',
    type: 'Component Design',
    status: 'Draft',
    tags: ['patterns', 'geometric', 'fabric', 'modern'],
    applicableProducts: ['Living Room Sofas', 'Accent Chairs'],
    media: ['https://via.placeholder.com/400x250/DDA0DD/FFFFFF?text=Geometric+Patterns'],
    version: '0.9',
    lastUpdated: '2024-07-10',
  },
  {
    id: 'DTEMP004',
    name: 'Eco-Friendly Material Palette',
    description: 'A curated selection of sustainable and recycled materials, including organic cotton, bamboo, and reclaimed wood.',
    type: 'Material Palette',
    status: 'Archived',
    tags: ['eco-friendly', 'sustainable', 'recycled', 'natural'],
    applicableProducts: ['All Products'], // Or specific products/categories
    media: ['https://via.placeholder.com/400x250/8FBC8F/FFFFFF?text=Eco+Materials'],
    version: '1.0',
    lastUpdated: '2023-11-20',
  },
];

const designTemplateTypes = [
  { value: '', label: 'All Types' },
  { value: 'Interior Style', label: 'Interior Style' },
  { value: 'Component Design', label: 'Component Design' },
  { value: 'Material Palette', label: 'Material Palette' },
  // Add more types as your application grows
];

const designTemplateStatuses = [
  { value: '', label: 'All Statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Archived', label: 'Archived' },
  { value: 'Draft', label: 'Draft' },
];
// --- END INLINE MOCK DESIGN TEMPLATE DATA ---

const DesignLibraryPage = () => {
  const navigate = useNavigate();

  const [designTemplates, setDesignTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Simulate fetching design templates from an API
  const fetchDesignTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Using the inline mockDesignTemplates directly
      setDesignTemplates(mockDesignTemplates);
    } catch (err) {
      setError('Failed to fetch design templates. Please try again.');
      console.error('Fetch design templates error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDesignTemplates();
  }, [fetchDesignTemplates]);

  // Filter and sort design templates
  const filteredDesignTemplates = useMemo(() => {
    let currentTemplates = [...designTemplates]; // Create a mutable copy

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentTemplates = currentTemplates.filter(template =>
        template.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        template.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        template.id.toLowerCase().includes(lowerCaseSearchTerm) ||
        template.type.toLowerCase().includes(lowerCaseSearchTerm) ||
        template.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    if (selectedType) {
      currentTemplates = currentTemplates.filter(template => template.type === selectedType);
    }

    if (selectedStatus) {
      currentTemplates = currentTemplates.filter(template => template.status === selectedStatus);
    }

    // Sort by name for consistent ordering
    return currentTemplates.sort((a, b) => a.name.localeCompare(b.name));
  }, [designTemplates, searchTerm, selectedType, selectedStatus]);

  const handleToggleStatus = async (templateId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Archived' : 'Active';
    // Optimistically update UI
    setDesignTemplates(prevTemplates =>
      prevTemplates.map(t =>
        t.id === templateId ? { ...t, status: newStatus } : t
      )
    );

    try {
      // Simulate API call to update status
      await new Promise(resolve => setTimeout(resolve, 300));
      const templateIndex = mockDesignTemplates.findIndex(t => t.id === templateId);
      if (templateIndex !== -1) {
        mockDesignTemplates[templateIndex].status = newStatus; // Update central mock data
        console.log(`Design template ${templateId} status toggled to ${newStatus}`);
      }
    } catch (err) {
      setError('Failed to update template status. Please try again.');
      // Revert UI on error
      setDesignTemplates(prevTemplates =>
        prevTemplates.map(t =>
          t.id === templateId ? { ...t, status: currentStatus } : t
        )
      );
      console.error('Toggle status error:', err);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-600 dark:text-red-400">
        <p>{error}</p>
        <Button onClick={fetchDesignTemplates} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="w-full mb-96 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <LayoutGrid className="w-8 h-8 mr-2 text-indigo-600" />
          Design Template Library
        </h1>
        <Button onClick={() => navigate('/product/design-library/new')}>
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Design Template
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Search by Name, Description, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            label="Search Templates"
          />
          <Select
            label="Filter by Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={designTemplateTypes}
          />
          <Select
            label="Filter by Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={designTemplateStatuses}
          />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Name / ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDesignTemplates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    No design templates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredDesignTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {template.name} <span className="text-gray-400 text-xs">({template.id})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {template.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {template.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        template.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                        template.status === 'Archived' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      }`}>
                        {template.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {template.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/product/design-library/${template.id}/detail`)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/product/design-library/${template.id}/edit`)}
                          title="Edit Template"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(template.id, template.status)}
                          title={template.status === 'Active' ? 'Archive Template' : 'Activate Template'}
                        >
                          {template.status === 'Active' ? (
                            <Archive className="w-4 h-4 text-orange-500" />
                          ) : (
                            <Play className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DesignLibraryPage;