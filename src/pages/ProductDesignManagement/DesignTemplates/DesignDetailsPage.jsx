import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { ArrowLeft, Edit, LayoutGrid, Image, Layers, Calendar } from 'lucide-react';

// --- INLINE MOCK DESIGN TEMPLATE DATA ---
// This is a simplified version of the mockDesignTemplates array, as we only need to "find" one template here.
// In a real application, you'd fetch this from a backend API.
const mockDesignTemplates = [
  {
    id: 'DTEMP001',
    name: 'Scandinavian Minimalist',
    description: 'Clean lines, light woods, neutral colors, and functional simplicity. Focuses on natural light and airy spaces, creating a serene and uncluttered environment.',
    type: 'Interior Style', // e.g., 'Interior Style', 'Component Design', 'Material Palette'
    status: 'Active', // 'Active', 'Archived', 'Draft'
    tags: ['minimalist', 'nordic', 'light wood', 'neutral', 'serene', 'functional'],
    applicableProducts: ['Dining Tables', 'Living Room Sofas', 'Accent Chairs', 'Storage & Shelving'], // Categories or specific products
    media: [
      'https://via.placeholder.com/600x400/C0C0C0/FFFFFF?text=Scandinavian+Design+1',
      'https://via.placeholder.com/300x200/D0D0D0/000000?text=Scandinavian+Design+2'
    ],
    version: '1.0',
    lastUpdated: '2024-06-15',
  },
  {
    id: 'DTEMP002',
    name: 'Industrial Loft Aesthetic',
    description: 'Exposed brick, metal accents, concrete textures, and dark, muted tones. Emphasizes raw, unfinished materials and reclaimed elements for a utilitarian yet stylish look.',
    type: 'Interior Style',
    status: 'Active',
    tags: ['industrial', 'urban', 'metal', 'concrete', 'reclaimed', 'raw'],
    applicableProducts: ['Storage & Shelving', 'Lighting', 'Dining Tables', 'Bedroom Furniture'],
    media: [
      'https://via.placeholder.com/600x400/505050/FFFFFF?text=Industrial+Loft+1',
      'https://via.placeholder.com/300x200/606060/000000?text=Industrial+Loft+2'
    ],
    version: '1.1',
    lastUpdated: '2024-07-01',
  },
  {
    id: 'DTEMP003',
    name: 'Geometric Pattern Set A',
    description: 'A collection of modern geometric patterns suitable for upholstery and accent pillows. Features bold shapes and contrasting colors to add a contemporary touch.',
    type: 'Component Design',
    status: 'Draft',
    tags: ['patterns', 'geometric', 'fabric', 'modern', 'bold', 'contemporary'],
    applicableProducts: ['Living Room Sofas', 'Accent Chairs'],
    media: [
      'https://via.placeholder.com/600x400/DDA0DD/FFFFFF?text=Geometric+Patterns+1',
      'https://via.placeholder.com/300x200/EEB0EE/000000?text=Geometric+Patterns+2'
    ],
    version: '0.9',
    lastUpdated: '2024-07-10',
  },
  {
    id: 'DTEMP004',
    name: 'Eco-Friendly Material Palette',
    description: 'A curated selection of sustainable and recycled materials, including organic cotton, bamboo, reclaimed wood, and recycled plastics. Designed for environmentally conscious products.',
    type: 'Material Palette',
    status: 'Archived',
    tags: ['eco-friendly', 'sustainable', 'recycled', 'natural', 'organic', 'green'],
    applicableProducts: ['All Products'], // Or specific products/categories
    media: [
      'data:image/jpeg;base64,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',
      'https://via.placeholder.com/300x200/9FCD9F/000000?text=Eco+Materials+2'
    ],
    version: '1.0',
    lastUpdated: '2023-11-20',
  },
];
// --- END INLINE MOCK DESIGN TEMPLATE DATA ---


const DesignDetailsPage = () => {
  const { id } = useParams(); // Get the template ID from the URL
  const navigate = useNavigate();

  const [designTemplate, setDesignTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDesignTemplateDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundTemplate = mockDesignTemplates.find(t => t.id === id);

      if (foundTemplate) {
        setDesignTemplate(foundTemplate);
      } else {
        setError('Design template not found.');
      }
    } catch (err) {
      setError('Failed to load design template details. Please try again.');
      console.error('Error fetching design template details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDesignTemplateDetails();
  }, [fetchDesignTemplateDetails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 dark:text-red-400 text-lg">
        <p>{error}</p>
        <Button onClick={() => navigate('/product-design-management/design-library')} className="mt-4">
          Go to Design Library
        </Button>
      </div>
    );
  }

  if (!designTemplate) {
    // This case should ideally be caught by the error state above, but as a safeguard:
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-400 text-lg">
        Design template details not available.
        <Button onClick={() => navigate('/product-design-management/design-library')} className="ml-4">
          Go to Design Library
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <LayoutGrid className="w-8 h-8 mr-2 text-indigo-600" />
          Design Template: <span className="ml-2 text-purple-700 dark:text-purple-400">{designTemplate.name}</span>
        </h1>
        <div className="flex space-x-3">
          <Button onClick={() => navigate('/product-design-management/design-library')} variant="secondary">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Library
          </Button>
          <Button onClick={() => navigate(`/product-design-management/design-library/${designTemplate.id}/edit`)}>
            <Edit className="w-5 h-5 mr-2" /> Edit Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Design Media */}
        <Card className="p-4 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center">
            <Image className="w-5 h-5 mr-2" /> Design Media
          </h2>
          {designTemplate.media && designTemplate.media.length > 0 ? (
            <div className="space-y-4">
              {designTemplate.media.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`${designTemplate.name} - ${index + 1}`}
                  className="w-full h-auto rounded-md object-cover border border-gray-200 dark:border-gray-700"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No media available for this design.</p>
          )}
        </Card>

        {/* Core Design Details */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
            <LayoutGrid className="w-5 h-5 mr-2" /> Core Design Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Template ID</p>
              <p className="text-lg">{designTemplate.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Design Name</p>
              <p className="text-lg">{designTemplate.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
              <p className="text-lg">{designTemplate.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
              <p className={`text-lg px-2 inline-flex leading-5 font-semibold rounded-full ${
                designTemplate.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                designTemplate.status === 'Archived' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
              }`}>
                {designTemplate.status}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
              <p className="text-lg">{designTemplate.description}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {designTemplate.tags && designTemplate.tags.map((tag, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Design Details */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
          <Layers className="w-5 h-5 mr-2" /> Application & Version
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Applicable Products/Categories</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {designTemplate.applicableProducts && designTemplate.applicableProducts.map((item, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</p>
            <p className="text-lg">{designTemplate.version || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="w-4 h-4 mr-1" /> Last Updated
            </p>
            <p className="text-lg">{designTemplate.lastUpdated || 'N/A'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DesignDetailsPage;