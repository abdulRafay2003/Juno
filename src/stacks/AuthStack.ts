import {RouteNames} from '@/config/routes';
import {
  Login,
  Signup,
  Otp,
  ForgotPassword,
  SetPassword,
  Success,
  Registeration,
  RegisterationDetails,
  RegisterationType,
  // New Registration Forms
  DubaiBasedRealEstate,
  OtherEmiratesRealEstate,
  NonRealEstateCompany,
  UaeFreelancer,
  InternationalRealEstate,
  InternationalNonRealEstate,
  InternationalFreelancer,
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
  {
    name: RouteNames.AuthRoutes.Registeration,
    component: Registeration,
    key: RouteNames.AuthRoutes.Registeration,
  },
  {
    name: RouteNames.AuthRoutes.RegisterationType,
    component: RegisterationType,
    key: RouteNames.AuthRoutes.RegisterationType,
  },
  {
    name: RouteNames.AuthRoutes.RegisterationDetails,
    component: RegisterationDetails,
    key: RouteNames.AuthRoutes.RegisterationDetails,
  },
  // New Registration Form Routes
  {
    name: RouteNames.AuthRoutes.DubaiBasedRealEstate,
    component: DubaiBasedRealEstate,
    key: RouteNames.AuthRoutes.DubaiBasedRealEstate,
  },
  {
    name: RouteNames.AuthRoutes.OtherEmiratesRealEstate,
    component: OtherEmiratesRealEstate,
    key: RouteNames.AuthRoutes.OtherEmiratesRealEstate,
  },
  {
    name: RouteNames.AuthRoutes.NonRealEstateCompany,
    component: NonRealEstateCompany,
    key: RouteNames.AuthRoutes.NonRealEstateCompany,
  },
  {
    name: RouteNames.AuthRoutes.UaeFreelancer,
    component: UaeFreelancer,
    key: RouteNames.AuthRoutes.UaeFreelancer,
  },
  {
    name: RouteNames.AuthRoutes.InternationalRealEstate,
    component: InternationalRealEstate,
    key: RouteNames.AuthRoutes.InternationalRealEstate,
  },
  {
    name: RouteNames.AuthRoutes.InternationalNonRealEstate,
    component: InternationalNonRealEstate,
    key: RouteNames.AuthRoutes.InternationalNonRealEstate,
  },
  {
    name: RouteNames.AuthRoutes.InternationalFreelancer,
    component: InternationalFreelancer,
    key: RouteNames.AuthRoutes.InternationalFreelancer,
  },
];
