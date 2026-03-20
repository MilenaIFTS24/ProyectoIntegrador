export const reservations = [
  {
    id: 1,
    createdAt: '10-10-24',
    userId: 1,
    products: [
      { productId: 1, product: { id: 1, name: 'Té Verde Matcha Orgánico Premium', brand: 'TeaHouse Eco', productType: 'tea' }, quantity: 2, unitPrice: 450 },
      { productId: 3, product: { id: 3, name: 'Rooibos Vainilla y Canela Orgánico', brand: 'African Organic Essence', productType: 'tea' }, quantity: 1, unitPrice: 180 }
    ],
    totalAmount: 1080,
    pickupDate: '15-10-24',
    pickupTimeSlot: '14:00-15:00',
    customerNotes: 'Entregar a nombre de Juan',
    contactEmail: 'juan.garcia@email.com',
    cancellationDate: null,
    paymentMethod: 'debit',
    paymentId: 'PAY001',
    subtotal: 1080,
    discount: 0,
    state: 'pending_pickup',
    discountCode: null,
    ecoPackaging: true
  },
  {
    id: 2,
    createdAt: '11-10-24',
    userId: 2,
    products: [
      { productId: 2, product: { id: 2, name: 'Set de Infusores de Acero Inoxidable Reciclado', brandArtist: 'MetalArts Eco Studio', productType: 'craft' }, quantity: 1, unitPrice: 420 }
    ],
    totalAmount: 357,
    pickupDate: '16-10-24',
    pickupTimeSlot: '10:00-11:00',
    customerNotes: 'Sin notas',
    contactEmail: 'maria.rodriguez@email.com',
    cancellationDate: null,
    paymentMethod: 'credit',
    paymentId: 'PAY002',
    subtotal: 420,
    discount: 63,
    state: 'finished',
    discountCode: 'FIRST20ECO',
    ecoPackaging: true
  },
  {
    id: 3,
    createdAt: '08-10-24',
    userId: 3,
    products: [
      { productId: 5, product: { id: 5, name: 'Chai Especiado Orgánico Tradicional', brand: 'Spice Route Organic', productType: 'tea' }, quantity: 3, unitPrice: 220 }
    ],
    totalAmount: 0,
    pickupDate: null,
    pickupTimeSlot: null,
    customerNotes: 'Cliente canceló',
    contactEmail: 'carlos.fern@email.com',
    cancellationDate: '09-10-24',
    paymentMethod: null,
    paymentId: null,
    subtotal: 660,
    discount: 0,
    state: 'cancelled',
    discountCode: null,
    ecoPackaging: false
  },
  {
    id: 4,
    createdAt: '12-10-24',
    userId: 5,
    products: [
      { productId: 8, product: { id: 8, name: 'Pu-erh Envejecido 10 años Orgánico', brand: 'Ancient Forest Tea Organic', productType: 'tea' }, quantity: 1, unitPrice: 520 },
      { productId: 4, product: { id: 4, name: 'Caja de Té de Madera de Algarrobo Sustentable', brandArtist: 'Carpintería El Bosque Eco', productType: 'craft' }, quantity: 1, unitPrice: 1500 }
    ],
    totalAmount: 1700,
    pickupDate: '18-10-24',
    pickupTimeSlot: '16:00-17:00',
    customerNotes: 'Entregar en mostrador principal',
    contactEmail: 'laura.martinez@email.com',
    cancellationDate: null,
    paymentMethod: 'cash',
    paymentId: 'PAY004',
    subtotal: 2020,
    discount: 320,
    state: 'pending_pickup',
    discountCode: 'SETECO',
    ecoPackaging: true
  },
  {
    id: 5,
    createdAt: '13-10-24',
    userId: 7,
    products: [
      { productId: 7, product: { id: 7, name: 'Infusión Relajante - Manzanilla y Lavanda Ecológica', brand: 'Herbals Eco Argentina', productType: 'tea' }, quantity: 2, unitPrice: 150 }
    ],
    totalAmount: 270,
    pickupDate: '19-10-24',
    pickupTimeSlot: '11:00-12:00',
    customerNotes: 'Regalo para amiga',
    contactEmail: 'sofia.ramirez@email.com',
    cancellationDate: null,
    paymentMethod: 'debit',
    paymentId: 'PAY005',
    subtotal: 300,
    discount: 30,
    state: 'finished',
    discountCode: 'MIEMBROECO',
    ecoPackaging: true
  },
  {
    id: 6,
    createdAt: '09-10-24',
    userId: 9,
    products: [
      { productId: 9, product: { id: 9, name: 'Bolsas de Tela Orgánica Reutilizables - Pack x3', brandArtist: 'EcoDesign Studio', productType: 'craft' }, quantity: 1, unitPrice: 280 },
      { productId: 6, product: { id: 6, name: 'Té Blanco Silver Needle Orgánico', brand: 'Chinese White Tea Eco', productType: 'tea' }, quantity: 1, unitPrice: 390 }
    ],
    totalAmount: 535,
    pickupDate: '14-10-24',
    pickupTimeSlot: '15:00-16:00',
    customerNotes: 'Sin notas',
    contactEmail: 'valentina.sanchez@email.com',
    cancellationDate: null,
    paymentMethod: 'virtual_wallet',
    paymentId: 'PAY006',
    subtotal: 670,
    discount: 135,
    state: 'finished',
    discountCode: 'SETECO',
    ecoPackaging: true
  },
  {
    id: 7,
    createdAt: '14-10-24',
    userId: 1,
    products: [
      { productId: 10, product: { id: 10, name: 'Té Matcha Orgánico Premium Ceremonial', brand: 'Pure Green Japan Organic', productType: 'tea' }, quantity: 1, unitPrice: 680 }
    ],
    totalAmount: 680,
    pickupDate: '20-10-24',
    pickupTimeSlot: '13:00-14:00',
    customerNotes: 'Requiere embalaje especial',
    contactEmail: 'juan.garcia@email.com',
    cancellationDate: null,
    paymentMethod: 'credit',
    paymentId: 'PAY007',
    subtotal: 680,
    discount: 0,
    state: 'pending_pickup',
    discountCode: null,
    ecoPackaging: true
  },
  {
    id: 8,
    createdAt: '06-10-24',
    userId: 4,
    products: [
      { productId: 1, product: { id: 1, name: 'Té Verde Matcha Orgánico Premium', brand: 'TeaHouse Eco', productType: 'tea' }, quantity: 5, unitPrice: 450 }
    ],
    totalAmount: 2250,
    pickupDate: '12-10-24',
    pickupTimeSlot: '17:00-18:00',
    customerNotes: 'Pedido corporativo',
    contactEmail: 'admin@teahouse.com',
    cancellationDate: null,
    paymentMethod: 'debit',
    paymentId: 'PAY008',
    subtotal: 2250,
    discount: 0,
    state: 'finished',
    discountCode: null,
    ecoPackaging: true
  },
  {
    id: 9,
    createdAt: '11-10-24',
    userId: 5,
    products: [
      { productId: 3, product: { id: 3, name: 'Rooibos Vainilla y Canela Orgánico', brand: 'African Organic Essence', productType: 'tea' }, quantity: 2, unitPrice: 180 },
      { productId: 5, product: { id: 5, name: 'Velas Aromáticas 100% Soja Orgánica', brandArtist: 'Aromatherapy Eco Handmade', productType: 'craft' }, quantity: 1, unitPrice: 320 }
    ],
    totalAmount: 640,
    pickupDate: '17-10-24',
    pickupTimeSlot: '12:00-13:00',
    customerNotes: 'Confirmar antes de enviar',
    contactEmail: 'laura.martinez@email.com',
    cancellationDate: null,
    paymentMethod: 'cash',
    paymentId: 'PAY009',
    subtotal: 680,
    discount: 40,
    state: 'pending_pickup',
    discountCode: 'MIEMBROECO',
    ecoPackaging: true
  },
  {
    id: 10,
    createdAt: '07-10-24',
    userId: 2,
    products: [
      { productId: 8, product: { id: 8, name: 'Escultura de Piedra Volcánica Reciclada', brandArtist: 'Artesano Roberto Gil Eco', productType: 'craft' }, quantity: 1, unitPrice: 3200 }
    ],
    totalAmount: 2880,
    pickupDate: '13-10-24',
    pickupTimeSlot: '10:00-11:00',
    customerNotes: 'Frágil - manejar con cuidado',
    contactEmail: 'maria.rodriguez@email.com',
    cancellationDate: null,
    paymentMethod: 'credit',
    paymentId: 'PAY010',
    subtotal: 3200,
    discount: 320,
    state: 'finished',
    discountCode: 'MIEMBROECO',
    ecoPackaging: true
  }
];