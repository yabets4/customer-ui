import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { PlusCircle, Save, XCircle, Tag, LayoutGrid, Upload, Image, Layers, Calendar, Trash2 } from 'lucide-react';

// --- INLINE MOCK DESIGN TEMPLATE DATA ---
// This 'mockDesignTemplates' array will serve as our in-memory "database".
// We'll modify it directly to simulate saving/updating data.
let mockDesignTemplates = [
  {
    id: 'DTEMP001',
    name: 'Scandinavian Minimalist',
    description: 'Clean lines, light woods, neutral colors, and functional simplicity. Focuses on natural light and airy spaces, creating a serene and uncluttered environment.',
    type: 'Interior Style',
    status: 'Active',
    tags: ['minimalist', 'nordic', 'light wood', 'neutral', 'serene', 'functional'],
    applicableProducts: ['Dining Tables', 'Living Room Sofas', 'Accent Chairs', 'Storage & Shelving'],
    media: ['https://via.placeholder.com/600x400/C0C0C0/FFFFFF?text=Scandinavian+Design+1'],
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
    media: ['https://via.placeholder.com/600x400/505050/FFFFFF?text=Industrial+Loft+1'],
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
    media: ['https://via.placeholder.com/600x400/DDA0DD/FFFFFF?text=Geometric+Patterns+1'],
    version: '0.9',
    lastUpdated: '2024-07-10',
  },
];

const designTemplateTypes = [
  { value: 'Interior Style', label: 'Interior Style' },
  { value: 'Component Design', label: 'Component Design' },
  { value: 'Material Palette', label: 'Material Palette' },
  { value: 'Functional Layout', label: 'Functional Layout' },
  // Add more types as your application grows
];

const designTemplateStatuses = [
  { value: 'Active', label: 'Active' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Archived', label: 'Archived' },
];
// --- END INLINE MOCK DESIGN TEMPLATE DATA ---

const generateUniqueId = (prefix = 'DTEMP') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

const DesignTemplateFormPage = () => {
  const { id } = useParams(); // Get template ID if in edit mode
  const navigate = useNavigate();

  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    id: generateUniqueId(),
    name: '',
    description: '',
    type: 'Interior Style', // Default value
    status: 'Draft',      // Default value
    tags: '', // Comma-separated string for input
    applicableProducts: '', // Comma-separated string for input
    media: [], // Array of Data URLs for local images
    version: '1.0',
    lastUpdated: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Ref for the file input
  const mediaInputRef = useRef(null);

  // Fetch template data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      setError(null);
      // Simulate API call
      const templateToEdit = mockDesignTemplates.find(t => t.id === id);
      if (templateToEdit) {
        setFormData({
          ...templateToEdit,
          tags: templateToEdit.tags ? templateToEdit.tags.join(', ') : '',
          applicableProducts: templateToEdit.applicableProducts ? templateToEdit.applicableProducts.join(', ') : '',
          media: templateToEdit.media || [],
        });
      } else {
        setError('Design template not found for editing.');
      }
      setLoading(false);
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Design Media Image Upload ---
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          media: [...prev.media, reader.result] // Add Data URL to media array
        }));
      };
      reader.readAsDataURL(file); // Read file as Data URL
    });
    if (mediaInputRef.current) {
        mediaInputRef.current.value = ''; // Clear file input
    }
  };

  const handleRemoveMedia = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.name || !formData.type || !formData.status) {
        throw new Error('Please fill in all required design template details (Name, Type, Status).');
      }

      const templateToSave = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        applicableProducts: formData.applicableProducts.split(',').map(item => item.trim()).filter(item => item !== ''),
        lastUpdated: new Date().toISOString().split('T')[0], // Update lastUpdated on save
      };

      // Simulate API call for saving/updating
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditMode) {
        const index = mockDesignTemplates.findIndex(t => t.id === templateToSave.id);
        if (index !== -1) {
          mockDesignTemplates[index] = templateToSave;
          console.log('Design template updated:', templateToSave);
        } else {
          throw new Error('Design template not found in mock data for update.');
        }
      } else {
        mockDesignTemplates.push(templateToSave);
        console.log('New design template added:', templateToSave);
      }

      navigate('/product-design-management/design-library');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while saving.');
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          {isEditMode ? 'Edit Design Template' : 'Add New Design Template'}
          <span className="ml-2 text-purple-600">
            {isEditMode ? `(${formData.name || formData.id})` : ''}
          </span>
        </h1>
        <Button onClick={() => navigate('/product-design-management/design-library')} variant="secondary">
          <XCircle className="w-5 h-5 mr-2" /> Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Core Design Template Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Template ID"
              name="id"
              value={formData.id}
              disabled // ID is generated or fixed
              className="bg-gray-100 dark:bg-gray-700"
            />
            <Input
              label="Design Template Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Scandinavian Minimalist"
              required
            />
            <Select
              label="Design Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={designTemplateTypes}
              required
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={designTemplateStatuses}
              required
            />
            <Input
              label="Version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              placeholder="e.g., 1.0"
            />
            <Input
              label="Last Updated"
              name="lastUpdated"
              value={formData.lastUpdated}
              disabled
              className="bg-gray-100 dark:bg-gray-700"
            />
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the design..."
              type="textarea"
              className="md:col-span-2"
            />
            <Input
              label="Tags (comma-separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., modern, nordic, wood"
              className="md:col-span-2"
              icon={<Tag className="w-5 h-5 text-gray-400" />}
            />
            <Input
              label="Applicable Products/Categories (comma-separated)"
              name="applicableProducts"
              value={formData.applicableProducts}
              onChange={handleChange}
              placeholder="e.g., Living Room Sofas, Dining Tables"
              className="md:col-span-2"
              icon={<Layers className="w-5 h-5 text-gray-400" />}
            />
          </div>
        </Card>

        <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
              <Image className="w-5 h-5 mr-2" /> Design Media
            </h2>
            <div className="flex flex-wrap gap-3 mb-4">
                {formData.media.map((src, index) => (
                    <div key={index} className="relative w-28 h-28 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden group flex-shrink-0">
                        <img src={src} alt={`Design media ${index}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => handleRemoveMedia(index)}
                            className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Image"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            {/* File Input for Design Media */}
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    accept="image/*"
                    multiple // Allow multiple files
                    onChange={handleMediaUpload}
                    ref={mediaInputRef}
                    className="hidden" // Hide the default file input
                    id="designMediaUpload"
                />
                <Button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    variant="outline"
                    className="flex items-center"
                >
                    <Upload className="w-5 h-5 mr-2" /> Upload Design Images
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {mediaInputRef.current?.files.length > 0 ? `${mediaInputRef.current.files.length} file(s) selected` : 'Select one or more images'}
                </span>
            </div>
        </Card>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate('/product-design-management/design-library')} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5 mr-2" />}
            {isEditMode ? (submitting ? 'Updating...' : 'Update Template') : (submitting ? 'Adding...' : 'Add Template')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DesignTemplateFormPage;