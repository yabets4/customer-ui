export const mockMaterials = [
  {
    id: 1,
    sku: 'WD-001',
    name: 'Oak Wood Plank',
    image_url: '/assets/oak.jpg',
    category: 'Wood',
    uom_primary: 'Board Feet',
    cost_price: 150,
    lead_time_days: 5,
    safety_stock_level: 100,
    stock_status: 'Available',
    current_stock: 120,
  },
  {
    id: 2,
    sku: 'GL-002',
    name: 'Wood Glue',
    image_url: '../assets/ist.jpg',
    category: 'Adhesive',
    uom_primary: 'Liters',
    cost_price: 20,
    lead_time_days: 2,
    safety_stock_level: 30,
    stock_status: 'Quarantined',
    current_stock: 20,
  },
  // Add more as needed
];
