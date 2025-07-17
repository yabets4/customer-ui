import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  ArrowLeft, Edit, Package, Tag, DollarSign, Factory, Clock, MapPin, Box, Users, Clipboard
} from 'lucide-react';

// --- Mock Data for Finished Goods (Same as in List page) ---
// This represents your in-memory collection of finished products.
const mockFinishedGoods = [
  {
    id: 'FG001',
    productCode: 'TBL-OAK-001',
    name: 'Classic Oak Dining Table',
    description: 'Sturdy dining table crafted from high-quality kiln-dried oak. Seats 6-8 people. Dimensions: 72"L x 36"W x 30"H.',
    category: 'Dining Furniture',
    sellingPrice: 1200.00,
    productionCost: 750.00,
    currentStock: 15,
    minStockLevel: 5,
    location: 'Finished Goods Warehouse A, Zone 1',
    imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAFBgMEAAECB//EAEYQAAIBAwMBBAYGBgcHBQAAAAECAwAEEQUSITEGEyJBUWFxgZHBFCMyobHRJEJEYnKCJTNSssLh8BVDY2RzkuI0VHSDov/EABkBAAMBAQEAAAAAAAAAAAAAAAECAwAEBf/EACQRAAICAgICAgIDAAAAAAAAAAABAhEDEiExIjIEE0NRI0FC/9oADAMBAAIRAxEAPwAQB4jXWK3jmuscVylw52R63f8AL86YxnpS/wBkF5u/5fnTMi1RCMxFxQy8B/2gR6bd/wAVoyOlC7sZ1MD/AJaT8VpgFvs/Y213JcfSojJs27fER1z+VFE0TTyG+oyyuRt3kZGM4oVpUwtlu2wS2UCgLnJ54otaXQ+s3BlxIAfAx8vZUpyakY4Ok6Ws0iNB4QWH9Z0wB6/ScUmx4C8f2j+NNL3KS3M32/ANvCkZJweaVY/s/wA3zNUTsNUNekSSfQYogQImjy7YyRyfKpIHLJMo2+JmA5weuSfQKFw3PcwWiqSJAno6jJrq1vk+s25BLkcA8c9fbzTNjoJ27lg5GQm9+N2fP/Qpd1RydSuCePF8qu2F0BE4JkwsjeR82ofqfN/ORnk+fspbs0uhr0qQmxt4/JYgT6cEDn8KLW0qSxq4OQXYNjyHn99LcE5SGBVVzuiQcD1CpbXUGiimiAkVe9OTt9dHamDTZBm1lEkxVefrJPF6Bk0paiwOo3OOhkbHxNGbOfdcOzK7RsxB46ANQLUnVtRuivTvW/Gtdia06HLSCF0+P+J/7xrKq2Mv6HGNknBfoB/bb11lPsTPIR1rvHFVopg6q2R4hmrIIIrmOgYOx/W7/l+dMopb7Iftf8nzpjQZNVj0TZMi8UNvB/SsY9NvJ+K0VQcUOvF/paI/8vL/AIKZoCJdLUlroqzKwZcMBnHB8vOpA3ercW8GdwkUluhAOPyriwk7o3B7t2UuobZ5DB561o3F4qOlsF3yS+ElADgAZ8+tc+T3DZuWUCe6CqYwZmOMYJ464pdiHhOPSfxNSQTNJdTAsWCttYZz1HPX2VHZO8kTtJGVIlYDjqoPBqsVRk7L06OYbZlC4WLz6nk9KiRtqIuXy8jBiB689akvATHbLtP9XgEeZ5/Oo7b62IEodwZgGGBk+X4UJjp8EsTL9HlG3a3ehRubjOf86gujuuHJ5yR+Fc7zO8sYZ1RZSzIoGc549wx+FSXHilZsdcfhWggPoO2iOywOGICRJ+AqSNVkkkZNxBd/Djoc+moIhJMtvDGrfYXpjnj21Ys3MSY7qWQGRhlsE5zz51pXYbo7sRE5bvDhhITjP71AL/8A9fdY6d41H7VwJ5G7thGzvkqBkZNA9RA+n3WM47xuvtowQrdjDaz7IFUSbeW4x+8ayqbOSq7R/a8v3jWqzbsmeJxX223TfHJ4SUJC+YbiilnqKy/aR0X0kcULtdHvYo0kllOW3ruydrcZC4PsP3VPaXGO53LlJMKGB5U+gjz9tc6dPgdWnTPQOyH7V/J86Zo+tK/Y/k3XsT500xV1Q6NIsIOKoXq/0nCf+BJ/hoilUbwf0jD/ANKT8FpmKjrTpzA1xgkF3QcDOeDxVi11NleRX3ZaTnHOfCKpq08QlNvErMXUks2AOK5gmfMzxxwk7twYSE9VHqrzvkrzbCgnbSwbbgPDHkyEnwAZ4HNK0SAIi+S8c+qjMEzbpfsDcx4MhB8h021Qji559Jq3xemFh3TZAunxxiFHcDPjHFcRS2yiTfa24zIQMIODz1qGDvBbRBI0xgeIsRn4Cqlu90tw7vaRMHYlW7zlffj1VLLe8g2ELZNOkVn+hAnvGDFAcjmg+pLH9Nm7ldseeAPLirdvIY2aNY48CRsK0hzn3jrzUFxGe+fI9HU58qf4zbk0wWHNKW2SGJ3YiXYuCDyowK0lok0bg3JbErHJHIOaorKyKid07AoB4WA8hXdnJtDEoSO8Y8MOPEeD8KGaU1JpMCZPYaaRvH0sBO9kO0LnqcfKgd2hFzOuckOwz6au2mrK8UmxGbLtym05JJ8s1XkQmR2I5JquBybakaw3bwxNApaXBJbjaOPEayh7XKIdpZhhm/UJ/WNaqc3LZgs871WNrvs20drDLLLvUqqIc9RQGCyvLZR9KtZYkBz48D50XTtSLrGzTo+WI+tlL1WkP0lpZHijRllGAi4A8NMlR1NbMcex45ufYnzpqjpX7H/tPsX500wjmumHRzz7LKDiqtymdQt/+nIPuFXAwXrWTRfpEUgVjtVugz1FOIDro90vTq48s9BmqdpKgRlhIDSNhFc4A4z0orJHcktsjmw3XaooD2m1a/0e1My+AllUCVeWznJGCOmKhkwKTcmwrsq61ryaQB3hKSF+SqZyBjj1Z9/nXWg6w2pz92kQZDlt32fu++l7WdQuNV0O3u7rayx3GDgcAkHH4UY7DkvIxjG4gHgGowjpPhj/AFursbS5iSMYwuKqRSfUkyRguOW8RogsUzEMYJMgY8Lj865NmFLN9EuPFyceXwqk8EpSbQlg5HQ3hbdsBJwOc588DpVqSEOxK9D0+FSui7SDbXIzz9g8fdUa3S7tvdTcemM/lT4sTg+QHBk2zmIsoBUEAgn0fCuLefKkLJGuWkwQP3jipZYoJZTOJ3icjHij4++o/o1rIozcQlsnB95PpqWT47k20C2ivavbWsBGArBjvfb1OT8attFu3EdDzWorWKJZNs8fjcseTjJz+dWkaL7KsMdBVcONwbs1lG4jiMh3sc5PGPWaypJ7K4lcvG6BST+sPSfXWUJYW22A8O0ojIHoc0ai6z/xRn7jS3aTLAc9/CQWJByR+NH4WYRzNIhTKRMufMbiMj41OXR2x7HnscMm59i/OmuMYpX7HftH8KfOmfPFXx+pCXZzeNmFwPMYpFltNSa6Jt9S7tBwEeMNginW5OVIpcchLiUnoGJoT5DDgXLftjqNsWjW4UhTg5hAB+FZqPayXU7b6NqEFrPDuDbWDLzVDsvpsGpK30rfwmcq2DnIFFpOytoSdlxOvqYK3yFc6c2uzoei7KlvrtjDZNZjSoe5Zw+0TDAIz5H2miemdp7CzOY7CWMnj6vHyoJqnZ0WNq1wLkOqkDbsweTity9lL2Ija9u/APDkeWfMUE5JmqLQ+2fbvTtoEi3KfxR/50Wsu2WkXEqxreBWY4AdSK8mOianF9mEn+CQfnUmhRy/7aMF5vUou7ax5U8c/CqLNMR4of0evT9qtNhzmfd7KGzdrYXf9Htp5PPpj/XxoKG063J2RGRvUvzNAtX7UTWms22nWlpAizxsxd8sRwegGB5UXkyPoH1wQz3nbO+UIsVuqbkDqWOeD09NDx2r1g57wxSepox+VKnabWJtPm04COJxNZQKu9TnJYgngjyFU4u19ucmSyj2/WP4XYeBeB5nqapBNq0yc2k6oeR2puz/AFtjbP8A/Wv5V2naiMczaNbN61Uj8DSevafTCCGgnVgF4WVT426DkeQq1HrekSyBBNOpMpjUmMMDt+0eo4pqmLtEcF7WWGPFpkyn0LO4FapWi1XR3hjka+CiQblBjOcZ4rVbzNcSbRrK6JSSK0021IVjujt1LcHB5xQ7XpLiTVdSiuXWSSKKJMrwDgqTx76adCcmGIhSI9s3q/WGaTtYuC3aHUyTkl8H3bfyrlfqdS7HjsbG5+kAKc7U68emmpbWTHiwKAdkSd90VyOE6e+mUgkc11Y/U5snsVZbcZ5YYpZ1VIYVvWywKq5+40zzsiDfIyqvpY4FJPaS/t+41HZPGTsfADdeKE6oMEwf2HhT6HI8mRlRjHrZvypkKQel6Xezs8NnpkayyojOikBjjy/zogdStf8A3Ef/AHVHH6lZ3sQ9qEjGjybCc706/wAQotKkRYbiwO1ensFLuu3tvcac0cc0bMWXChuTyKK6hqNrBdvFJcRIygZUsARwKH5A/wCCy8cO0nc1LEYA7YygHgwg59woo+qWhU4uof8AvFCLSRJe1u9GVlMHVTkdKM+gQD5hXJO+kjtI6p2x0pkcMpjGD6Qcj5039/3iMEYE44OaQdUtbx9RsrsEOkMUDcDG0MwCqPTz5mjFAkEO3gAg7OuPMlM/wyf+VJoP1J/+NJ/fp97aWVxdaZo8kELy9zdyb9i5IGQc0itA8ShbhJIAYGDGRCNuW4zT4H/GieZebL1xevcC2gaOFRBPEoZEwzgj9Y+dU4sfU44O24/A1hKGfKyAr38ZyB+7xWRRuVjZeQqzZx5ZHAqqJNlHUnYG1AYj9GTz9VZWajFLvgUxtlYUB46EVlMY9y0O4hS2jEj/AGVbOBk5Zs9PdSpd6FPPqF1cx3oQTSM2wx5wCfTTfFE4XLMnwrtUweoPqwK4bO6jXZie40+OYSbJnk2gNtKgYz6znrRae71G4wpYoPQuF+/rVa1Cq/OOPQKIJJkA7TxTqTqhGl2CX03vC0k7Ev0yWLZ9+aCdpbKO30S8lC48GM+0gU4ECRuje6gHbqPZ2bucA+JkXBOf1h+VK3wMu6INK0pbnTIN0RJUAbs48hVodnoj/ufb4hRXR4FXTosEg5bI95okigKAQT7qMItozlyJOv6LFbaa8yR4ZXTnP7wohf6HDeXrysnLAeL08Crva9caJLkY8af3hRmNBsTwjoKXV70HbxsUn7KQOn9WAfVQVdOXTu1UNuowrwH7wa9N2tg0k68m3thaN6Yef/1RnGlYIuyrN2Kjz4UUEdCSTihtz2PuI1PcSMoIUYViPsnI++vTu4O7I4rbRZGWUD2HNNqxbR55creT6DiykKTQ3xyQM8FOnxFD++16AYd4pR/xIgM04aBEq6tq9s4G0T7lHx+VGHtI2JCqtTxp0PkrY8sluJif0zRLGfknITByep9tVHi0Jx+kaJPbNtKhoZmwM9eDgV6lPp6vkFFx/CKoS6LEeFiHPoFU2kT1izziTTOzMzb/AKVqEQwAE64H31unw9momOTGAfjWqP2MH1owXiumArL6wKmi71hlFlI9RqG2VUXhefSRU6XsS5y+MVKigQggkIBMpAxyMmrQCphtzdceJqCJqhKY8IJGODWluZJSEEgJ8gWzTJADnfAPndkeqgPbOYyabDCM4kuox9+alBuDhfs+4j5VHcWC3bxLeMzFX3xqGIGaZxbQE0mHtMIWzhGCfDRAHp4Rj+Kq1upjjEaABVHFTp08R59tVjCkTlLkjurGK7UpcRq8fXawyM++poHQJ3ZAyvTFZIQsWdwqqk0e/GQTWrk12gh1HopM7TgDtVYHHBhP4NThGc8bWA8yRSh2qGO0emk8fVv+DUmZeI2N+Q7K3OOPhWnLZ6D1cVzsJY8mo5WYAjc/qqqSJ2xf08bO2OoIf94qtj3UwvDubIx+VDrexRdQe+2ETsNu7ceR8aJjeRwvvqeONWUnK6Oe5P6xBroRccbQPZWYf/QzW8NjxYx6RVNRLODGo64+Fbrfcny5Faoams8nCs5LNJJvY+Tmpo7eRiF5A9JyRU8SWykshJceeDxUstwqR5kYKCccmpKP7KNnVtZqjqZGVh5rg8/fROJEjYNHGqHOMjrQQ6jDHgo6M3oJrqTUxJFt8I5znNMqQvIwyXcdugeU+dUn1le/DQjPkdy0De5TIDFvXyK7sXWW5SJHG5jxuPFF8mXA52l2swVnznHlxRFXQjhC2B5E0Is7cxovehSMgYUmi9viJsqCAfCec1VE2cFe+DKVeMeW7PNdQwQJgMqsw88da7usGPcTjbySapPdwKgaORC4PT1VmZBeKXw7Sh449tKXaqCe512wePYqQq+8ueTkYGPjRY3az7QWAI8xQ+/ZDcRDc1LNJqhocOxjMwYAnPprh51J54HrqqkqkKGLZPp6VZ+jDOXGV9GTxTUKSwspXKkEerP5V0ZT1HAzW441iH1YwPPmtsFbxY99FIDfJnIO5GyK6Vsnp7q4LKgyrKc+VQSoJWyGxx5dDWMXCpPI4rKpi3X1n31qsGzzPUnaFYViO0HJOB6hVCSV51KStuVTkDpz7qysrlKo6gC/2R8TVxQOu1cjocVusohLNiimdDgdemBTBaqAvAxwPxrKynQjCP7Mx8wuatL9k+oZFZWVYQpXV3MsZG4EMMEEUFEhZzkDj0VlZSMZBOBiEHT4VWdu8usNjjGOKysoMwbtQNoGB8KvQsdg59XurdZVBDISclfIVzO7Ry4U8HBxWVlED7NKxJ5x1qVRjOKysoBJhCpGct8aysrKwD//2Q==',
    assemblyTime: '8 hours',
    materialsUsed: ['RM001', 'RM003'] // Links to raw materials if desired
  },
  {
    id: 'FG002',
    productCode: 'SOF-VEL-BLU-001',
    name: 'Luxury Blue Velvet Sofa',
    description: 'Elegant three-seater sofa upholstered in plush blue velvet. Solid wood frame with high-density foam cushions. Dimensions: 84"L x 38"W x 32"H.',
    category: 'Living Room Furniture',
    sellingPrice: 1850.00,
    productionCost: 1100.00,
    currentStock: 8,
    minStockLevel: 3,
    location: 'Finished Goods Warehouse B, Aisle 3',
    imageUrl: '/images/blue-sofa.jpg',
    assemblyTime: '12 hours',
    materialsUsed: ['RM002', 'RM003']
  },
  {
    id: 'FG003',
    productCode: 'CHR-STL-MOD-001',
    name: 'Modern Steel & Leather Chair',
    description: 'Sleek, minimalist chair with a brushed steel frame and brown leather upholstery. Ergonomic design for comfort. Dimensions: 24"W x 24"D x 34"H.',
    category: 'Seating',
    sellingPrice: 450.00,
    productionCost: 280.00,
    currentStock: 25,
    minStockLevel: 10,
    location: 'Finished Goods Warehouse A, Zone 2',
    imageUrl: '/images/steel-chair.jpg',
    assemblyTime: '4 hours',
    materialsUsed: ['RM004', 'RM005']
  },
  {
    id: 'FG004',
    productCode: 'BED-KNG-LUX-001',
    name: 'Luxury King Size Bed Frame',
    description: 'Grand bed frame with a padded headboard, suitable for a king-size mattress. Dark wood finish.',
    category: 'Bedroom Furniture',
    sellingPrice: 950.00,
    productionCost: 600.00,
    currentStock: 3,
    minStockLevel: 1,
    location: 'Finished Goods Warehouse B, Aisle 1',
    imageUrl: '/images/king-bed.jpg',
    assemblyTime: '10 hours',
    materialsUsed: ['RM001', 'RM003']
  },
];

const FinishedGoodDetailsPage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();

  const [finishedGood, setFinishedGood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' });

  useEffect(() => {
    const fetchFinishedGoodDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay for fetching data
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundFinishedGood = mockFinishedGoods.find(fg => fg.id === id);

        if (foundFinishedGood) {
          setFinishedGood(foundFinishedGood);
        } else {
          setError('Finished good not found.');
          setModalContent({ title: 'Error', message: `Finished good with ID "${id}" not found.`, type: 'error' });
          setModalOpen(true);
        }
      } catch (err) {
        setError('Failed to load finished good details.');
        setModalContent({ title: 'Error', message: 'Failed to load finished good details. Please try again.', type: 'error' });
        setModalOpen(true);
        console.error('Error fetching finished good details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinishedGoodDetails();
  }, [id]); // Re-run effect if ID changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !finishedGood) { // Show error if no data was loaded
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="p-6">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
          <Button onClick={() => navigate('/inventory/finished-goods')} variant="secondary">
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

  // If finishedGood is null but not in an error state (e.g., initial render before fetch),
  // this might be a momentary state. If it remains null, the error state above should catch it.
  if (!finishedGood) {
    return null; // Or a very light spinner/placeholder
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        <Package className="inline-block w-8 h-8 mr-2 text-indigo-600" /> Finished Good Details: {finishedGood.name}
      </h1>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Image and General Info */}
          <div className="flex flex-col items-center">
            {finishedGood.imageUrl && (
              <img
                src={finishedGood.imageUrl}
                alt={finishedGood.name}
                className="w-full max-w-sm h-64 object-cover rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700"
              />
            )}
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{finishedGood.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">{finishedGood.productCode}</p>

            <div className="space-y-3 w-full max-w-sm">
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Tag className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-medium">Category:</span>
                <span className="ml-2">{finishedGood.category}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <MapPin className="w-5 h-5 mr-3 text-purple-500" />
                <span className="font-medium">Location:</span>
                <span className="ml-2">{finishedGood.location}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Box className="w-5 h-5 mr-3 text-orange-500" />
                <span className="font-medium">Current Stock:</span>
                <span className={`ml-2 font-bold ${finishedGood.currentStock <= finishedGood.minStockLevel ? 'text-red-600' : 'text-green-600'}`}>
                  {finishedGood.currentStock} units
                </span>
                {finishedGood.minStockLevel && (
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400"> (Min: {finishedGood.minStockLevel})</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Financial and Production Details */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 border-b pb-2">Product Details</h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                <span className="font-medium">Selling Price:</span>
                <span className="ml-2 text-lg font-bold">${finishedGood.sellingPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Factory className="w-5 h-5 mr-3 text-gray-500" />
                <span className="font-medium">Production Cost:</span>
                <span className="ml-2">${finishedGood.productionCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Clock className="w-5 h-5 mr-3 text-yellow-600" />
                <span className="font-medium">Assembly Time:</span>
                <span className="ml-2">{finishedGood.assemblyTime || 'N/A'}</span>
              </div>
              <div className="text-gray-700 dark:text-gray-200">
                <div className="flex items-center mb-1">
                    <Clipboard className="w-5 h-5 mr-3 text-teal-500" />
                    <span className="font-medium">Description:</span>
                </div>
                <p className="ml-8 text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  {finishedGood.description || 'No description provided.'}
                </p>
              </div>
              {finishedGood.materialsUsed && finishedGood.materialsUsed.length > 0 && (
                <div className="text-gray-700 dark:text-gray-200">
                  <div className="flex items-center mb-1">
                    <Users className="w-5 h-5 mr-3 text-indigo-500" />
                    <span className="font-medium">Key Raw Materials Used:</span>
                  </div>
                  <ul className="list-disc list-inside ml-8 text-sm">
                    {finishedGood.materialsUsed.map((materialId, index) => (
                      <li key={index} className="flex items-center">
                         {/* Link to raw material details if you want, or just display text */}
                         <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate(`/inventory/raw-materials/${materialId}`)}>
                           {materialId}
                         </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={() => navigate('/inventory/finished-goods')} variant="secondary">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
          </Button>
          <Button onClick={() => navigate(`/inventory/finished-goods/${finishedGood.id}/edit`)} variant="primary">
            <Edit className="w-5 h-5 mr-2" /> Edit Finished Good
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

export default FinishedGoodDetailsPage;