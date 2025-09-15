import Endpoints from '../EndPoints';
import httpService from '../http.service';

// Auth APIs
const login = (body: object) => {
  return httpService().post(Endpoints.login, body);
};

const registerAgency = (body: object) => {
  return httpService().post(Endpoints.registerAgency, body);
};

const verifyOtp = (body: object) => {
  return httpService().post(Endpoints.verifyOtp, body);
};

const setPassword = (body: object) => {
  return httpService().post(Endpoints.setPassword, body);
};

const forgotPassword = (body: object) => {
  return httpService().post(Endpoints.forgotPassword, body);
};

const resetPassword = (body: object) => {
  return httpService().post(Endpoints.resetPassword, body);
};
const resendOtp = (body: object) => {
  return httpService().post(Endpoints.resendOtp, body);
};

const postLogout = (body: object) => {
  return httpService().post(Endpoints.logout, body);
};

// Home APIs
const getDashboardData = () => {
  return httpService().get(Endpoints.dashboard);
};

const getYearlySales = (year: string) => {
  return httpService().get(`${Endpoints.yearlySale}?year=${year}`);
};

const getOverview = (offset = 0) => {
  return httpService().get(
    `${Endpoints.overview}?limit=10&offset=${Number(offset)}`,
  );
};

// Leads APIs
const getLeads = (offset = 0) => {
  return httpService().get(
    `${Endpoints.getLeads}?limit=10&offset=${Number(offset)}`,
  );
};

const creatLeads = (body: object) => {
  return httpService().post(Endpoints.postLeads, body);
};

const leadsOverview = (id: string) => {
  return httpService().get(`${Endpoints.leadsOverview}/${id}`);
};

// EOI APIs

const creatEoi = (body: object) => {
  return httpService().post(Endpoints.createEoi, body);
};

const getEoi = (offset = 0) => {
  return httpService().get(
    `${Endpoints.getEoi}?limit=10&offset=${Number(offset)}`,
  );
};

const eoiOverview = (id: string) => {
  return httpService().get(`${Endpoints.eoiOverview}/${id}`);
};

const uploadEoiDocumnet = (formData: FormData) => {
  return httpService('multipart/form-data').post(
    Endpoints.uploadEoiDocumnet,
    formData,
  );
};

// Sales Offer APIs
const getSalesOfferList = (offset = 0) => {
  return httpService().get(
    `${Endpoints.getSalesOfferList}?limit=10&offset=${Number(offset)}`,
  );
};

const getSalesOfferFilters = (projectId: string) => {
  return httpService().get(
    `${Endpoints.getSalesOfferFilters}?project_id=${projectId}`,
  );
};

const getInventory = (params: any) => {
  return httpService().get(Endpoints.getInventory, {params});
};

const generateSalesOffer = (body: object) => {
  return httpService().post(Endpoints.generateSalesOffer, body);
};

// Comission APIs
const getCommissionList = (offset = 0) => {
  return httpService().get(
    `${Endpoints.getCommissionsList}?limit=100&offset=${Number(offset)}`,
  );
};

const getCommissionOverview = (id: string) => {
  return httpService().get(`${Endpoints.getCommissionsOverview}/${id}`);
};

const uploadInvoice = (formData: FormData) => {
  return httpService('multipart/form-data').post(
    Endpoints.uploadInvoice,
    formData,
  );
};

// Dropdown API
const getDropDownData = () => {
  return httpService().get(Endpoints.getDropdownData);
};
const getProjectsData = () => {
  return httpService().get(Endpoints.getProjectsData);
};
const getSalesManagerData = () => {
  return httpService().get(Endpoints.getSalesManagerData);
};
const getCampaignData = () => {
  return httpService().get(Endpoints.getCampaignsData);
};

// Profile APIs
const changePassword = (body: object) => {
  return httpService().post(Endpoints.changePassword, body);
};

// Status Badge API
const getStatusBadgeData = () => {
  return httpService().get(Endpoints.getStatusBadges);
};

const getProfileDetails = () => {
  return httpService().get(Endpoints.profile);
};

const getMeDetails = () => {
  return httpService().get(Endpoints.me);
};

// dropdowns with slug

const getWithSlug = (slug: string) => {
  return httpService().get(Endpoints.withSlug(slug));
};

const updateBankDetails = (formData: FormData) => {
  return httpService('multipart/form-data').post(
    Endpoints.updateBankDetail,
    formData,
  );
};

// Agents/Users APIs
const getUsers = (offset = 0) => {
  return httpService().get(
    `${Endpoints.getUsers}?limit=10&offset=${Number(offset)}`,
  );
};

const deactivateUser = (body: object) => {
  return httpService().post(Endpoints.deactivateUser, body);
};

const userOverview = (id: string) => {
  return httpService().get(`${Endpoints.userOverview}/${id}`);
};

const createUser = (body: object) => {
  return httpService().post(Endpoints.postUsers, body);
};

const uploadDocument = (formData: FormData) => {
  return httpService('multipart/form-data').post(
    Endpoints.uploadDocument,
    formData,
  );
};

// Onboarding API
const submitOnboardingStep = (body: object) => {
  return httpService().post(Endpoints.onboarding, body);
};

const getOnboardingStep = (step: string) => {
  return httpService().get(`${Endpoints.onboarding}/${step}`);
};

const patchOnboardingStep = (body: object) => {
  return httpService().patch(Endpoints.onboarding, body);
};

const uploadOnboardingDocument = (formData: FormData) => {
  return httpService('multipart/form-data').post(
    Endpoints.uploadOnboardingDocument,
    formData,
  );
};

// Help API
const getHelp = () => {
  return httpService().get(Endpoints.help);
};

const signedUrl = (url: string) => {
  return httpService().get(Endpoints.signedUrl(url));
};

// Notifications
const getNotifications = (offset = 0) => {
  return httpService().get(
    `${Endpoints.notifications}?limit=10&offset=${Number(offset)}`,
  );
};

const readNotification = (id: any) => {
  return httpService().get(`${Endpoints.readNotification}/${id}`);
};

export const APIS = {
  // Auth APIs
  login,
  registerAgency,
  verifyOtp,
  setPassword,
  forgotPassword,
  resetPassword,
  resendOtp,
  postLogout,
  //Sales Offer APIs
  getSalesOfferList,
  getSalesOfferFilters,
  getInventory,
  generateSalesOffer,
  // Home APIs
  getDashboardData,
  getYearlySales,
  getOverview,
  // Commission APIs
  getCommissionList,
  getCommissionOverview,
  uploadInvoice,
  // Leads APIs
  getLeads,
  leadsOverview,
  creatLeads,
  // EOI APIs
  creatEoi,
  getEoi,
  eoiOverview,
  uploadEoiDocumnet,

  //Dropdown
  getDropDownData,
  getProjectsData,
  getSalesManagerData,
  getCampaignData,

  changePassword,
  getStatusBadgeData,
  // with slug
  getWithSlug,
  // Profile APIs
  getProfileDetails,
  updateBankDetails,
  uploadDocument,
  getMeDetails,
  // Agents/Users APIs
  getUsers,
  userOverview,
  deactivateUser,
  // Onboarding APIs
  submitOnboardingStep,
  getOnboardingStep,
  patchOnboardingStep,
  uploadOnboardingDocument,
  getHelp,
  createUser,
  // Signed URL API
  signedUrl,
  // Notifications
  getNotifications,
  readNotification,
};
