import {RouteNames} from '@/config/routes';
import {
  Leads,
  Notification,
  Eoi,
  Dashboard,
  Announcements,
  AnnouncementDetails,
  User,
  Help,
  AddLeads,
  SalesOffer,
  AddSalesOffer,
  Commissions,
  Menu,
  Success,
  UpdateDocument,
  ChangePassword,
  Agents,
  LeadOverview,
  Overview,
  UpdateDetails,
  AddAgent,
  CapttureEoi,
  AgentsOverview,
  CommissionOverview,
  UploadInvoice,
  ViewInvoice,
  EoiOverview,
  Inventory,
  FloorPlan,
  Filter,
  FaceIdCredentials,
} from '@/screens';
import {TabStack} from './TabStack';
import AmendPaymentPlan from '@/screens/Main/SalesOffer/AmendPaymentPlan';
import OfferReady from '@/screens/Main/SalesOffer/OfferReady';
import MenuStack from './MenuStack';
import DashboardStack from './DashboardStack';
import {TransitionPresets} from '@react-navigation/stack';
export const HomeStack: any[] = [
  {
    name: RouteNames.HomeRoutes.TabStack,
    component: TabStack,
    key: RouteNames.HomeRoutes.TabStack,
  },
  {
    name: RouteNames.HomeRoutes.MenuStack,
    component: MenuStack,
    key: RouteNames.HomeRoutes.MenuStack,
  },
  {
    name: RouteNames.HomeRoutes.DashboardStack,
    component: DashboardStack,
    key: RouteNames.HomeRoutes.DashboardStack,
  },
  {
    name: RouteNames.HomeRoutes.Notification,
    component: Notification,
    key: RouteNames.HomeRoutes.Notification,
  },
  {
    name: RouteNames.HomeRoutes.Leads,
    component: Leads,
    key: RouteNames.HomeRoutes.Leads,
  },
  {
    name: RouteNames.HomeRoutes.Eoi,
    component: Eoi,
    key: RouteNames.HomeRoutes.Eoi,
  },
  {
    name: RouteNames.HomeRoutes.Menu,
    component: Menu,
    key: RouteNames.HomeRoutes.Menu,
  },
  {
    name: RouteNames.HomeRoutes.Announcements,
    component: Announcements,
    key: RouteNames.HomeRoutes.Announcements,
  },
  {
    name: RouteNames.HomeRoutes.AnnouncementDetails,
    component: AnnouncementDetails,
    key: RouteNames.HomeRoutes.AnnouncementDetails,
  },
  {
    name: RouteNames.HomeRoutes.AddLeads,
    component: AddLeads,
    key: RouteNames.HomeRoutes.AddLeads,
  },
  {
    name: RouteNames.HomeRoutes.SalesOffer,
    component: SalesOffer,
    key: RouteNames.HomeRoutes.SalesOffer,
  },
  {
    name: RouteNames.HomeRoutes.AddSalesOffer,
    component: AddSalesOffer,
    key: RouteNames.HomeRoutes.AddSalesOffer,
  },
  {
    name: RouteNames.HomeRoutes.Commissions,
    component: Commissions,
    key: RouteNames.HomeRoutes.Commissions,
  },
  {
    name: RouteNames.HomeRoutes.User,
    component: User,
    key: RouteNames.HomeRoutes.User,
  },
  {
    name: RouteNames.HomeRoutes.ChangePassword,
    component: ChangePassword,
    key: RouteNames.HomeRoutes.ChangePassword,
  },
  {
    name: RouteNames.HomeRoutes.Help,
    component: Help,
    key: RouteNames.HomeRoutes.Help,
  },
  {
    name: RouteNames.HomeRoutes.Success,
    component: Success,
    key: RouteNames.HomeRoutes.Success,
  },
  {
    name: RouteNames.HomeRoutes.UpdateDocument,
    component: UpdateDocument,
    key: RouteNames.HomeRoutes.UpdateDocument,
  },
  {
    name: RouteNames.HomeRoutes.Agents,
    component: Agents,
    key: RouteNames.HomeRoutes.Agents,
  },
  {
    name: RouteNames.HomeRoutes.LeadOverview,
    component: LeadOverview,
    key: RouteNames.HomeRoutes.LeadOverview,
  },
  {
    name: RouteNames.HomeRoutes.Overview,
    component: Overview,
    key: RouteNames.HomeRoutes.Overview,
  },
  {
    name: RouteNames.HomeRoutes.UpdateDetails,
    component: UpdateDetails,
    key: RouteNames.HomeRoutes.UpdateDetails,
  },
  {
    name: RouteNames.HomeRoutes.AddAgent,
    component: AddAgent,
    key: RouteNames.HomeRoutes.AddAgent,
  },
  {
    name: RouteNames.HomeRoutes.CaptureEoi,
    component: CapttureEoi,
    key: RouteNames.HomeRoutes.CaptureEoi,
  },
  {
    name: RouteNames.HomeRoutes.AgentsOverview,
    component: AgentsOverview,
    key: RouteNames.HomeRoutes.AgentsOverview,
  },
  {
    name: RouteNames.HomeRoutes.CommissionOverview,
    component: CommissionOverview,
    key: RouteNames.HomeRoutes.CommissionOverview,
  },
  {
    name: RouteNames.HomeRoutes.UploadInvoice,
    component: UploadInvoice,
    key: RouteNames.HomeRoutes.UploadInvoice,
  },
  {
    name: RouteNames.HomeRoutes.ViewInvoice,
    component: ViewInvoice,
    key: RouteNames.HomeRoutes.ViewInvoice,
  },
  {
    name: RouteNames.HomeRoutes.EoiOverview,
    component: EoiOverview,
    key: RouteNames.HomeRoutes.EoiOverview,
  },
  {
    name: RouteNames.HomeRoutes.Inventory,
    component: Inventory,
    key: RouteNames.HomeRoutes.Inventory,
  },
  {
    name: RouteNames.HomeRoutes.AmendPaymentPlan,
    component: AmendPaymentPlan,
    key: RouteNames.HomeRoutes.AmendPaymentPlan,
  },
  {
    name: RouteNames.HomeRoutes.OfferReady,
    component: OfferReady,
    key: RouteNames.HomeRoutes.OfferReady,
  },
  {
    name: RouteNames.HomeRoutes.FloorPlan,
    component: FloorPlan,
    key: RouteNames.HomeRoutes.FloorPlan,
  },
  {
    name: RouteNames.HomeRoutes.Filter,
    component: Filter,
    key: RouteNames.HomeRoutes.Filter,
    options: {
      ...TransitionPresets.ModalTransition,
      presentation: 'transparentModal',
    },
  },
];
