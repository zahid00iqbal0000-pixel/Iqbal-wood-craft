import { Product, PaymentAccountDetails, ShowroomContactInfo } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    code: 'IWC-BED-101',
    name: 'Royal Chinioti Crown King Bedroom Suite',
    brand: 'IQBAL WOODCRAFT',
    category: 'Bedroom Furniture',
    images: [
      '/src/assets/images/iqbal_hero_bedroom_1785234338239.jpg',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 385000,
    salePrice: 325000,
    discountPercent: 15,
    material: 'Seasoned Solid Sheesham Wood with High-Relief Carving',
    woodType: 'Solid Sheesham (Chinioti Rosewood)',
    dimensions: 'King Size: L: 84" | W: 78" | Headboard H: 72" | Footboard H: 30"',
    availableColors: ['Walnut High Gloss', 'Dark Mahogany Matte', 'Antique Gold Leaf Highlights'],
    description: 'Masterpiece crafted by Senior Chinioti Artisans. Features deep floral brass-embellished wood carving on the headboard, accompanied by two grand 3-drawer side tables and a 4-drawer dressing table with a arched crystal glass mirror.',
    warranty: '10 Years Termite & Structural Wood Warranty',
    availability: 'In Stock',
    estimatedDeliveryTime: '5-7 Working Days (Cargo Bilty across Pakistan)',
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isPremiumCollection: true,
    saleOffer: 'Special Mastercraft Discount',
    reviews: [
      {
        id: 'rev-1',
        authorName: 'Mian Tariq Hassan (Lahore)',
        rating: 5,
        date: '14 July 2026',
        comment: 'Extremely high quality Sheesham wood. The carving detail is even better than expected! Delivery was safely handled via cargo to Gulberg.',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        authorName: 'Dr. Saira Alvi (Karachi DHA)',
        rating: 5,
        date: '02 June 2026',
        comment: 'I Iqbal Woodcraft team custom fitted this for my master bedroom in DHA Phase 6. Excellent finish and smooth polish!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-002',
    code: 'IWC-SOFA-201',
    name: 'Imperial Sultan 7-Seater Carved Chesterfield Sofa Set',
    brand: 'IQBAL WOODCRAFT',
    category: 'Luxury Sofa Sets',
    images: [
      '/src/assets/images/iqbal_hero_living_1785234317919.jpg',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 295000,
    salePrice: 255000,
    discountPercent: 14,
    material: 'Teak Frame, Imported Royal Turkish Velvet & High-Density Master MoltyFoam',
    woodType: 'Teak Wood (Sagwan)',
    dimensions: '3-Seater: 88" x 36" | 2-Seater: 66" x 36" | Single Chairs: 38" x 36"',
    availableColors: ['Emerald Green Velvet', 'Royal Navy Blue', 'Champagne Beige Gold'],
    description: 'Designed for opulent drawing rooms. Solid teak frame with hand-carved crown motifs along the crest and armrests. Upholstered with 10-year resilient Master MoltyFoam and liquid-repellent Turkish velvet.',
    warranty: '10 Years Frame & Foam Guarantee',
    availability: 'In Stock',
    estimatedDeliveryTime: '4-6 Working Days',
    rating: 4.8,
    reviewCount: 29,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isPremiumCollection: true,
    reviews: [
      {
        id: 'rev-3',
        authorName: 'Chaudhry Kamran (Islamabad)',
        rating: 5,
        date: '20 June 2026',
        comment: 'Comfort is unmatched. The gold highlights on the wooden frame look breathtaking in night lighting.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-003',
    code: 'IWC-DIN-301',
    name: 'Monarch 8-Chair Sheesham Dining Table with Brass Inlay',
    brand: 'IQBAL WOODCRAFT',
    category: 'Dining Tables',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 260000,
    salePrice: 220000,
    discountPercent: 15,
    material: 'Seasoned Rosewood with Handmade Brass Inlay & 12mm Beveled Tempered Glass Top',
    woodType: 'Solid Sheesham (Chinioti Rosewood)',
    dimensions: 'Table: 96" L x 44" W x 30" H | Chairs: 42" H x 20" W',
    availableColors: ['Warm Amber Sheesham', 'Walnut Brown Stain'],
    description: 'Handcrafted dining table showcasing traditional Pakistani brass inlay art (Tarkashi work) embedded seamlessly inside seasoned Sheesham wood planks.',
    warranty: '10 Years Wood & Finish Guarantee',
    availability: 'In Stock',
    estimatedDeliveryTime: '5-7 Working Days',
    rating: 4.9,
    reviewCount: 19,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isPremiumCollection: true
  },
  {
    id: 'prod-004',
    code: 'IWC-COF-401',
    name: 'Artisan Carved Nesting Coffee Table Set (3 Pcs)',
    brand: 'IQBAL WOODCRAFT',
    category: 'Coffee Tables',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 68000,
    salePrice: 55000,
    discountPercent: 19,
    material: 'Pure Sheesham Wood with Protective PU Coat',
    woodType: 'Solid Sheesham (Chinioti Rosewood)',
    dimensions: 'Main: 42" L x 24" W x 18" H | Side Tables: 18" x 18" x 20" H',
    availableColors: ['Natural Grain Sheesham', 'Dark Espresso'],
    description: 'Versatile 3-piece centerpiece coffee table set with intricate floral edge carvings and sturdy turned legs.',
    warranty: '5 Years Wood Warranty',
    availability: 'In Stock',
    estimatedDeliveryTime: '3-5 Working Days',
    rating: 4.7,
    reviewCount: 42,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: 'prod-005',
    code: 'IWC-OFF-501',
    name: 'Presidential Executive Carved Desk & Director Credenza',
    brand: 'IQBAL WOODCRAFT',
    category: 'Office Furniture',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 310000,
    salePrice: 275000,
    discountPercent: 11,
    material: 'Solid Walnut Wood with Genuine Leather Top Pad & Brass Locks',
    woodType: 'Walnut Wood (Akhrot)',
    dimensions: 'Main Desk: 78" L x 36" W x 31" H | Side Return Credenza: 48" x 18"',
    availableColors: ['Walnut Executive Brown', 'Dark Mahogany'],
    description: 'Designed for corporate executives and home offices. Includes wire management ports, concealed lockable drawers, keyboard tray, and leather writing panel.',
    warranty: '10 Years Structure Warranty',
    availability: 'In Stock',
    estimatedDeliveryTime: '5-7 Working Days',
    rating: 5.0,
    reviewCount: 14,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isPremiumCollection: true
  },
  {
    id: 'prod-006',
    code: 'IWC-CHR-601',
    name: 'Sultan High-Back Genuine Leather Executive Swivel Chair',
    brand: 'IQBAL WOODCRAFT',
    category: 'Executive Chairs',
    images: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 95000,
    salePrice: 82000,
    discountPercent: 13,
    material: 'Solid Sheesham Wooden Armrests & Base, Top-Grain Leather Upholstery',
    woodType: 'Solid Sheesham (Chinioti Rosewood)',
    dimensions: 'Height: 48"-52" Adjustable | Seat Width: 22" | Depth: 21"',
    availableColors: ['Antique Tan Brown', 'Midnight Black', 'Burgundy Wine'],
    description: 'Heavy-duty hydraulic lift mechanism, 360-degree smooth castor swivel base encased in solid wood, with ergonomic lumbar support cushions.',
    warranty: '5 Years Mechanical & Wood Warranty',
    availability: 'In Stock',
    estimatedDeliveryTime: '3-5 Working Days',
    rating: 4.8,
    reviewCount: 22,
    isFeatured: false,
    isBestSeller: true
  },
  {
    id: 'prod-007',
    code: 'IWC-WRD-701',
    name: 'Heritage 4-Door Solid Sheesham Armoire Wardrobe',
    brand: 'IQBAL WOODCRAFT',
    category: 'Wardrobes',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 240000,
    salePrice: 205000,
    discountPercent: 14,
    material: 'Seasoned Sheesham Wood Frame, Heavy-Duty Brass Handles & Soft-Close Hinges',
    woodType: 'Solid Sheesham (Chinioti Rosewood)',
    dimensions: 'Width: 84" | Depth: 24" | Height: 84"',
    availableColors: ['Walnut Finish', 'Dark Teak'],
    description: 'Four full-length doors with built-in internal mirrors, 2 security safes with code locks, coat hanging rails, and adjustable storage shelves.',
    warranty: '10 Years Wood & Termite Warranty',
    availability: 'Made To Order',
    estimatedDeliveryTime: '7-10 Working Days',
    rating: 4.9,
    reviewCount: 16,
    isFeatured: true,
    isBestSeller: false
  },
  {
    id: 'prod-008',
    code: 'IWC-TVU-801',
    name: 'Aura Floating LED Media Console & Wall TV Panel',
    brand: 'IQBAL WOODCRAFT',
    category: 'TV Units',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 115000,
    salePrice: 98000,
    discountPercent: 14,
    material: 'High-Grade MDF with Tactile Sheesham Veneer & Warm LED Strip',
    woodType: 'High-Grade MDF with Tactile Veneer',
    dimensions: 'Console Length: 84" | Depth: 16" | Wall Backing: 96" x 60"',
    availableColors: ['Smoked Walnut & Matte Charcoal', 'Teak & Pure White'],
    description: 'Sleek entertainment console designed for up to 85" TVs. Features push-to-open soft close drawers and integrated warm LED lighting.',
    warranty: '3 Years Warranty',
    availability: 'In Stock',
    estimatedDeliveryTime: '4-6 Working Days',
    rating: 4.7,
    reviewCount: 31,
    isFeatured: false,
    isBestSeller: true
  },
  {
    id: 'prod-009',
    code: 'IWC-DRS-901',
    name: 'Chinioti Floral Carved Dressing Table with Stool',
    brand: 'IQBAL WOODCRAFT',
    category: 'Dressing Tables',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 125000,
    salePrice: 108000,
    discountPercent: 13,
    material: 'Solid Sheesham Wood with High Clarity Belgian Mirror',
    woodType: 'Solid Sheesham (Chinioti Rosewood)',
    dimensions: 'Width: 48" | Depth: 18" | Total Height: 78"',
    availableColors: ['Rosewood Amber', 'Antique Antique Gold Highlight'],
    description: 'Hand-carved vanity console featuring 5 velvet-lined drawers for jewelry, crystal clear arched mirror, and a plush upholstered wooden bench.',
    warranty: '10 Years Wood Guarantee',
    availability: 'In Stock',
    estimatedDeliveryTime: '4-6 Working Days',
    rating: 4.9,
    reviewCount: 25
  },
  {
    id: 'prod-010',
    code: 'IWC-STD-1001',
    name: 'Ergonomic Study Desk with Bookshelf Hutch',
    brand: 'IQBAL WOODCRAFT',
    category: 'Study Tables',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 78000,
    salePrice: 65000,
    discountPercent: 16,
    material: 'Solid Teak Wood with Satin PU Coating',
    woodType: 'Teak Wood (Sagwan)',
    dimensions: 'Width: 54" | Depth: 24" | Desk Height: 30" | Hutch Height: 60"',
    availableColors: ['Natural Teak', 'Honey Oak'],
    description: 'Perfect for students and working professionals. Features overhead book storage shelves, drawer locks, and integrated cable pass-through.',
    warranty: '5 Years Wood Warranty',
    availability: 'In Stock',
    estimatedDeliveryTime: '3-5 Working Days',
    rating: 4.8,
    reviewCount: 18
  },
  {
    id: 'prod-011',
    code: 'IWC-KID-1101',
    name: 'Junior Adventure Wooden Bunk Bed & Storage Drawers',
    brand: 'IQBAL WOODCRAFT',
    category: 'Kids Furniture',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 165000,
    salePrice: 145000,
    discountPercent: 12,
    material: 'Solid Pine & Oak Wood with Non-Toxic Eco-Friendly Varnish',
    woodType: 'Oak Wood',
    dimensions: 'Length: 78" | Width: 42" | Height: 66" (Fits 3x6 ft Mattresses)',
    availableColors: ['Natural Oak White', 'Pastel Blue Accent', 'Pastel Pink Accent'],
    description: 'Safe rounded edge child safety guardrails, sturdy wooden ladder steps with built-in toy storage drawers beneath the lower bed.',
    warranty: '5 Years Structure Guarantee',
    availability: 'Made To Order',
    estimatedDeliveryTime: '7-10 Working Days',
    rating: 4.9,
    reviewCount: 11
  },
  {
    id: 'prod-012',
    code: 'IWC-OUT-1201',
    name: 'Teak Heritage Garden Bench & Patio Nook Set',
    brand: 'IQBAL WOODCRAFT',
    category: 'Outdoor Furniture',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 88000,
    salePrice: 75000,
    discountPercent: 14,
    material: '100% Water-Resistant Seasoned Teak Wood with Marine Sealant',
    woodType: 'Teak Wood (Sagwan)',
    dimensions: 'Bench: 60" L x 24" W x 36" H | Side Table: 20" x 20"',
    availableColors: ['Weather-Resistant Golden Teak'],
    description: 'Engineered specifically for outdoor lawn, terrace, and patio spaces in Pakistan weather conditions.',
    warranty: '5 Years All-Weather Guarantee',
    availability: 'In Stock',
    estimatedDeliveryTime: '3-5 Working Days',
    rating: 4.8,
    reviewCount: 15
  },
  {
    id: 'prod-013',
    code: 'IWC-ACC-1301',
    name: 'Grand Royal Hand-Carved Sheesham Wall Mirror',
    brand: 'IQBAL WOODCRAFT',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 38000,
    salePrice: 29000,
    discountPercent: 23,
    material: 'Solid Sheesham Wood with Gold Leaf Hand Polish',
    woodType: 'Solid Sheesham (Chinioti Rosewood)',
    dimensions: 'Frame Dimensions: 48" Height x 36" Width',
    availableColors: ['Antique Gold Leaf', 'Walnut Brown'],
    description: 'Statement carved mirror frame for entryway foyers, dining rooms, and luxury drawing rooms.',
    warranty: '5 Years Frame Warranty',
    availability: 'In Stock',
    estimatedDeliveryTime: '3 Working Days',
    rating: 5.0,
    reviewCount: 47
  }
];

export const INITIAL_PAYMENT_DETAILS: PaymentAccountDetails = {
  bankName: 'Meezan Bank Limited (Official Business Account)',
  accountTitle: 'IQBAL WOODCRAFT',
  accountNumber: '0102-0104859201',
  iban: 'PK36MEZN0001020104859201',
  branchCode: '0102 (DHA Phase 6 Commercial Branch Karachi)',
  jazzCashTitle: 'Muhammad Zahid Iqbal (Iqbal Woodcraft Sales)',
  jazzCashNumber: '0302-0940219',
  easyPaisaTitle: 'Muhammad Shahid Iqbal (Iqbal Woodcraft Mgr)',
  easyPaisaNumber: '0305-9453188',
  note: 'ATTENTION: As per IQBAL WOODCRAFT official payment policy, Cash On Delivery (COD) is strictly NOT available. Every order requires 100% Advance Payment via Bank Transfer, JazzCash, or EasyPaisa. Woodcrafting production and cargo dispatch will commence immediately upon payment verification by our admin team.'
};

export const SHOWROOM_CONTACT: ShowroomContactInfo = {
  ceo: 'Muhammad Iqbal',
  ceoPhone: '0301-2549688',
  businessManager: 'Muhammad Shahid Iqbal',
  bmPhone: '0305-9453188',
  salesAndApp: 'Muhammad Zahid Iqbal',
  salesPhone: '0302-0940219',
  whatsappBusiness: '0309-3509242',
  email: 'iqbalwoodcraft@gmail.com',
  address: 'Khayaban-e-Ittehad, Muslim Commercial Street No. 2, Near Clock Tower, DHA Phase 6, Karachi, Pakistan',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.5627231792676!2d67.06822!3d24.80822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33c5e88e1e75d%3A0x8e82104bfd9d8328!2sDHA%20Phase%206%20Karachi!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk',
  businessHours: 'Monday - Saturday: 10:00 AM - 10:00 PM PKT (Sunday by Appointment)'
};

export const INITIAL_FAQS = [
  {
    id: 'faq-1',
    question: 'What are your payment terms and available payment methods?',
    answer: 'IQBAL WOODCRAFT requires 100% advance payment before production or cargo dispatch. We accept Bank Transfer (Meezan Bank), JazzCash (0302-0940219), and EasyPaisa (0305-9453188). Cash on Delivery (COD) is strictly NOT available due to high-value custom handcrafted timber furniture.',
    category: 'Payment' as const
  },
  {
    id: 'faq-2',
    question: 'How is delivery handled across Pakistan?',
    answer: 'We dispatch all order items via insured heavy cargo bilty (e.g., NLC, TCS Cargo, Baloch Cargo) to Lahore, Islamabad, Faisalabad, Multan, Peshawar, Quetta, and all major cities in Pakistan with full wood protective frame packaging.',
    category: 'Delivery' as const
  },
  {
    id: 'faq-3',
    question: 'What type of wood do you use for your furniture?',
    answer: 'We use 100% Solid Seasoned Sheesham Wood (Chinioti Rosewood), Premium Teak Wood (Sagwan), and Walnut Wood. Every piece undergoes a 30-day kiln drying process to prevent warping and moisture cracks.',
    category: 'Products' as const
  },
  {
    id: 'faq-4',
    question: 'Does Iqbal Woodcraft offer a warranty?',
    answer: 'Yes! Every solid timber product comes with an official 10-Year Termite Guarantee and Structural Integrity Warranty.',
    category: 'Warranty' as const
  },
  {
    id: 'faq-5',
    question: 'Can I request custom sized furniture or custom designs?',
    answer: 'Absolutely! Our AI Assistant can guide you through a Custom Furniture Request wizard right here, or you can submit custom dimensions, wood choices, and reference photos to our master artisans for an instant estimate.',
    category: 'Custom Furniture' as const
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-101',
    customerName: 'Chaudhry Kamran',
    phone: '0300-8472910',
    lastActive: '2026-07-28T02:15:00.000Z',
    status: 'Custom Request Submitted' as const,
    messages: [
      {
        id: 'm-1',
        sender: 'ai' as const,
        text: 'Assalam-o-Alaikum! Welcome to IQBAL WOODCRAFT AI Assistant. How may I assist your home furniture selection today?',
        timestamp: '10:00 AM'
      },
      {
        id: 'm-2',
        sender: 'user' as const,
        text: 'I want a 12-seater dining table in Sheesham wood for my dining hall in Islamabad.',
        timestamp: '10:01 AM'
      },
      {
        id: 'm-3',
        sender: 'ai' as const,
        text: 'Great choice! Our Solid Sheesham Chinioti carved dining tables are hand-engraved with glass top options and 100% advance payment required. I have initiated a Custom Furniture Request for Chaudhry Kamran.',
        timestamp: '10:02 AM',
        isCustomOrderSuccess: true,
        customOrderRefId: 'cust-1785234910'
      }
    ]
  }
];

