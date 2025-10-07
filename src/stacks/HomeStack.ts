import {RouteNames} from '@/config/routes';
import {Leads, Eoi, Dashboard, Menu, Success} from '@/screens';
import {TabStack} from './TabStack';
import {TransitionPresets} from '@react-navigation/stack';

export const HomeStack: any[] = [
  {
    name: RouteNames.HomeRoutes.TabStack,
    component: TabStack,
    key: RouteNames.HomeRoutes.TabStack,
  },
];
