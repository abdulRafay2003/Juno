// Dummy data centralized from various screens

import {Colors, Images, Metrix, NavigationService} from '@/config';
import {RouteNames} from '@/config/routes';
import {openDialer} from '@/utils/business.helper';
import moment from 'moment';
import {Linking} from 'react-native';

export const salutationData = [
  {label: 'Mr.', value: 'Mr.'},
  {label: 'Ms.', value: 'Ms.'},
  {label: 'Dr.', value: 'Dr.'},
  {label: 'Miss', value: 'Miss'},
  {label: 'Mrs.', value: 'Mrs.'},
  {label: 'Prof.', value: 'Prof.'},
  {label: 'Mx.', value: 'Mx.'},
];

export const genderData = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
];

export const overviewData = [
  {
    name: 'Alice Johnson',
    agency: 'Seria by Beyond',
    unit: 'Unit 101',
    type: '1BHK',
    building: 'Seaside Heights',
    booking: '15 Aug 2024',
    price: '150,000,000',
  },
  {
    name: 'Alice Johnson',
    agency: 'Seria by Beyond',
    unit: 'Unit 101',
    type: '1BHK',
    building: 'Seaside Heights',
    booking: '15 Aug 2024',
    price: '150,000,000',
  },
  {
    name: 'Alice Johnson',
    agency: 'Seria by Beyond',
    unit: 'Unit 101',
    type: '1BHK',
    building: 'Seaside Heights',
    booking: '15 Aug 2024',
    price: '150,000,000',
  },
  {
    name: 'Alice Johnson',
    agency: 'Seria by Beyond',
    unit: 'Unit 101',
    type: '1BHK',
    building: 'Seaside Heights',
    booking: '15 Aug 2024',
    price: '150,000,000',
  },
  {
    name: 'Alice Johnson',
    agency: 'Seria by Beyond',
    unit: 'Unit 101',
    type: '1BHK',
    building: 'Seaside Heights',
    booking: '15 Aug 2024',
    price: '150,000,000',
  },
  {
    name: 'Alice Johnson',
    agency: 'Seria by Beyond',
    unit: 'Unit 101',
    type: '1BHK',
    building: 'Seaside Heights',
    booking: '15 Aug 2024',
    price: '150,000,000',
  },
  {
    name: 'Alice Johnson',
    agency: 'Seria by Beyond',
    unit: 'Unit 101',
    type: '1BHK',
    building: 'Seaside Heights',
    booking: '15 Aug 2024',
    price: '150,000,000',
  },
  {
    name: 'Alice Johnson',
    agency: 'Seria by Beyond',
    unit: 'Unit 101',
    type: '1BHK',
    building: 'Seaside Heights',
    booking: '15 Aug 2024',
    price: '150,000,000',
  },
];

export const eoiData = [
  {
    seq: 'Alice Johnson',
    agency: 'The Mural',
    refNo: 'L85413',
    buyerType: 'Individual',
    deposit: '37,000',
    paymentMethod: 'Bank Transfer',
    status: 'EOI Created' as 'EOI Created',
  },
  {
    seq: 'Alice Johnson',
    agency: 'The Mural',
    refNo: 'L85413',
    buyerType: 'Individual',
    deposit: '37,000',
    paymentMethod: 'Bank Transfer',
    status: 'Partially Allocated' as 'Partially Allocated',
  },
  {
    seq: 'Alice Johnson',
    agency: 'The Mural',
    refNo: 'L85413',
    buyerType: 'Individual',
    deposit: '37,000',
    paymentMethod: 'Bank Transfer',
    status: 'Confirmed' as 'Confirmed',
  },
  {
    seq: 'Alice Johnson',
    agency: 'The Mural',
    refNo: 'L85413',
    buyerType: 'Individual',
    deposit: '37,000',
    paymentMethod: 'Bank Transfer',
    status: 'Refunded' as 'Refunded',
  },
  {
    seq: 'Alice Johnson',
    agency: 'The Mural',
    refNo: 'L85413',
    buyerType: 'Individual',
    deposit: '37,000',
    paymentMethod: 'Bank Transfer',
    status: 'Allocated' as 'Allocated',
  },
  {
    seq: 'Alice Johnson',
    agency: 'The Mural',
    refNo: 'L85413',
    buyerType: 'Individual',
    deposit: '37,000',
    paymentMethod: 'Bank Transfer',
    status: 'Confirmed' as 'Confirmed',
  },
  {
    seq: 'Alice Johnson',
    agency: 'The Mural',
    refNo: 'L85413',
    buyerType: 'Individual',
    deposit: '37,000',
    paymentMethod: 'Bank Transfer',
    status: 'Refunded' as 'Refunded',
  },
  {
    seq: 'Alice Johnson',
    agency: 'The Mural',
    refNo: 'L85413',
    buyerType: 'Individual',
    deposit: '37,000',
    paymentMethod: 'Bank Transfer',
    status: 'Allocated' as 'Allocated',
  },
  {
    seq: 'Alice Johnson',
    agency: 'The Mural',
    refNo: 'L85413',
    buyerType: 'Individual',
    deposit: '37,000',
    paymentMethod: 'Bank Transfer',
    status: 'Refunded' as 'Refunded',
  },
  {
    seq: 'Alice Johnson',
    agency: 'The Mural',
    refNo: 'L85413',
    buyerType: 'Individual',
    deposit: '37,000',
    paymentMethod: 'Bank Transfer',
    status: 'Allocated' as 'Allocated',
  },
];

export const leadsData = [
  {
    name: 'Shahid Ali',
    agency: 'Saria by Beyond',
    refId: 'L85413',
    type: '1BHK',
    property: 'Villa',
    status: 'Pre-Qualified' as 'Pre-Qualified',
  },
  {
    name: 'Shahid Ali',
    agency: 'Saria by Beyond',
    refId: 'L85413',
    type: '1BHK',
    property: 'Villa',
    status: 'Junk' as 'Junk',
  },
  {
    name: 'Shahid Ali',
    agency: 'Saria by Beyond',
    refId: 'L85413',
    type: '1BHK',
    property: 'Villa',
    status: 'Converted' as 'Converted',
  },
  {
    name: 'Shahid Ali',
    agency: 'Saria by Beyond',
    refId: 'L85413',
    type: '1BHK',
    property: 'Villa',
    status: 'Disqualified' as 'Disqualified',
  },
  {
    name: 'Shahid Ali',
    agency: 'Saria by Beyond',
    refId: 'L85413',
    type: '1BHK',
    property: 'Villa',
    status: 'Pre-Qualified' as 'Pre-Qualified',
  },
  {
    name: 'Shahid Ali',
    agency: 'Saria by Beyond',
    refId: 'L85413',
    type: '1BHK',
    property: 'Villa',
    status: 'Converted' as 'Converted',
  },
  {
    name: 'Shahid Ali',
    agency: 'Saria by Beyond',
    refId: 'L85413',
    type: '1BHK',
    property: 'Villa',
    status: 'Disqualified' as 'Disqualified',
  },
  {
    name: 'Shahid Ali',
    agency: 'Saria by Beyond',
    refId: 'L85413',
    type: '1BHK',
    property: 'Villa',
    status: 'Pre-Qualified' as 'Pre-Qualified',
  },
  {
    name: 'Shahid Ali',
    agency: 'Saria by Beyond',
    refId: 'L85413',
    type: '1BHK',
    property: 'Villa',
    status: 'Pre-Qualified' as 'Pre-Qualified',
  },
  {
    name: 'Shahid Ali',
    agency: 'Saria by Beyond',
    refId: 'L85413',
    type: '1BHK',
    property: 'Villa',
    status: 'Junk' as 'Junk',
  },
];

export const salesOfferData = [
  {
    name: 'Saria by Beyond',
    agency: 'Saria',
    soNo: 'SO-12573',
    unitName: '0003',
    type: '2BHK',
    price: 'AED 1,50,000',
    status: 'In-Process' as 'In-Process',
  },
  {
    name: 'Saria by Beyond',
    agency: 'Saria',
    soNo: 'SO-12573',
    unitName: '0003',
    type: '2BHK',
    price: 'AED 1,50,000',
    status: 'Generated' as 'Generated',
  },
  {
    name: 'Saria by Beyond',
    agency: 'Saria',
    soNo: 'SO-12573',
    unitName: '0003',
    type: '2BHK',
    price: 'AED 1,50,000',
    status: 'In-Process' as 'In-Process',
  },
  {
    name: 'Saria by Beyond',
    agency: 'Saria',
    soNo: 'SO-12573',
    unitName: '0003',
    type: '2BHK',
    price: 'AED 1,50,000',
    status: 'Generated' as 'Generated',
  },
  {
    name: 'Saria by Beyond',
    agency: 'Saria',
    soNo: 'SO-12573',
    unitName: '0003',
    type: '2BHK',
    price: 'AED 1,50,000',
    status: 'In-Process' as 'In-Process',
  },
  {
    name: 'Saria by Beyond',
    agency: 'Saria',
    soNo: 'SO-12573',
    unitName: '0003',
    type: '2BHK',
    price: 'AED 1,50,000',
    status: 'Generated' as 'Generated',
  },
  {
    name: 'Saria by Beyond',
    agency: 'Saria',
    soNo: 'SO-12573',
    unitName: '0003',
    type: '2BHK',
    price: 'AED 1,50,000',
    status: 'In-Process' as 'In-Process',
  },
  {
    name: 'Saria by Beyond',
    agency: 'Saria',
    soNo: 'SO-12573',
    unitName: '0003',
    type: '2BHK',
    price: 'AED 1,50,000',
    status: 'Generated' as 'Generated',
  },
  {
    name: 'Saria by Beyond',
    agency: 'Saria',
    soNo: 'SO-12573',
    unitName: '0003',
    type: '2BHK',
    price: 'AED 1,50,000',
    status: 'In-Process' as 'In-Process',
  },
  {
    name: 'Saria by Beyond',
    agency: 'Saria',
    soNo: 'SO-12573',
    unitName: '0003',
    type: '2BHK',
    price: 'AED 1,50,000',
    status: 'Generated' as 'Generated',
  },
];

export const notificationsData = [
  {
    id: '1',
    title: 'Commission received for unit #012',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page.',
    time: 'Just now',
    isUnread: true,
  },
  {
    id: '2',
    title: 'Invoice generated for unit #020',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '10 minutes ago',
    isUnread: false,
  },
  {
    id: '3',
    title: 'Refund issued for unit #022',
    description:
      'To be or not to be, that is the question for every creative project.',
    time: '20 minutes ago',
    isUnread: false,
  },
  {
    id: '4',
    title: 'Payment declined for unit #014',
    description:
      'Creativity takes courage, and every step counts in the design process.',
    time: '30 minutes ago',
    isUnread: false,
  },
  {
    id: '5',
    title: 'Deposit received for unit #021',
    description:
      'Simplicity is the ultimate sophistication in any creative endeavor.',
    time: '40 minutes ago',
    isUnread: false,
  },
  {
    id: '6',
    title: 'Refund issued for unit #022',
    description:
      'To be or not to be, that is the question for every creative project.',
    time: '20 minutes ago',
    isUnread: false,
  },
  {
    id: '7',
    title: 'Payment declined for unit #014',
    description:
      'Creativity takes courage, and every step counts in the design process.',
    time: '30 minutes ago',
    isUnread: false,
  },
  {
    id: '8',
    title: 'Deposit received for unit #021',
    description:
      'Simplicity is the ultimate sophistication in any creative endeavor.',
    time: '40 minutes ago',
    isUnread: false,
  },
];

export const announcementsData = [
  {
    id: '1',
    title: 'Commission received for unit #012',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page.',
    time: 'Just now',
    isUnread: true,
  },
  {
    id: '2',
    title: 'Invoice generated for unit #020',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '10 minutes ago',
    isUnread: false,
  },
  {
    id: '3',
    title: 'Refund issued for unit #022',
    description:
      'To be or not to be, that is the question for every creative project.',
    time: '20 minutes ago',
    isUnread: false,
  },
  {
    id: '4',
    title: 'Partnership Agreement finalized for unit #014',
    description:
      'Creativity takes courage, and every step counts in the design process.',
    time: '30 minutes ago',
    isUnread: false,
  },
  {
    id: '5',
    title: 'Deposit received for unit #021',
    description:
      'Simplicity is the ultimate sophistication in any creative endeavor.',
    time: '40 minutes ago',
    isUnread: false,
  },
  {
    id: '6',
    title: 'Invoice generated for unit #020',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '10 minutes ago',
    isUnread: false,
  },
  {
    id: '7',
    title: 'Refund issued for unit #022',
    description:
      'To be or not to be, that is the question for every creative project.',
    time: '20 minutes ago',
    isUnread: false,
  },
  {
    id: '8',
    title: 'Partnership Agreement finalized for unit #014',
    description:
      'Creativity takes courage, and every step counts in the design process.',
    time: '30 minutes ago',
    isUnread: false,
  },
];

export const dashboardLineChartData = [
  {value: 40000000},
  {value: 30000000},
  {value: 60000000},
  {value: 29000000},
  {value: 75000000},
  {value: 99000000},
  {value: 87000000},
  {value: 100000000},
  {value: 55000000},
  {value: 40000000},
  {value: 40000000},
  {value: 40000000},
];

export const lineChartYAxisData = [
  {value: '100M'},
  {value: '50M'},
  {value: '10M'},
  {value: '1M'},
  {value: '500K'},
];

export const dashboardAnnouncementsData = [
  {
    title: 'Exclusive launch event for unit #015',
    description:
      'Join us for a special preview of our latest property offerings, showcasing modern living at its finest.',
    time: 'In 1 hour',
    isUnread: true,
  },
  {
    title: 'New project announcement: Green Valley Estates',
    description:
      'We are excited to unveil our newest development, set in serene environment with top-notch amenities.',
    time: 'Today at 10 AM',
    isUnread: false,
  },
];

export const registerationCardData = [
  {
    title: 'Commercial & Freelancer - UAE',
    description:
      'Launch your business in the UAE to access a vibrant market and benefit from its strategic location. This registration ensures compliance with local regulations and unlocks various growth avenues.',
    image: Images.Registeration_1, // Set Images.Registeration_1 in Registeration
  },
  {
    title: 'Commercial & Freelancer - International',
    description:
      'Launch your business in the UAE to access a vibrant market and benefit from its strategic location. This registration ensures compliance with local regulations and unlocks various growth avenues.',
    image: Images.Registeration_2, // Set Images.Registeration_2 in Registeration
  },
];

export const commissionData = [
  {
    name: 'Rahul Verma',
    agency: 'Saria by Beyond',
    refNo: 'CD-0010',
    unit: 'TES/12/1234',
    value: '1.2M',
    commission: '5%',
    amount: 'AED 60,000',
    status: 'Outstanding',
    buttonType: 'Upload Invoice',
  },
  {
    name: 'Vikram Joshi',
    agency: 'Saria by Beyond',
    refNo: 'Basit',
    unit: 'TES/12/1234',
    value: '1.2M',
    commission: '5%',
    amount: 'AED 60,000',
    status: 'Paid',
    buttonType: 'Download',
  },
  {
    name: 'Anil Kapoor',
    agency: 'Saria by Beyond',
    refNo: 'CD-0010',
    unit: 'TES/12/1234',
    value: '1.2M',
    commission: '5%',
    amount: 'AED 60,000',
    status: 'Outstanding',
    buttonType: 'Upload Invoice',
  },
  {
    name: 'Siddharth Gupta',
    agency: 'Saria by Beyond',
    refNo: 'CD-0010',
    unit: 'TES/12/1234',
    value: '1.2M',
    commission: '5%',
    amount: 'AED 60,000',
    status: 'Outstanding',
    buttonType: 'Upload Invoice',
  },
  {
    name: 'Vikram Joshi',
    agency: 'Saria by Beyond',
    refNo: 'Basit',
    unit: 'TES/12/1234',
    value: '1.2M',
    commission: '5%',
    amount: 'AED 60,000',
    status: 'Paid',
    buttonType: 'Download',
  },
  {
    name: 'Anil Kapoor',
    agency: 'Saria by Beyond',
    refNo: 'CD-0010',
    unit: 'TES/12/1234',
    value: '1.2M',
    commission: '5%',
    amount: 'AED 60,000',
    status: 'Outstanding',
    buttonType: 'Upload Invoice',
  },
  {
    name: 'Siddharth Gupta',
    agency: 'Saria by Beyond',
    refNo: 'CD-0010',
    unit: 'TES/12/1234',
    value: '1.2M',
    commission: '5%',
    amount: 'AED 60,000',
    status: 'Outstanding',
    buttonType: 'Upload Invoice',
  },
];

export const announcementDetailsHtml = `
  <h2>Exciting News: Launch of the Digital Transformation Initiative 2026!</h2>
  <h3>Overview</h3>
  <p>
    We are <strong>thrilled</strong> to announce the official launch of the Digital Transformation Initiative 2026!
    This ambitious project is designed to fundamentally reshape our operational processes and significantly enhance
    user engagement through the adoption of innovative technological solutions.
  </p>
  <h3>Our Commitment</h3>
  <p>
    Our dedicated team is committed to implementing <strong>state-of-the-art strategies</strong> that will not only
    streamline workflows but also improve communication and foster collaboration across all departments. By leveraging
    the latest advancements in technology, we aim to create a more integrated and efficient working environment.
  </p>
  <h3>Stay Updated</h3>
  <p>
    As we embark on this transformative journey together, we encourage you to stay tuned for regular updates. This
    initiative represents a pivotal step towards a more dynamic and responsive future, and we are excited to pave the
    way for enhanced productivity and user satisfaction!
  </p>
`;

export const agentsData = [
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason.mamoa11090@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
  {
    name: 'Jason Mamoa',
    designation: 'Sales Manager',
    email: 'jason@gmail.com',
    agentNo: 'AE-1669',
    role: 'Broker',
    mobile: '+971 12334 453',
    status: 'Active',
  },
];
export const statusStyles = {
  'Pre-Qualified': {
    borderColor: Colors.YellowBadge('1'),
    color: Colors.YellowBadge('1'),
    backgroundColor: Colors.YellowBadge('0.1'),
  },
  Junk: {
    borderColor: Colors.GreyBadge('1'),
    color: Colors.GreyBadge('1'),
    backgroundColor: Colors.GreyBadge('0.1'),
  },
  Converted: {
    borderColor: Colors.GreenBadge('1'),
    color: Colors.GreenBadge('1'),
    backgroundColor: Colors.GreenBadge('0.1'),
  },
  Disqualified: {
    borderColor: Colors.RedBadge('1'),
    color: Colors.RedBadge('1'),
    backgroundColor: Colors.RedBadge('0.1'),
  },
  Outstanding: {
    borderColor: Colors.GreyBadge('1'),
    color: Colors.GreyBadge('1'),
    backgroundColor: Colors.GreyBadge('0.1'),
  },
  Paid: {
    borderColor: Colors.GreenBadge('1'),
    color: Colors.GreenBadge('1'),
    backgroundColor: Colors.GreenBadge('0.1'),
  },
};

export const ADMIN_TABS = [
  'Personal',
  'Agency Info',
  'Signatory',
  'Bank Details',
  'Documents',
];
export const AGENT_TABS = ['Personal', 'Account', 'Documents'];

export const AGENCY_INFO = {
  title: 'Agency Information',

  list: [
    {
      id: 1,
      title: 'Agency Name',
      value: 'Agency Noon',
    },
    {
      id: 2,
      title: 'Trade License Category',
      value: 'DED',
    },
    {
      id: 3,
      title: 'Trade license Number',
      value: '515165303',
    },
    {
      id: 4,
      title: 'Trade License Expiry Date',
      value: '2028-12-15',
    },
    {
      id: 5,
      title: 'Company Email',
      value: 'contact@agencynoon.ae',
    },
    {
      id: 6,
      title: 'Company Phone',
      value: '+971 8512 2512 25',
    },
    {
      id: 7,
      title: 'Property Consultant',
      value: 'Agency Omega',
    },
    {
      id: 8,
      title: 'Address Line 1',
      value: '26th Floor, One by OMNIYAT Business Bay',
    },
    {
      id: 9,
      title: 'Address Line 2',
      value: '26th Floor, One by OMNIYAT Business Bay',
    },
    {
      id: 10,
      title: 'Country',
      value: 'Dubai',
    },
    {
      id: 11,
      title: 'City',
      value: '',
    },
    {
      id: 12,
      title: 'P.O. Box',
      value: '654321',
    },
    {
      id: 12,
      title: 'Company RERA Number',
      value: '5678',
    },
    {
      id: 12,
      title: 'Company RERA Registration Expiry',
      value: '2028-12-15',
    },
    {
      id: 12,
      title: 'Have TRN',
      value: 'Yes',
    },
    {
      id: 13,
      title: 'TRN Number',
      value: '6515063',
    },
    {
      id: 14,
      title: 'Ownership',
      value: 'Sole Proprietary',
    },
  ],
};

export const SIGNATORY_INFO = {
  title: 'Signatory Details',

  list: [
    {
      id: 1,
      title: 'First Name',
      value: 'John',
    },
    {
      id: 2,
      title: 'Last Name',
      value: 'Smith',
    },
    {
      id: 3,
      title: 'Emirate ID Number',
      value: '1234567890',
    },
    {
      id: 4,
      title: 'EID Expiry Date',
      value: '2028-12-15',
    },
    {
      id: 5,
      title: 'Passport Number',
      value: '784-1234-567890 1-2',
    },
    {
      id: 6,
      title: 'Passport Issue Place',
      value: 'Dubai',
    },
    {
      id: 7,
      title: 'Passport Expiry Date',
      value: '2028-12-15',
    },
    {
      id: 8,
      title: 'Signatory Mobile',
      value: '+971 4 567 8901',
    },
    {
      id: 9,
      title: 'Signatory Email',
      value: 'johnsmith@agencynoon.ae',
    },
    {
      id: 10,
      title: 'Role',
      value: 'Owner',
    },
    {
      id: 11,
      title: 'Designation',
      value: 'Admin',
    },
    {
      id: 12,
      title: 'Broker RERA Number',
      value: '1234-5678-91011-1',
    },
    {
      id: 13,
      title: 'RERA Expiry Date',
      value: '10/30/2028',
    },
  ],
};

export const BANK_DETAILS = {
  title: 'Bank Information',

  list: [
    {
      id: 1,
      title: 'Bank Name',
      value: 'Commercial Bank of Dubai',
    },
    {
      id: 2,
      title: 'Account Number',
      value: 'AE12345678901234567890',
    },
    {
      id: 3,
      title: 'Beneficiary Name',
      value: 'Ahmed Khan',
    },
    {
      id: 4,
      title: 'IBAN',
      value: 'AE12 3456 7890 1234 5678 9012 345',
    },
    {
      id: 5,
      title: 'Swift Code',
      value: 'AE12 3456',
    },
    {
      id: 6,
      title: 'Currency',
      value: 'AED',
    },
    {
      id: 7,
      title: 'Branch Name',
      value: 'Bur Dubai Branch',
    },
    {
      id: 8,
      title: 'Address',
      value: 'Al Mankhool St.Opp. Al Khaleej Center',
    },
  ],
};

export const LEAD_INFO = {
  heading: 'Lead Information',
  list: [
    {
      id: 1,
      title: 'First Name',
      value: 'Danish',
    },
    {
      id: 2,
      title: 'Last Name',
      value: 'Ali',
    },
    {
      id: 3,
      title: 'Gender',
      value: 'Male',
    },
    {
      id: 4,
      title: 'Date of birth',
      value: '20-07-1992',
    },
    {
      id: 5,
      title: 'Mobile Number',
      value: '+971 23343 566',
    },
    {
      id: 6,
      title: 'Nationality',
      value: 'Dubai',
    },
    {
      id: 7,
      title: 'Residence',
      value: 'United Arab Emirates',
    },
    {
      id: 8,
      title: 'Email',
      value: 'danishali@beyond.ae',
    },
  ],
  details: {
    salutation: 'Mr.',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+1-202-555-0136',
    gender: 'Male',
    email: 'john.doe@example.com',
    country: 'United States',
    language: 'English',
    date_of_birth: '1990-06-15',
    nationality: 'American',
    sales_manager: 'Jane Smith',
  },
  interests: {
    proprty_type: 'Villa',
    project: 'Aldhay',
    campaign: 'Arabian Oasis Realty',
  },
};

export const INTEREST_INFO = {
  heading: 'Interest Details',
  list: [
    {
      id: 1,
      title: 'Project',
      value: 'Aldhay',
    },
    {
      id: 2,
      title: 'Property Type',
      value: 'Villa',
    },
    {
      id: 3,
      title: 'Campaign',
      value: 'Arabian Oasis Realty',
    },
  ],
};

export const ProjectNames = [
  {label: 'Dubai Marina Heights', value: 'Dubai Marina Heights'},
  {label: 'Palm Jumeirah Oasis', value: 'Palm Jumeirah Oasis'},
  {label: 'Burj Khalifa Residence', value: 'Burj Khalifa Residence'},
  {label: 'Jumeirah Beachfront Villas', value: 'Jumeirah Beachfront Villas'},
  {label: 'Downtown Dubai Living', value: 'Downtown Dubai Living'},
  {label: 'Dubai Hills Estate', value: 'Dubai Hills Estate'},
];

export const LIST_DATA = ['Sole Proprietary', 'Partnership'];

export const tradeLicenseCategoryData = [
  {label: 'Ded', value: 'DED'},
  {label: 'Freezone', value: 'Freezone'},
];

export const haveTrnData = [
  {label: 'Yes', value: 'Yes'},
  {label: 'No', value: 'No'},
];

export const roleData = [
  {label: 'Authorize Signatory', value: 'Authorize Signatory'},
  {label: 'Owner / Authorize Signatory', value: 'Owner / Authorize Signatory'},
  {label: 'Owner', value: 'Owner'},
];

export const bankCountryData = [
  {label: 'AED', value: 'AED'},
  {label: 'EUR', value: 'EUR'},
  {label: 'GBP', value: 'GBP'},
  {label: 'USD', value: 'USD'},
];

export const CountryData = [
  {label: 'Pakistan', value: 'Pakistan'},
  {label: 'India', value: 'India'},
  {label: 'Iran', value: 'Iran'},
  {label: 'Afghanstan', value: 'Afghanstan'},
];
export const CitiesData = [
  {label: 'Karachi', value: 'Karachi'},
  {label: 'Islamabad', value: 'Islamabad'},
  {label: 'Lahore', value: 'Lahore'},
];
export const RegistrationSteps = [
  {id: 1, title: 'Company Information'},
  {id: 2, title: 'Signatory Details'},
  {id: 3, title: 'Bank Information'},
  {id: 4, title: 'Documents'},
];

export const FreelancerSteps = [
  {id: 1, title: 'Freelancer Information'},
  {id: 2, title: 'Bank Information'},
  {id: 3, title: 'Documents'},
];

export const nationalityData = [
  {label: 'Afghan', value: 'Afghan'},
  {label: 'Albanian', value: 'Albanian'},
  {id: 3, value: 'Algerian', label: 'Algerian'},
  {id: 4, value: 'American', label: 'American'},
  {id: 5, value: 'Andorran', label: 'Andorran'},
  {id: 6, value: 'Angolan', label: 'Angolan'},
  {id: 7, value: 'Antiguan and Barbudan', label: 'Antiguan and Barbudan'},
  {id: 8, value: 'Argentine', label: 'Argentine'},
  {id: 9, value: 'Armenian', label: 'Armenian'},
  {id: 10, value: 'Australian', label: 'Australian'},
  {id: 11, value: 'Austrian', label: 'Austrian'},
  {id: 12, value: 'Azerbaijani', label: 'Azerbaijani'},
  {id: 13, value: 'Bahraini', label: 'Bahraini'},
  {id: 14, value: 'Bangladeshi', label: 'Bangladeshi'},
  {id: 15, value: 'Belarusian', label: 'Belarusian'},
  {id: 16, value: 'Belgian', label: 'Belgian'},
  {id: 17, value: 'Bosnia and Herzegovina', label: 'Bosnia and Herzegovina'},
  {id: 18, value: 'Brazilian', label: 'Brazilian'},
  {id: 19, value: 'British', label: 'British'},
  {id: 20, value: 'Bulgarian', label: 'Bulgarian'},
  {id: 21, value: 'Burkinese', label: 'Burkinese'},
  {id: 22, value: 'Cameroonian', label: 'Cameroonian'},
  {id: 23, value: 'Canadian', label: 'Canadian'},
  {id: 24, value: 'Chadian', label: 'Chadian'},
  {id: 25, value: 'Chinese', label: 'Chinese'},
  {id: 26, value: 'Colombian', label: 'Colombian'},
  {id: 27, value: 'Congolese', label: 'Congolese'},
  {id: 28, value: 'Croatian', label: 'Croatian'},
  {id: 29, value: 'Cypriot', label: 'Cypriot'},
  {id: 30, value: 'Czech', label: 'Czech'},
  {id: 31, value: 'Danish', label: 'Danish'},
  {id: 32, value: 'Djiboutian', label: 'Djiboutian'},
  {id: 33, value: 'Dominican', label: 'Dominican'},
  {id: 34, value: 'Dutch', label: 'Dutch'},
  {id: 35, value: 'Egyptian', label: 'Egyptian'},
  {id: 36, value: 'Eritrean', label: 'Eritrean'},
  {id: 37, value: 'Estonian', label: 'Estonian'},
  {id: 38, value: 'Ethiopian', label: 'Ethiopian'},
  {id: 39, value: 'Filipino', label: 'Filipino'},
  {id: 40, value: 'Finnish', label: 'Finnish'},
  {id: 41, value: 'French', label: 'French'},
  {id: 42, value: 'Gambian', label: 'Gambian'},
  {id: 43, value: 'Georgian', label: 'Georgian'},
  {id: 44, value: 'German', label: 'German'},
  {id: 45, value: 'Ghanaian', label: 'Ghanaian'},
  {id: 46, value: 'Greek', label: 'Greek'},
  {id: 47, value: 'Grenadian', label: 'Grenadian'},
  {id: 48, value: 'Guinean', label: 'Guinean'},
  {id: 49, value: 'Hungarian', label: 'Hungarian'},
  {id: 50, value: 'Indian', label: 'Indian'},
  {id: 51, value: 'Indonesian', label: 'Indonesian'},
  {id: 52, value: 'Irani', label: 'Irani'},
  {id: 53, value: 'Iraqi', label: 'Iraqi'},
  {id: 54, value: 'Irish', label: 'Irish'},
  {id: 55, value: 'Israeli', label: 'Israeli'},
  {id: 56, value: 'Italian', label: 'Italian'},
  {id: 57, value: 'Ivorian', label: 'Ivorian'},
  {id: 58, value: 'Jamaican', label: 'Jamaican'},
  {id: 59, value: 'Japanese', label: 'Japanese'},
  {id: 60, value: 'Jordanian', label: 'Jordanian'},
  {id: 61, value: 'Kazakhstani', label: 'Kazakhstani'},
  {id: 62, value: 'Kenyan', label: 'Kenyan'},
  {id: 63, value: 'Kittitian and Nevisian', label: 'Kittitian and Nevisian'},
  {id: 64, value: 'Korean', label: 'Korean'},
  {id: 65, value: 'Kuwaiti', label: 'Kuwaiti'},
  {id: 66, value: 'Kyrgyzstani', label: 'Kyrgyzstani'},
  {id: 67, value: 'Latvian', label: 'Latvian'},
  {id: 68, value: 'Lebanese', label: 'Lebanese'},
  {id: 69, value: 'Lesotho', label: 'Lesotho'},
  {id: 70, value: 'Liberian', label: 'Liberian'},
  {id: 71, value: 'Libyan', label: 'Libyan'},
  {id: 72, value: 'Lithuanian', label: 'Lithuanian'},
  {id: 73, value: 'Luxembourger', label: 'Luxembourger'},
  {id: 74, value: 'Madagascan', label: 'Madagascan'},
  {id: 75, value: 'Malaysian', label: 'Malaysian'},
  {id: 76, value: 'Maldivian', label: 'Maldivian'},
  {id: 77, value: 'Malian', label: 'Malian'},
  {id: 78, value: 'Maltese', label: 'Maltese'},
  {id: 79, value: 'Mauritanian', label: 'Mauritanian'},
  {id: 80, value: 'Mauritian', label: 'Mauritian'},
  {id: 81, value: 'Mexican', label: 'Mexican'},
  {id: 82, value: 'Moldavian', label: 'Moldavian'},
  {id: 83, value: 'Montenegrin', label: 'Montenegrin'},
  {id: 84, value: 'Moroccan', label: 'Moroccan'},
  {id: 85, value: 'Motswana', label: 'Motswana'},
  {id: 86, value: 'Namibian', label: 'Namibian'},
  {id: 87, value: 'Nepali', label: 'Nepali'},
  {id: 88, value: 'New Zealander', label: 'New Zealander'},
  {id: 89, value: 'Nigerian', label: 'Nigerian'},
  {id: 90, value: 'Ni-Vanuatu', label: 'Ni-Vanuatu'},
  {id: 91, value: 'Norwegian', label: 'Norwegian'},
  {id: 92, value: 'Omani', label: 'Omani'},
  {id: 93, value: 'Pakistani', label: 'Pakistani'},
  {id: 94, value: 'Palestinian', label: 'Palestinian'},
  {id: 95, value: 'Paraguayan', label: 'Paraguayan'},
  {id: 96, value: 'Peruvian', label: 'Peruvian'},
  {id: 97, value: 'Polish', label: 'Polish'},
  {id: 98, value: 'Portuguese', label: 'Portuguese'},
  {id: 99, value: 'Qatari', label: 'Qatari'},
  {id: 100, value: 'Romanian', label: 'Romanian'},
  {id: 101, value: 'Russian', label: 'Russian'},
  {id: 102, value: 'Saint Lucian', label: 'Saint Lucian'},
  {id: 103, value: 'Saudi', label: 'Saudi'},
  {id: 104, value: 'Scottish', label: 'Scottish'},
  {id: 105, value: 'Senegalese', label: 'Senegalese'},
  {id: 106, value: 'Serbian', label: 'Serbian'},
  {id: 107, value: 'Sierra Leonian', label: 'Sierra Leonian'},
  {id: 108, value: 'Singaporean', label: 'Singaporean'},
  {id: 109, value: 'Slovak/Slovakian', label: 'Slovak/Slovakian'},
  {id: 110, value: 'Slovenian', label: 'Slovenian'},
  {id: 111, value: 'Somali', label: 'Somali'},
  {id: 112, value: 'South African', label: 'South African'},
  {id: 113, value: 'Spanish', label: 'Spanish'},
  {id: 114, value: 'Sri Lankan', label: 'Sri Lankan'},
  {id: 115, value: 'Sudanese', label: 'Sudanese'},
  {id: 116, value: 'Surinamese', label: 'Surinamese'},
  {id: 117, value: 'Swedish', label: 'Swedish'},
  {id: 118, value: 'Swiss', label: 'Swiss'},
  {id: 119, value: 'Syrian', label: 'Syrian'},
  {id: 120, value: 'Taiwanese', label: 'Taiwanese'},
  {id: 121, value: 'Tajikistan', label: 'Tajikistan'},
  {id: 122, value: 'Tanzanian', label: 'Tanzanian'},
  {id: 123, value: 'Thai', label: 'Thai'},
  {id: 124, value: 'Tunisian', label: 'Tunisian'},
  {id: 125, value: 'Turkish', label: 'Turkish'},
  {id: 126, value: 'Turkmenistani', label: 'Turkmenistani'},
  {id: 127, value: 'UAE', label: 'UAE'},
  {id: 128, value: 'Ugandan', label: 'Ugandan'},
  {id: 129, value: 'Ukrainian', label: 'Ukrainian'},
  {id: 130, value: 'Uzbekistani', label: 'Uzbekistani'},
  {id: 131, value: 'Venezuelan', label: 'Venezuelan'},
  {id: 132, value: 'Welsh', label: 'Welsh'},
  {id: 133, value: 'Yemeni', label: 'Yemeni'},
  {id: 134, value: 'Zambian', label: 'Zambian'},
  {id: 135, value: 'Zimbabwean', label: 'Zimbabwean'},
  {
    id: 136,
    value: 'Trinidadian and Tobagonian',
    label: 'Trinidadian and Tobagonian',
  },
  {id: 137, value: 'Gabonese', label: 'Gabonese'},
  {id: 138, value: 'Mozambique', label: 'Mozambique'},
  {id: 139, value: 'Hong Konger', label: 'Hong Konger'},
  {id: 140, value: 'Honduran', label: 'Honduran'},
  {id: 141, value: 'Kosovar', label: 'Kosovar'},
  {
    id: 142,
    value: 'Democratic Republic of the Congo',
    label: 'Democratic Republic of the Congo',
  },
];

export const filteredParameters = [
  {
    title: 'Prequalified',
  },
  {
    title: 'Allocated',
  },
  {
    title: 'Paid',
  },
];
export const AgentOverviewData = {
  documents: [
    {
      title: 'Emirates ID',
      action: 'download',
      type: 'PDF',
      size: '1.2 MB',
      update: 'update',
      download: 'download',
    },
    {
      title: 'RERA Card',
      action: 'download',
      type: 'PDF',
      size: '1.2 MB',
      update: 'update',
      download: 'download',
    },
    {
      title: 'Passport',
      action: 'upload',
      type: 'PDF',
      size: '1.2 MB',
      status: 'Not Uploaded',
      upload: 'upload',
    },
  ],
  userInfo: [
    {title: 'First Name', value: 'Muhammad'},
    {title: 'Last Name', value: 'Salman'},
    {title: 'Nationality', value: 'Dubai'},
    {title: 'Company Phone', value: '+971 23343 566'},
    {title: 'Email Address', value: 'm_salman@beyond.ae'},
    {title: 'Emirates ID', value: '784-1234-1234567-1'},
    {title: 'Emirates ID Expiry Date', value: '20-07-1992'},
    {title: 'ID Issue Place', value: 'Dubai'},
    {title: 'Passport Number', value: 'AEP6316516160'},
    {title: 'Passport Issue Place', value: 'Dubai'},
    {title: 'Passport Expiry Date', value: '20-07-1992'},
    {title: 'Designation', value: 'Manager'},
    {title: 'Role', value: 'Broker'},
    {title: 'Broker RERA Number', value: '51165'},
    {title: 'RERA Registration Expiry Date', value: '20-07-1992'},
  ],
  detils: {
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+1-202-555-0136',
    gender: 'Male',
    email: 'john.doe@example.com',
    country: 'United States',
    language: 'English',
    date_of_birth: '1990-06-15',
    nationality: 'American',
    sales_manager: 'Jane Smith',
    emirates_id: '784-1234-1234567-1',
    id_expiry_date: moment().format('YYYY-MM-DD'),
    id_issue_place: 'Dubai',
    passport_number: 'AEP6316516160',
    passport_issue_place: 'Dubai',
    passport_expiry_date: moment().format('YYYY-MM-DD'),
    designation: 'Manager',
    role: 'Broker',
    rera_number: '51165',
    rera_expiry_date: moment().format('YYYY-MM-DD'),
  },
};

export const bookingTypeOptions = [
  {label: 'Broker Sale', value: 'Broker Sale'},
];

export const modeOfPaymentOptions = [
  {label: 'Bank Transfer', value: 'Bank Transfer'},
  {label: 'Cash', value: 'Cash'},
  {label: 'Cheque', value: 'Cheque'},
  {label: 'Credit Card (POS)', value: 'Credit Card (POS)'},
  {label: 'Online', value: 'Online'},
  {label: 'Direct Deposit', value: 'Direct Deposit'},
  {label: 'Internal Transfer', value: 'Internal Transfer'},
];

export const sourceOfFundOptions = [
  {label: 'Salaried', value: 'Salaried'},
  {label: 'Business Income', value: 'Business Income'},
  {label: 'Savings', value: 'Savings'},
  {label: 'Stock Market', value: 'Stock Market'},
  {label: 'Rental Income', value: 'Rental Income'},
  {label: 'Inheritance', value: 'Inheritance'},
  {label: 'Gift / Donation', value: 'Gift / Donation'},
  {label: 'Sale of Asset', value: 'Sale of Asset'},
  {label: 'Others', value: 'Others'},
];

export const sourceOfWealthOptions = [
  {label: 'Employment', value: 'Employment'},
  {label: 'Business Ownership', value: 'Business Ownership'},
  {
    label: 'Stock / Private Equity Portfolio',
    value: 'Stock / Private Equity Portfolio',
  },
  {label: 'Inheritance', value: 'Inheritance'},
  {label: 'Family Wealth', value: 'Family Wealth'},
  {label: 'Royalties from Patents', value: 'Royalties from Patents'},
  {label: 'Sale of Asset', value: 'Sale of Asset'},
  {label: 'Others', value: 'Others'},
];

export const countries = [
  {label: 'United Arab Emirates', value: 'United Arab Emirates'},
  {label: 'Afghanistan', value: 'Afghanistan'},
  {label: 'Albania', value: 'Albania'},
  {label: 'Algeria', value: 'Algeria'},
  {label: 'Andorra', value: 'Andorra'},
  {label: 'Angola', value: 'Angola'},
  {label: 'Antigua and Barbuda', value: 'Antigua and Barbuda'},
  {label: 'Argentina', value: 'Argentina'},
  {label: 'Armenia', value: 'Armenia'},
  {label: 'Australia', value: 'Australia'},
  {label: 'Austria', value: 'Austria'},
  {label: 'Azerbaijan', value: 'Azerbaijan'},
  {label: 'Bahrain', value: 'Bahrain'},
  {label: 'Bangladesh', value: 'Bangladesh'},
  {label: 'Barbados', value: 'Barbados'},
  {label: 'Belarus', value: 'Belarus'},
  {label: 'Belgium', value: 'Belgium'},
  {label: 'Belize', value: 'Belize'},
  {label: 'Benin', value: 'Benin'},
  {label: 'Bhutan', value: 'Bhutan'},
  {label: 'Bolivia', value: 'Bolivia'},
  {label: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina'},
  {label: 'Botswana', value: 'Botswana'},
  {label: 'Brazil', value: 'Brazil'},
  {label: 'Brunei', value: 'Brunei'},
  {label: 'Bulgaria', value: 'Bulgaria'},
  {label: 'Burkina Faso', value: 'Burkina Faso'},
  {label: 'Burma', value: 'Burma'},
  {label: 'Burundi', value: 'Burundi'},
  {label: 'Cambodia', value: 'Cambodia'},
  {label: 'Cameroon', value: 'Cameroon'},
  {label: 'Canada', value: 'Canada'},
  {label: 'Central African Republic', value: 'Central African Republic'},
  {label: 'Chad', value: 'Chad'},
  {label: 'Chile', value: 'Chile'},
  {label: "China, People's Republic of", value: "China, People's Republic of"},
  {label: 'Colombia', value: 'Colombia'},
  {label: 'Comoros', value: 'Comoros'},
  {
    label: 'Congo, Democratic Republic of the',
    value: 'Congo, Democratic Republic of the',
  },
  {label: 'Congo, Republic of the', value: 'Congo, Republic of the'},
  {label: 'Costa Rica', value: 'Costa Rica'},
  {label: "Côte d'Ivoire", value: "Côte d'Ivoire"},
  {label: 'Croatia', value: 'Croatia'},
  {label: 'Cuba', value: 'Cuba'},
  {label: 'Cyprus', value: 'Cyprus'},
  {label: 'Czech Republic', value: 'Czech Republic'},
  {label: 'Denmark', value: 'Denmark'},
  {label: 'Djibouti', value: 'Djibouti'},
  {label: 'Dominica', value: 'Dominica'},
  {label: 'Dominican Republic', value: 'Dominican Republic'},
  {label: 'Ecuador', value: 'Ecuador'},
  {label: 'Egypt', value: 'Egypt'},
  {label: 'El Salvador', value: 'El Salvador'},
  {label: 'Equatorial Guinea', value: 'Equatorial Guinea'},
  {label: 'Eritrea', value: 'Eritrea'},
  {label: 'Estonia', value: 'Estonia'},
  {label: 'Ethiopia', value: 'Ethiopia'},
  {label: 'Fiji', value: 'Fiji'},
  {label: 'Finland', value: 'Finland'},
  {label: 'France', value: 'France'},
  {label: 'Gabon', value: 'Gabon'},
  {label: 'Gambia, The', value: 'Gambia, The'},
  {label: 'Georgia', value: 'Georgia'},
  {label: 'Germany', value: 'Germany'},
  {label: 'Ghana', value: 'Ghana'},
  {label: 'Gibraltar', value: 'Gibraltar'},
  {label: 'Greece', value: 'Greece'},
  {label: 'Grenada', value: 'Grenada'},
  {label: 'Guatemala', value: 'Guatemala'},
  {label: 'Guinea', value: 'Guinea'},
  {label: 'Guinea-Bissau', value: 'Guinea-Bissau'},
  {label: 'Guyana', value: 'Guyana'},
  {label: 'Haiti', value: 'Haiti'},
  {label: 'Honduras', value: 'Honduras'},
  {label: 'Hungary', value: 'Hungary'},
  {label: 'Iceland', value: 'Iceland'},
  {label: 'India', value: 'India'},
  {label: 'Indonesia', value: 'Indonesia'},
  {label: 'Iran', value: 'Iran'},
  {label: 'Iraq', value: 'Iraq'},
  {label: 'Israel', value: 'Israel'},
  {label: 'Italy', value: 'Italy'},
  {label: 'Jamaica', value: 'Jamaica'},
  {label: 'Japan', value: 'Japan'},
  {label: 'Jordan', value: 'Jordan'},
  {label: 'Kazakhstan', value: 'Kazakhstan'},
  {label: 'Kenya', value: 'Kenya'},
  {label: 'Kiribati', value: 'Kiribati'},
  {label: 'Kuwait', value: 'Kuwait'},
  {label: 'Kyrgyzstan', value: 'Kyrgyzstan'},
  {label: 'Laos', value: 'Laos'},
  {label: 'Latvia', value: 'Latvia'},
  {label: 'Lebanon', value: 'Lebanon'},
  {label: 'Lesotho', value: 'Lesotho'},
  {label: 'Liberia', value: 'Liberia'},
  {label: 'Libya', value: 'Libya'},
  {label: 'Liechtenstein', value: 'Liechtenstein'},
  {label: 'Lithuania', value: 'Lithuania'},
  {label: 'Luxembourg', value: 'Luxembourg'},
  // ...
  {label: 'Pakistan', value: 'Pakistan'},
  {label: 'United States of America', value: 'United States of America'},
  {label: 'United Kingdom', value: 'United Kingdom'},
  {label: 'Ireland', value: 'Ireland'},
  {label: 'Russia', value: 'Russia'},
  {label: 'Timor-Leste', value: 'Timor-Leste'},
];

export const projectNameOptions = [
  {label: 'Aldhay', value: 'Aldhay'},
  {label: 'Alreeman', value: 'Alreeman'},
  {label: 'Alreeman II', value: 'Alreeman II'},
  {label: 'Alreeman III', value: 'Alreeman III'},
  {label: 'Alreeman IV', value: 'Alreeman IV'},
  {label: 'Aldhay Villas', value: 'Aldhay Villas'},
  {label: 'Aldhay Apartments', value: 'Aldhay Apartments'},
];

export const unitPreferenceOptions = [
  {label: 'Villa', value: 'Villa'},
  {label: 'Penthouse', value: 'Penthouse'},
  {label: 'Studio', value: 'Studio'},
  {label: '1 BHK', value: '1 BHK'},
  {label: '2 BHK', value: '2 BHK'},
  {label: '3 BHK', value: '3 BHK'},
  {label: 'Apartment', value: 'Apartment'},
];

export const salesManagerOptions = [
  {label: 'Ahmed Khan', value: 'Ahmed Khan'},
  {label: 'Sara Ali', value: 'Sara Ali'},
  {label: 'Imran Sheikh', value: 'Imran Sheikh'},
  {label: 'Zara Yousaf', value: 'Zara Yousaf'},
  {label: 'Bilal Qureshi', value: 'Bilal Qureshi'},
  {label: 'Ayesha Malik', value: 'Ayesha Malik'},
  {label: 'Tariq Mehmood', value: 'Tariq Mehmood'},
  {label: 'Nadia Rehman', value: 'Nadia Rehman'},
];
export const preferredLanguageData = [
  {label: 'English', value: 'English'},
  {label: 'Arabic', value: 'Arabic'},
  {label: 'Spanish', value: 'Spanish'},
  {label: 'Hindi', value: 'Hindi'},
  {label: 'Chinese', value: 'Chinese'},
  {label: 'Russian', value: 'Russian'},
  {label: 'Urdu', value: 'Urdu'},
  {label: 'French', value: 'French'},
  {label: 'Georgian', value: 'Georgian'},
  {label: 'Swedish', value: 'Swedish'},
  {label: 'Persian', value: 'Persian'},
  {label: 'Polish', value: 'Polish'},
  {label: 'Slovak', value: 'Slovak'},
  {label: 'Portuguese', value: 'Portuguese'},
  {label: 'Farsi', value: 'Farsi'},
  {label: 'Romanian', value: 'Romanian'},
  {label: 'Estonian', value: 'Estonian'},
  {label: 'Norwegian', value: 'Norwegian'},
  {label: 'German', value: 'German'},
  {label: 'Italian', value: 'Italian'},
  {label: 'Swahili', value: 'Swahili'},
  {label: 'Ukranian', value: 'Ukranian'},
  {label: 'Turkish', value: 'Turkish'},
  {label: 'Finnish', value: 'Finnish'},
  {label: 'Gujarati', value: 'Gujarati'},
];

export const partyCheque = [
  {
    label: 'Yes',
    value: 'Yes',
  },
  {
    label: 'No',
    value: 'No',
  },
];

export const PROPERTY_INFO = {
  propertyHeading: 'Property Information',
  propertyList: [
    {
      id: 1,
      title: 'Property Name',
      value: 'Aldhay',
    },
    {
      id: 2,
      title: 'Unit',
      value: 'Unit #012',
    },
    {
      id: 3,
      title: 'Size, Sq.ft',
      value: '120 Sq.Ft',
    },
    {
      id: 4,
      title: 'Bedrooms',
      value: '5 Bedrooms',
    },
    {
      id: 5,
      title: 'Bathrooms',
      value: '1 Bathrooms',
    },
    {
      id: 6,
      title: 'Furnished',
      value: 'Yes',
    },
    {
      id: 7,
      title: 'Offers',
      value: 'Offer #2',
    },
  ],
  property: {
    property_name: 'Aldhay',
    unit: 'Unit #012',
    size_sq_ft: '120 Sq.Ft',
    bedrooms: '5 Bedrooms',
    bathrooms: '1 Bathrooms',
    furnished: 'Yes',
    offers: 'Offer #2',
  },
  customerHeading: 'Customer Details',
  customerList: [
    {
      id: 1,
      title: 'Customer Name',
      value: 'Muhammad',
    },
    {
      id: 2,
      title: 'Cell Number',
      value: '+1 (555) 123-4567',
    },
    {
      id: 3,
      title: 'Address',
      value: '123 Al Maktoum St, Dubai, UAE',
    },
  ],
  customer: {
    customer_name: 'Muhammad',
    cell_number: '+1 (555) 123-4567',
    address: '123 Al Maktoum St, Dubai, UAE',
  },

  commissionHeading: 'Commission Details',
  commissionList: [
    {
      id: 1,
      title: 'Commission Type',
      value: 'Listing Commission',
    },
    {
      id: 2,
      title: 'Percentage (%)',
      value: '3%',
    },
    {
      id: 3,
      title: 'Amount',
      value: 'AED 5,000',
    },
    {
      id: 4,
      title: 'Buying Commission',
      value: '2%',
    },
    {
      id: 5,
      title: 'Percentage (%)',
      value: '2%',
    },
    {
      id: 6,
      title: 'Furnished',
      value: 'AED 3,000',
    },
    {
      id: 7,
      title: 'Total Commission',
      value: 'AED 8,000',
    },
  ],
  commission: {
    commission_type: 'Listing Commission',
    commission_percentage: '3%',
    listing_amount: 'AED 5,000',
    buying_commission: '2%',
    buying_percentage: '2%',
    furnished: 'AED 3,000',
    total_commission: 'AED 8,000',
  },
};

export const APPLICANT_DETAILS = {
  buyerList: [
    {id: 1, title: 'Buyer Type', value: 'Individual'},
    {id: 2, title: 'Ref No.', value: 'L85413'},
  ],
  buyerType: {id: 1, buyer_type: 'Individual', ref_no: 'L85413'},

  primaryApplicantHeading: 'Primary Applicant',
  primaryApplicantList: [
    {id: 1, title: 'Salutation', value: 'Mr.'},
    {id: 2, title: 'First Name', value: 'Danish'},
    {id: 3, title: 'Last Name', value: 'Ali'},
    {id: 4, title: 'Email', value: 'danishali@beyond.ae'},
    {id: 5, title: 'Mobile Number', value: '+971 23343 566'},
    {id: 6, title: 'Residence', value: 'Dubai'},
    {id: 7, title: 'Nationality', value: 'Dubai'},
  ],
  details: {
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+1-202-555-0136',
    gender: 'Male',
    email: 'muhammadshahbazalamkhan@digitalgravity.com',
    residence: 'United States',
    nationality: 'American',
    salutation: 'Mr.',
  },

  informationHeading: 'Information',
  informationList: [
    {id: 1, title: 'Booking Type', value: 'Broker Sale'},
    {id: 2, title: 'Project Name', value: 'Dubai Marina Heights'},
    {id: 3, title: 'Sales Manager', value: 'Malik'},
  ],
  information: {
    booking_type: 'Broker Sale',
    project: 'Dubai Marina Heights',
    sales_manager: 'Malik',
  },

  unitPreferenceHeading: 'Unit Preference',
  unitPreferenceList: [
    {id: 1, title: 'Unit Preference', value: '1BR'},
    {id: 2, title: 'No of Units', value: '1'},
    {id: 3, title: 'EOI Amount', value: '37000'},
  ],
  unitPreference: {
    preference: '1BR',
    no_of_units: '1',
    eoi_amount: '37000',
  },

  paymentHeading: 'Payment Details',
  paymentList: [
    {id: 1, title: 'Total EOI Amount', value: 'AED 100,000,000'},
    {id: 2, title: 'Mode of Payment', value: 'Bank Transfer'},
    {id: 3, title: 'Source of Fund', value: 'Job'},
    {id: 4, title: 'Source of Wealth', value: 'Stock Market'},
  ],

  payment: {
    total_eoi: 'AED 100,000,000',
    payment_mode: 'Bank Transfer',
    fund_source: 'Job',
    wealth_source: 'Stock Market',
  },

  kycHeading: 'KYC Details',
  kycList: [
    {id: 1, title: 'Passport Number', value: 'AEP6316516160'},
    {id: 2, title: 'Passport Expiry Date', value: '20-07-1992'},
    {id: 3, title: 'National ID Number', value: '784-1981-8646001-2'},
    {id: 4, title: 'National ID Expiry Date', value: '20-07-1992'},
    {id: 5, title: 'Address', value: '26th Floor, One by OMNIYAT Business Bay'},
    {id: 6, title: 'City', value: 'Dubai'},
    {id: 7, title: 'Postal Code', value: '555588'},
  ],
  kyc: {
    id_expiry_date: moment().format('YYYY-MM-DD'),
    passport_number: 'AEP6316516160',
    passport_issue_place: 'Dubai',
    passport_expiry_date: moment().format('YYYY-MM-DD'),
    city: 'Dubai',
    postal_code: '555588',
    address: '26th Floor, One by OMNIYAT Business Bay',
    emirates_id: '784-1234-1234567-1',
  },

  eoiHeading: 'Expression of Interest',
  eoiList: [
    {
      title: 'Passport',
      type: 'PDF',
      size: '1.2 MB',
      status: 'Uploaded',
      update: false,
      upload: false,
      download: true,
    },
    {
      title: 'National ID',
      type: 'PDF',
      size: '1.2 MB',
      status: 'Uploaded',
      update: false,
      upload: false,
      download: true,
    },
    {
      title: 'Proof of Payment',
      type: 'PDF',
      size: '1.2 MB',
      status: 'Uploaded',
      update: false,
      upload: false,
      download: true,
    },
  ],
};

export const CORPORATE_DETAILS = {
  buyerList: [
    {id: 1, title: 'Buyer Type', value: 'Corporate'},
    {id: 2, title: 'Ref No.', value: 'L85413'},
  ],

  buyerType: {id: 1, buyer_type: 'Individual', ref_no: 'L85413'},

  primaryApplicantHeading: 'Primary Applicant',
  primaryApplicantList: [
    {id: 1, title: 'Company Name', value: 'Beyond'},
    {id: 2, title: 'Company Email', value: 'danishali@beyond.ae'},
    {id: 3, title: 'Mobile Number', value: '+971 23343 566'},
  ],

  details: {
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+1-202-555-0136',
    gender: 'Male',
    email: 'john.doe@example.com',
    country: 'United States',
    language: 'English',
    date_of_birth: '1990-06-15',
    nationality: 'American',
    sales_manager: 'Jane Smith',
  },

  informationHeading: 'Information',
  informationList: [
    {id: 1, title: 'Booking Type', value: 'Broker Sale'},
    {id: 2, title: 'Project Name', value: 'Dubai Marina Heights'},
    {id: 3, title: 'Sales Manager', value: 'Malik'},
  ],
  information: {
    booking_type: 'Broker Sale',
    project: 'Dubai Marina Heights',
    sales_manager: 'Malik',
  },

  unitPreferenceHeading: 'Unit Preference',
  unitPreferenceList: [
    {id: 1, title: 'Unit Preference', value: '1BR'},
    {id: 2, title: 'No of Units', value: '1'},
    {id: 3, title: 'EOI Amount', value: '37000'},
  ],
  unitPreference: {
    preference: '1BR',
    no_of_units: '1',
    eoi_amount: '37000',
  },

  paymentHeading: 'Payment Details',
  paymentList: [
    {id: 1, title: 'Total EOI Amount', value: 'AED 100,000,000'},
    {id: 2, title: 'Mode of Payment', value: 'Bank Transfer'},
    {id: 3, title: 'Source of Fund', value: 'Job'},
    {id: 4, title: 'Source of Wealth', value: 'Stock Market'},
  ],

  payment: {
    total_eoi: 'AED 100,000,000',
    payment_mode: 'Bank Transfer',
    fund_source: 'Job',
    wealth_source: 'Stock Market',
  },

  kycHeading: 'KYC Details',
  kycList: [
    {id: 1, title: 'Company Registration Date', value: '2028-12-28'},
    {id: 2, title: 'Company Registration Number', value: '5678'},
    {id: 3, title: 'Company Registration Place', value: 'Dubai'},
    {id: 4, title: 'Trade License Number', value: '0351630'},
    {id: 5, title: 'Trade License Expiry', value: '2028-12-28'},
  ],
  kyc: {
    id_expiry_date: moment().format('YYYY-MM-DD'),
    passport_number: 'AEP6316516160',
    passport_issue_place: 'Dubai',
    passport_expiry_date: moment().format('YYYY-MM-DD'),
    city: 'Dubai',
    postal_code: '555588',
    address: '26th Floor, One by OMNIYAT Business Bay',
    emirates_id: '784-1234-1234567-1',
  },

  eoiHeading: 'Expression of Interest',
  eoiList: [
    {
      title: 'Passport',
      type: 'PDF',
      size: '1.2 MB',
      status: 'Uploaded',
      update: false,
      upload: false,
      download: true,
    },
    {
      title: 'National ID',
      type: 'PDF',
      size: '1.2 MB',
      status: 'Uploaded',
      update: false,
      upload: false,
      download: true,
    },
    {
      title: 'Proof of Payment',
      type: 'PDF',
      size: '1.2 MB',
      status: 'Uploaded',
      update: false,
      upload: false,
      download: true,
    },
  ],
};

export const buildingNames = [
  {label: 'Tower A', value: 'Tower A'},
  {label: 'Tower B', value: 'Tower B'},
  {label: 'Beach View Building', value: 'Beach View Building'},
  {label: 'Skyline Residences', value: 'Skyline Residences'},
  {label: 'Marina View Tower', value: 'Marina View Tower'},
  {label: 'Sunset Heights', value: 'Sunset Heights'},
];
export const unitTypes = [
  {label: 'Apartment', value: 'Apartment'},
  {label: 'Villa', value: 'Villa'},
  {label: 'Penthouse', value: 'Penthouse'},
  {label: 'Townhouse', value: 'Townhouse'},
  {label: 'Studio', value: 'Studio'},
  {label: 'Loft', value: 'Loft'},
];

export const bedroomOptions = [
  {label: 'Studio', value: 'Studio'},
  {label: '1 Bedroom', value: '1'},
  {label: '2 Bedrooms', value: '2'},
  {label: '3 Bedrooms', value: '3'},
  {label: '4 Bedrooms', value: '4'},
  {label: '5+ Bedrooms', value: '5+'},
];

export const properties = [
  {
    projectName: 'The Mural',
    price: 'AED 4564M',
    building: 'Building 1',
    unit: 'L-26429',
    type: '2BHK',
    br: '2',
    token: '37,000',
    selectType: 'Standard',
    isSelected: false,
  },
  {
    projectName: 'The Mural',
    price: 'AED 3999M',
    building: 'Building 2',
    unit: 'L-98765',
    type: '3BHK',
    br: '3',
    token: '45,000',
    selectType: 'Standard',
    isSelected: false,
  },
];

export const selectTypeOptions = ['Standard', '40/60 Plan'];

export const plansData = ['Floor Plan', 'Payment Plan'];

export const paymentPlans = [
  {
    title: 'Down Payment',
    details: [
      {label: 'Event Type', value: 'Date Based'},
      {label: 'Due Date', value: '2028-12-28'},
      {label: 'Percent', value: '10.00'},
      {label: 'Amount (AED)', value: '465,100.00'},
      {label: 'Payment Milestone', value: 'Immediate'},
      {label: 'Bank Master Type', value: 'Corporate'},
      {label: 'RC + SPA', value: 'RC'},
    ],
  },
  {
    title: '10001',
    details: [
      {label: 'Event Type', value: 'Due Date'},
      {label: 'Date Based', value: '2028-12-28'},
      {label: 'Percent', value: '5.00'},
      {label: 'Amount (AED)', value: '465,100.00'},
      {label: 'Payment Milestone', value: 'Immediate'},
      {label: 'Bank Master Type', value: 'Corporate'},
      {label: 'RC + SPA', value: 'SPA'},
    ],
  },
  {
    title: '10002',
    details: [
      {label: 'Event Type', value: 'Due Date'},
      {label: 'Date Based', value: '2028-12-28'},
      {label: 'Percent', value: '5.00'},
      {label: 'Amount (AED)', value: '465,100.00'},
      {label: 'Payment Milestone', value: 'Immediate'},
      {label: 'Bank Master Type', value: 'Escrow Account'},
      {label: 'RC + SPA', value: '-'},
    ],
  },
];

export const inventoryProperties = [
  {
    projectName: 'The Mural',
    price: 'AED 4564M',
    building: 'Building 1',
    unit: 'L-26429',
    type: '2BHK',
    br: '2',
    token: '37,000',
    selectType: 'Standard',
    isSelected: false,
  },
  {
    projectName: 'The Mural',
    price: 'AED 4564M',
    building: 'Building 1',
    unit: 'L-26429',
    type: '2BHK',
    br: '2',
    token: '37,000',
    selectType: 'Standard',
    isSelected: false,
  },
  {
    projectName: 'The Mural',
    price: 'AED 4564M',
    building: 'Building 1',
    unit: 'L-26429',
    type: '2BHK',
    br: '2',
    token: '37,000',
    selectType: 'Standard',
    isSelected: false,
  },
  {
    projectName: 'The Mural',
    price: 'AED 4564M',
    building: 'Building 1',
    unit: 'L-26429',
    type: '2BHK',
    br: '2',
    token: '37,000',
    selectType: 'Standard',
    isSelected: false,
  },
  {
    projectName: 'The Mural',
    price: 'AED 4564M',
    building: 'Building 1',
    unit: 'L-26429',
    type: '2BHK',
    br: '2',
    token: '37,000',
    selectType: 'Standard',
    isSelected: false,
  },
  {
    projectName: 'The Mural',
    price: 'AED 4564M',
    building: 'Building 1',
    unit: 'L-26429',
    type: '2BHK',
    br: '2',
    token: '37,000',
    selectType: 'Standard',
    isSelected: false,
  },
];

export const pdfLink =
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
export const pdfName = 'dummy.pdf';
