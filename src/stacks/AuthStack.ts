import {RouteNames} from '@/config/routes';
import {
  Login,
  Signup,
  Otp,
  ForgotPassword,
  SetPassword,
  Success,
} from '@/screens';

export const AuthStack = [
  {
    name: RouteNames.AuthRoutes.Login,
    component: Login,
    key: RouteNames.AuthRoutes.Login,
  },
  {
    name: RouteNames.AuthRoutes.Signup,
    component: Signup,
    key: RouteNames.AuthRoutes.Signup,
  },
  {
    name: RouteNames.AuthRoutes.OtpScreen,
    component: Otp,
    key: RouteNames.AuthRoutes.OtpScreen,
  },
  {
    name: RouteNames.AuthRoutes.ForgotPassword,
    component: ForgotPassword,
    key: RouteNames.AuthRoutes.ForgotPassword,
  },
  {
    name: RouteNames.AuthRoutes.SetPassword,
    component: SetPassword,
    key: RouteNames.AuthRoutes.SetPassword,
  },
  {
    name: RouteNames.AuthRoutes.Success,
    component: Success,
    key: RouteNames.AuthRoutes.Success,
  },
];
