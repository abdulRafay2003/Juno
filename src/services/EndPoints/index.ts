const Endpoints = {
  // Auth Apis Endpoints
  login: 'auth/login',
  registerAgency: 'auth/register',
  verifyOtp: 'auth/verify-otp',
  setPassword: 'auth/set-password',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password',
  resendOtp: 'auth/resend-otp',
  logout: '/auth/logout',
  // Home Apis Endpoints
  dashboard: 'app/dashboard/details',
  yearlySale: 'app/dashboard/chart',
  overview: 'app/dashboard/overview',

  // Leads Endpoints
  getLeads: 'app/leads',
  leadsOverview: 'app/leads',
  postLeads: 'app/leads',

  // EOI Endpoints
  createEoi: 'app/eois',
  getEoi: 'app/eois',
  eoiOverview: 'app/eois',
  uploadEoiDocumnet: 'app/eois/upload-document',

  // Sales Offer Endpoints
  getSalesOfferList: 'app/saleoffers',
  getSalesOfferFilters: 'app/saleoffers/filters',
  getInventory: 'app/saleoffers/details',
  generateSalesOffer: 'app/saleoffers',

  //Commission Endpoints
  getCommissionsList: 'app/commissions',
  uploadInvoice: 'app/commissions/upload-invoice',

  //Dropdown Endpoints
  getDropdownData: 'app/dropdowns',
  getProjectsData: 'app/projects',
  getSalesManagerData: 'app/salesmanagers',
  getCampaignsData: 'app/campaigns',

  //Profile Endpoints
  changePassword: 'app/profile/change-password',
  getCommissionsOverview: 'app/commissions',

  //Status Badge Endpoints
  getStatusBadges: 'app/common/status',
  // with slug
  withSlug: (slug: string) => `app/${slug}`,

  // Profile Details
  profile: 'app/profile/details',
  me: 'app/profile/me',

  // Bank Details Endpoint (Update)
  updateBankDetail: 'app/profile/update-bank-details',

  // Upload Document Endpoint
  uploadDocument: 'app/profile/upload-document',

  // Agents/Users Endpoints
  getUsers: 'app/users',
  userOverview: 'app/users',
  deactivateUser: 'app/users/update',

  // Onboarding Endpoints
  onboarding: 'app/onboardings',
  uploadOnboardingDocument: 'app/onboardings/upload-documents',
  postUsers: 'app/users',

  // Help Endpoints
  help: 'app/common/settings',
  // Signed URL Endpoint
  signedUrl: (url: string) => `app/signed-url?url=${url}`,

  // Notifications
  notifications: 'app/notifications',
  readNotification: 'app/notifications',

  // Refresh Token
  refreshToken: 'auth/refresh-token',
};

export default Endpoints;
