import {RouteNames} from '@/config/routes';
import {Help, ChangePassword} from '@/screens';

import {PendingTabStack} from './PendingTabStack';
import PendingDashboardStack from './PendingDashboardStack';
import PendingLeads from '@/screens/Pending/PendingLeads';
import PendingMenuStack from './PendingMenuStack';
import PendingNotification from '@/screens/Pending/PendingNotification';
import PendingEoi from '@/screens/Pending/PendingEoi';
import PendingMenu from '@/screens/Pending/PendingMenu';
import PendingSalesOffer from '@/screens/Pending/PendingSalesOffer';
import PendingCommissions from '@/screens/Pending/PendingCommision';
import PendingUser from '@/screens/Pending/PendingUser';
import PendingAgents from '@/screens/Pending/PendingAgents';
export const PendingStack: any[] = [
  {
    name: RouteNames.PendingRoutes.PendingTabStack,
    component: PendingTabStack,
    key: RouteNames.PendingRoutes.PendingTabStack,
  },
  {
    name: RouteNames.PendingRoutes.PendingMenuStack,
    component: PendingMenuStack,
    key: RouteNames.PendingRoutes.PendingMenuStack,
  },
  {
    name: RouteNames.PendingRoutes.PendingDashboardStack,
    component: PendingDashboardStack,
    key: RouteNames.PendingRoutes.PendingDashboardStack,
  },
  {
    name: RouteNames.PendingRoutes.PendingNotification,
    component: PendingNotification,
    key: RouteNames.PendingRoutes.PendingNotification,
  },
  {
    name: RouteNames.PendingRoutes.PendingLeads,
    component: PendingLeads,
    key: RouteNames.PendingRoutes.PendingLeads,
  },
  {
    name: RouteNames.PendingRoutes.PendingEoi,
    component: PendingEoi,
    key: RouteNames.PendingRoutes.PendingEoi,
  },
  {
    name: RouteNames.PendingRoutes.PendingMenu,
    component: PendingMenu,
    key: RouteNames.PendingRoutes.PendingMenu,
  },
  {
    name: RouteNames.PendingRoutes.PendingSalesOffer,
    component: PendingSalesOffer,
    key: RouteNames.PendingRoutes.PendingSalesOffer,
  },
  {
    name: RouteNames.PendingRoutes.PendingCommissions,
    component: PendingCommissions,
    key: RouteNames.PendingRoutes.PendingCommissions,
  },
  {
    name: RouteNames.PendingRoutes.PendingUser,
    component: PendingUser,
    key: RouteNames.PendingRoutes.PendingUser,
  },
  {
    name: RouteNames.PendingRoutes.ChangePassword,
    component: ChangePassword,
    key: RouteNames.PendingRoutes.ChangePassword,
  },
  {
    name: RouteNames.PendingRoutes.Help,
    component: Help,
    key: RouteNames.PendingRoutes.Help,
  },
  {
    name: RouteNames.PendingRoutes.PendingAgents,
    component: PendingAgents,
    key: RouteNames.PendingRoutes.PendingAgents,
  },
];
