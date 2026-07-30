import { Product, PaymentAccountDetails, ShowroomContactInfo } from '../types';

export const INITIAL_PRODUCTS: Product[] = [];

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
