export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Shop' | 'Commercial Unit';
export type PropertyStatus = 'Occupied' | 'Vacant';
export type PaymentStatus = 'Success' | 'Failed' | 'Pending';
export type PaymentMethod = 'UPI' | 'Google Pay' | 'PhonePe' | 'Paytm' | 'Debit Card' | 'Credit Card' | 'Net Banking';
export type UserRole = 'admin' | 'customer';

export interface Property {
  id: string;
  name: string;
  address: string;
  description: string;
  type: PropertyType;
  monthlyRent: number;
  securityDeposit: number;
  status: PropertyStatus;
  imageUrl?: string;
  ebServiceNumber?: string;
  ebConsumerName?: string;
  waterConnectionNumber?: string;
  waterConsumerName?: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  aadhaar: string;
  occupation: string;
  emergencyContact: string;
  username: string;
}

export interface RentalMapping {
  id: string;
  customerId: string;
  customerName: string;
  propertyId: string;
  propertyName: string;
  rentStartDate: string;
  monthlyRent: number;
  dueDate: number;
  gracePeriod: number;
  finePerDay: number;
  depositAmount: number;
}

export interface Payment {
  id: string;
  transactionId: string;
  customerId: string;
  customerName: string;
  paymentDate: string;
  rentMonth: string;
  rentAmount: number;
  fineAmount: number;
  totalPaid: number;
  status: PaymentStatus;
  method: PaymentMethod;
}

export interface DashboardStats {
  totalProperties: number;
  totalHouses: number;
  totalShops: number;
  occupiedProperties: number;
  vacantProperties: number;
  monthlyCollections: number;
  dueAmounts: number;
  fineCollections: number;
}

export interface CustomerDashboard {
  customer: Customer;
  property: Property;
  rental: RentalMapping;
  outstandingAmount: number;
  fineAmount: number;
  totalPayable: number;
  daysOverdue: number;
}
