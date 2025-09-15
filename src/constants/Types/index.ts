export interface dataType {
  label: string;
  value: string;
}

// Document interface for uploaded files
export interface DocumentData {
  type: string;
  file_name: string;
  file_extension: string;
  file_url: string;
}

// Form data interface for Add Agent form
export interface AddAgentFormData {
  firstName: string;
  lastName: string;
  nationality: string;
  dialCode: string;
  companyPhone: string;
  companyEmail: string;
  emiratesIdNum?: string;
  eidExpiryDate?: string;
  emirateIdIssuePlace?: string;
  passportNumber: string;
  passportIssuePlace: string;
  passportExpiryDate: string;
  brokenReraNumber?: string;
  reraRegistrationExpiryDate?: string;
  role: string;
  designation: string;
  reraCard?: File | null;
  emirateIdPdf?: File | null;
  passport?: File | null;
}

// API body interface for Add Agent request
export interface AddAgentRequestBody {
  first_name: string;
  last_name: string;
  nationality_id: string;
  phone_country_code_id: number;
  phone_number: string;
  email: string;
  national_id_number?: string;
  national_id_issue_place?: string;
  national_id_expiry_date?: string;
  passport_number: string;
  passport_issue_place: string;
  passport_expiry_date: string;
  designation: string;
  role_id: string;
  broker_rera_number?: string;
  broker_rera_registration_expiry_date?: string;
  documents: DocumentData[];
}

// Form data interface for Add Leads form
export interface AddLeadsFormData {
  salutation: string;
  firstName: string;
  lastName: string;
  dialCode: string;
  mobileNumber: string;
  email: string;
  nationality: string;
  salesManager: string;
  gender?: string;
  dob?: Date;
  preferredLanguage?: string;
  countryOfResidence?: string;
  interestPropertyType?: string;
  project?: string;
  campaign?: string;
}

// API body interface for Add Leads request
export interface AddLeadsRequestBody {
  title_id: string | null;
  first_name: string | null;
  last_name: string | null;
  gender_id: string | null;
  date_of_birth: string | null; // ISO date string format e.g. "2025-07-28"
  mobile_country_code_id: string; // Always present (static)
  mobile_phone: string | null;
  email: string | null;
  interested_property_type_id: string | null;
  nationality_id: string | null;
  country_of_residence_id: string | null;
  sales_manager_id: string | null;
  project_id: string | null;
  campaign_id: string | null;
  preferred_language_id: string | null;
  company_name: string;
}
