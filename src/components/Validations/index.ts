import {store} from '@/redux/store';
import {findConditionStatus} from '@/utils/business.helper';
import moment from 'moment';
import * as yup from 'yup';
const emailreg2 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const alphaNumeric = /^[a-zA-Z0-9]+$/;
// /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
const companyNameRegix = /^[A-Za-z& ]+$/;
const emiratesIdRegix = /^\d{3}-\d{4}-\d{7}-\d{1}$/;

const onlyStringRegix = /^[A-Za-z\s]+$/;
const passwordRegix =
  /^(?!.*\s)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{9,}$/;
const checktiming = () => {
  let starttime = new Date();
  let endTime = new Date();
  if (starttime > endTime) {
    return;
  }
};

const isBankFieldRequired = (
  headerTitle: string,
  bankAvailability: boolean,
) => {
  if (
    headerTitle === 'Real Estate Agency (Dubai Based)' &&
    bankAvailability === true
  ) {
    return true;
  } else if (
    headerTitle === 'Real Estate Agency (Other Emirates)' &&
    bankAvailability === true
  ) {
    return true;
  } else if (
    headerTitle === 'Non Real Estate Company' &&
    bankAvailability === true
  ) {
    return true;
  } else if (headerTitle === 'UAE Freelancer' && bankAvailability === true) {
    return true;
  } else {
    return false;
  }
};
const dropdownData = store.getState().user.dropdownData;

export const step1DubaiBasedSchema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),
  tradeLicenseCategory: yup
    .string()
    .required('Trade license category is required'),
  tradeLicenseNumber: yup
    .string()
    .required('Trade license number is required')
    .matches(alphaNumeric, 'Trade license number must be alpha numeric'),
  tradeLicenseExpiryDate: yup
    .date()
    .required('Trade license expiry date is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().notRequired(),
  companyEmail: yup
    .string()
    .required('Company email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  dialCode: yup.string().required('Dial code is required'),
  companyPhone: yup
    .string()
    .required('Company phone number is required')
    .matches(/^\d+$/, 'Company phone number must contain only digits')
    .max(40, 'Company phone number must not exceed 40 digits'),
  // .when('dialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Company number must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(/^\d{5,15}$/, 'Company number must be 5 to 15 digits'),
  // }),
  addressLine1: yup.string().required('Address line 1 is required'),
  addressLine2: yup.string().notRequired(), // Optional
  poBox: yup.string().notRequired(), // Optional
  propertyConsultant: yup.string().notRequired(), // Optional
  companyReraNumber: yup
    .string()
    // .matches(/^\d+$/, 'Only digits are allowed')
    // .min(5, 'RERA number must be at least 5 digits')
    // .max(5, 'RERA number must be at most 5 digits')
    .when(['tradeLicenseCategory'], {
      is: category =>
        findConditionStatus(
          category,
          dropdownData?.trade_licence_category,
        )?.toLowerCase() == 'ded',
      then: schema =>
        schema
          .required('Company RERA number is required')
          .matches(alphaNumeric, 'Company RERA number must be alphanumeric'),
      otherwise: schema => schema.notRequired(),
    }),
  companyReraRegistrationExpiry: yup.date().when(['tradeLicenseCategory'], {
    is: category =>
      findConditionStatus(
        category,
        dropdownData?.trade_licence_category,
      )?.toLowerCase() == 'ded',
    then: schema => schema.required('RERA expiry date is required'),
    otherwise: schema => schema.notRequired(),
  }),

  haveTrn: yup.string().required('Selection Required'),
  trnNumber: yup.string().when(['haveTrn'], {
    is: haveTrn => haveTrn === 'Yes',
    then: schema =>
      schema
        .required('TRN number is required')
        .matches(/^\d{15}$/, 'TRN number must be exactly 15 digits'),
    otherwise: schema =>
      schema.notRequired().matches(/^\d{15}$/, {
        excludeEmptyString: true,
        message: 'TRN number must be exactly 15 digits',
      }),
  }),

  ownership: yup.string().required('Ownership is required'),
});

export const step2DubaiBasedSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  emiratesIdNum: yup
    .string()
    .required('Emirates ID number is required')
    .matches(emiratesIdRegix, 'Must be in format 123-1234-1234567-1')
    .test('no-zero-blocks', function (value) {
      if (!value) return true;

      const parts = value.split('-');
      if (parts.length !== 4) return true;

      const [a, b, c] = parts; // ignore last digit

      if (a === '000') {
        return this.createError({message: 'First 3 digits cannot be 000.'});
      }
      if (b === '0000') {
        return this.createError({message: 'Middle 4 digits cannot be 0000.'});
      }
      if (c === '0000000') {
        return this.createError({
          message: 'The 7-digit block cannot be all zeros.',
        });
      }

      return true;
    }),
  eidExpiryDate: yup.date().required('Emirates ID expiry date is required'),
  passportNumber: yup
    .string()
    .required('Passport number is required')
    .matches(alphaNumeric, 'Passport number must be alpha numeric'),
  passportIssuePlace: yup.string().required('Passport Issue Place is required'), // Optional
  passportExpiryDate: yup.date().required('Passport expiry date is required'),
  signatoryDialCode: yup.string().required('Signatory dial code is required'),
  signatoryMobile: yup
    .string()
    .required('Signatory mobile is required')
    .matches(/^\d+$/, 'Signatory mobile must contain only digits')
    .max(40, 'Signatory mobile number must not exceed 40 digits'),
  // .when('signatoryDialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(
  //       /^\d{5,15}$/,
  //       'Signatory mobile must be 5 to 15 digits',
  //     ),
  // }),
  signatoryEmail: yup
    .string()
    .notRequired()
    .max(80, 'Email must not exceed 80 characters'),
  role: yup.string().required('Role is required'),
  designation: yup.string().required('Designation is required'),
  brokenReraNumber: yup
    .string()
    // .min(5, 'Broker RERA number must be at least 5 digits')
    // .max(5, 'Broker RERA number must be at most 5 digits')
    .when(['tradeLicenseCategory'], {
      is: (tradeLicenseCategory: string) => {
        if (tradeLicenseCategory?.toLowerCase() === 'ded') {
          return true;
        } else {
          return (
            findConditionStatus(
              tradeLicenseCategory,
              dropdownData?.trade_licence_category,
            )?.toLowerCase() === 'ded'
          );
        }
      },
      then: schema =>
        schema
          .required('Broker RERA number is required')
          .matches(alphaNumeric, 'Broker RERA number must be alphanumeric'),
      otherwise: schema => schema.notRequired(),
    }),
  reraRegistrationExpiryDate: yup.date().when(['tradeLicenseCategory'], {
    is: (tradeLicenseCategory: string) => {
      if (tradeLicenseCategory?.toLowerCase() === 'ded') {
        return true;
      } else {
        return (
          findConditionStatus(
            tradeLicenseCategory,
            dropdownData?.trade_licence_category,
          )?.toLowerCase() === 'ded'
        );
      }
    },
    then: schema => schema.required('RERA registration expiry is required'),
    otherwise: schema => schema.notRequired(),
  }),
});

export const step3DubaiBasedSchema = yup.object().shape({
  bankCountry: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Bank country is required'),
    otherwise: schema => schema.notRequired(),
  }),
  bankName: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Bank name is required'),
    otherwise: schema => schema.notRequired(),
  }),

  bankAccountNumber: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema =>
      schema
        .required('Bank account number is required')
        .matches(alphaNumeric, 'Bank account number must be alpha numeric'),
    // .matches(/^\d{16}$/, 'Bank account number must be exactly 16 digits'),
    otherwise: schema => schema.notRequired(),
  }),

  beneficiaryName: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Beneficiary name is required'),
    otherwise: schema => schema.notRequired(),
  }),
  ibanNumber: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema =>
      schema
        .required('IBAN number is required')
        .matches(alphaNumeric, 'IBAN must be alphanumeric'),
    otherwise: schema => schema.notRequired(),
  }),
  // ibanNumber: yup.string().when(['$bankAvailability'], {
  //   is: (bankAvailability: boolean) => bankAvailability,
  //   then: schema => schema.required('IBAN number is required'),
  // .matches(
  //   /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{23}$/,
  //   'IBAN must be 23 uppercase letters/numbers',
  // ),

  // }),

  swiftCode: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema =>
      schema
        .required('Swift Code is required')
        .matches(alphaNumeric, 'Swift Code must be alphanumeric'),
    // .matches(
    //   /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/i,
    //   'Swift Code format, e.g: TESTAA00 Or ABCDXY12',
    // )

    otherwise: schema => schema.notRequired(),
  }),
  currency: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Currency is required'),
    otherwise: schema => schema.notRequired(),
  }),

  bankBranchName: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema, // Optional field, keep it as is
    otherwise: schema => schema.notRequired(),
  }),

  bankAddress: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Bank address is required'),
    otherwise: schema => schema.notRequired(),
  }),
});

export const step4DubaiBasedSchema = yup.object().shape({
  validTradeLicense: yup.mixed().required('Valid trade license is required'),

  reraCertificate: yup.mixed().when(['tradeLicenseCategory'], {
    is: tradeLicenseCategory => {
      if (tradeLicenseCategory?.toLowerCase() === 'ded') {
        return true;
      } else {
        return (
          findConditionStatus(
            tradeLicenseCategory,
            dropdownData?.trade_licence_category,
          )?.toLowerCase() === 'ded'
        );
      }
    },
    then: schema => schema.required('RERA certificate is required'),
    otherwise: schema => schema.notRequired(),
  }),

  brokerCard: yup.mixed().when(['tradeLicenseCategory'], {
    is: tradeLicenseCategory => {
      if (tradeLicenseCategory?.toLowerCase() === 'ded') {
        return true;
      } else {
        return (
          findConditionStatus(
            tradeLicenseCategory,
            dropdownData?.trade_licence_category,
          )?.toLowerCase() === 'ded'
        );
      }
    },
    then: schema => schema.required('Broker card is required'),
    otherwise: schema => schema.notRequired(),
  }),

  passportCopy: yup.mixed().required('Signatory Passport is required'),

  visaCopy: yup.mixed().notRequired(), // Optional globally

  // Required when freelancer is false
  emiratesIdCopy: yup.mixed().required('Emirates ID copy is required'),

  // Non VAT Disclosure (for Dubai-based, non-freelancer, only if answered No to TRN and not Non-Estate)
  nonVatDisclosure: yup.mixed().when(['haveTrn'], {
    is: (haveTrn: string) => haveTrn.toLowerCase() == 'no', // Only for Dubai Based real estate types
    then: schema => schema.required('Non VAT Disclosure is required'),
    otherwise: schema => schema.notRequired(),
  }),
  // IBAN Letter required when bank availability is true
  bankLetter: yup.mixed().when(['$bankAvailability'], {
    is: true,
    then: schema => schema.required('IBAN letter is required'),
    otherwise: schema => schema.notRequired(),
  }),

  // VAT Certificate (if not freelancer and answered Yes to having TRN)
  vatCertificate: yup.mixed().when(['haveTrn'], {
    is: (haveTrn: string) => haveTrn.toLowerCase() === 'yes',
    then: schema => schema.required('VAT certificate is required'),
    otherwise: schema => schema.notRequired(),
  }),

  // POA MOA – required for non-freelancers
  poaMoa: yup.mixed().required('POA & MOA document is required'),
});
/// Internation Real Estate
export const step1InternationRESchema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),
  registrationNumber: yup
    .string()
    .required('Registration number is required')
    .matches(alphaNumeric, 'Registration number must be alpha numeric'),
  registrationExpiryDate: yup.date(),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  dialCode: yup.string().required('Dial code is required'),
  companyPhone: yup
    .string()
    .required('Company phone number is required')
    .matches(/^\d+$/, 'Company phone number must contain only digits')
    .max(40, 'Company phone number must not exceed 40 digits'),
  // .when('dialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Company number must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(/^\d{5,15}$/, 'Company number must be 5 to 15 digits'),
  // }),
  companyEmail: yup
    .string()
    .required('Company email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  addressLine1: yup.string().required('Address line 1 is required'),
  addressLine2: yup.string().notRequired(), // Optional
  poBox: yup.string().notRequired(), // Optional
  propertyConsultant: yup.string().notRequired(), // Optional
});

export const step2InternationRESchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  nationalIdNumber: yup
    .string()
    .notRequired()
    .matches(alphaNumeric, 'National ID number must be alpha numeric'),
  nationalExpiryDate: yup.date().notRequired(),
  passportNumber: yup
    .string()
    .required('Passport number is required')
    .matches(alphaNumeric, 'Passport number must be alpha numeric'),
  //   .min(6, 'Passport number must be at least 6 characters')
  //   .max(9, 'Passport number must be at most 9 characters')
  //   .matches(/^[A-Z0-9]+$/, 'Passport must be uppercase letters & numbers'),

  passportIssuePlace: yup.string().required('Passport Issue Place is required'), // Optional
  passportExpiryDate: yup.date().required('Passport expiry date is required'),

  signatoryMobile: yup
    .string()
    .required('Signatory mobile is required')
    .matches(/^\d+$/, 'Signatory mobile must contain only digits')
    .max(40, 'Signatory mobile number must not exceed 40 digits'),
  // .when('signatoryDialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(
  //       /^\d{5,15}$/,
  //       'Signatory mobile must be 5 to 15 digits',
  //     ),
  // }),
  signatoryDialCode: yup.string().required('Signatory dial code is required'),
  signatoryEmail: yup
    .string()
    .required()
    .max(80, 'Email must not exceed 80 characters'),
  role: yup.string().required('Role is required'),
  designation: yup.string().required('Designation is required'),
});

export const step3InternationRESchema = yup.object().shape({
  bankName: yup.string().required('Bank name is required'),

  bankAccountNumber: yup
    .string()
    .required('Bank account number is required')
    .matches(alphaNumeric, 'Bank account number must be alpha numeric'),

  bankCountry: yup.string().required('Bank country is required'),

  beneficiaryName: yup.string().required('Beneficiary name is required'),

  ibanNumber: yup
    .string()
    .required('IBAN number is required')
    .matches(alphaNumeric, 'IBAN must be alpha numeric'),
  swiftCode: yup
    .string()
    .notRequired()
    .matches(alphaNumeric, 'Swift code must be alpha numeric'),
  currency: yup.string().required('Currency is required'),

  bankBranchName: yup.string().notRequired(), // Optional
  bankAddress: yup.string().required('Bank address is required'),
});

export const step4InternationRESchema = yup.object().shape({
  passportCopy: yup.mixed().required('Signatory Passport is required'),

  visaCopy: yup.mixed().notRequired(), // Optional globally

  // IBAN Letter required when bank availability is true
  bankLetter: yup.mixed().required('IBAN letter is required'),
  registerationCertificate: yup
    .mixed()
    .required('Registration certificate is required'),
});

//International Non Real Estate
export const internationNonRealEstateStep1Schema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),
  registrationNumber: yup
    .string()
    .required('Registration number is required')
    .matches(alphaNumeric, 'Registration Number must be alpha numeric'),
  registrationExpiryDate: yup
    .date()
    .required('Registration expiry date is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().notRequired(),
  dialCode: yup.string().required('Dial code is required'),
  companyPhone: yup
    .string()
    .required('Company phone number is required')
    .matches(/^\d+$/, 'Company phone number must contain only digits')
    .max(40, 'Company phone number must not exceed 40 digits'),
  // .when('dialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Company number must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(/^\d{5,15}$/, 'Company number must be 5 to 15 digits'),
  // }),
  companyEmail: yup
    .string()
    .required('Company email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  addressLine1: yup.string().required('Address line 1 is required'),
  addressLine2: yup.string().notRequired(), // Optional
  poBox: yup.string().notRequired(), // Optional
  propertyConsultant: yup.string().notRequired(),
});
export const internationNonRealEstateStep2Schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  nationalIdNumber: yup
    .string()
    .notRequired()
    .matches(alphaNumeric, 'National ID number must be alpha numeric'),
  nationIdExpiryDate: yup.date().notRequired(),
  passportNumber: yup
    .string()
    .required('Passport number is required')
    .matches(alphaNumeric, 'Passport number must be alpha numeric'),
  passportIssuePlace: yup.string().required('Passport Issue Place is required'), // Optional
  passportExpiryDate: yup.date().required('Passport expiry date is required'),
  signatoryDialCode: yup.string().required('Signatory dial code is required'),
  signatoryMobile: yup
    .string()
    .required('Signatory mobile is required')
    .matches(/^\d+$/, 'Signatory mobile must contain only digits')
    .max(40, 'Signatory mobile number must not exceed 40 digits'),
  // .when('signatoryDialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(
  //       /^\d{5,15}$/,
  //       'Signatory mobile must be 5 to 15 digits',
  //     ),
  // }),
  signatoryEmail: yup
    .string()
    .required('Signatory email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  role: yup.string().required('Role is required'),
  designation: yup.string().required('Designation is required'),
});

export const internationNonRealEstateStep3Schema = yup.object().shape({
  bankCountry: yup.string().required('Bank country is required'),
  bankName: yup.string().required('Bank name is required'),
  bankAccountNumber: yup
    .string()
    .required('Bank account number is required')
    .matches(alphaNumeric, 'Bank account number must be alpha numeric'),
  beneficiaryName: yup.string().required('Beneficiary name is required'),
  ibanNumber: yup
    .string()
    .required('IBAN number is required')
    .matches(alphaNumeric, 'IBAN must be alpha numeric'),
  swiftCode: yup
    .string()
    .notRequired()
    .matches(alphaNumeric, 'Swift code must be alpha numeric'),
  currency: yup.string().required('Currency is required'),
  bankBranchName: yup.string().notRequired(), // Optional
  bankAddress: yup.string().required('Bank address is required'),
});

export const internationNonRealEstateStep4Schema = yup.object().shape({
  commercialLicense: yup
    .mixed()
    .required('Business / Commercial license is required'),
  passportCopy: yup.mixed().required('Signatory Passport is required'),
  nationalIdNumberpdf: yup.mixed().required('National ID is required'),
  bankLetter: yup.mixed().required('Bank letter or Cancel Cheque is required'),
});

//International Freelancer

export const internationalFreelancerStep1Schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  signatoryDialCode: yup.string().required('Signatory dial code is required'),
  signatoryMobile: yup
    .string()
    .required('Signatory mobile is required')
    .matches(/^\d+$/, 'Signatory mobile must contain only digits')
    .max(40, 'Signatory mobile number must not exceed 40 digits'),
  // .when('signatoryDialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(
  //       /^\d{5,15}$/,
  //       'Signatory mobile must be 5 to 15 digits',
  //     ),
  // }),
  nationalIdNumber: yup
    .string()
    .notRequired()
    .matches(alphaNumeric, 'National ID number must be alpha numeric'),

  nationalExpiryDate: yup.date().notRequired(),
  passportNumber: yup
    .string()
    .required('Passport number is required')
    .matches(alphaNumeric, 'Passport number must be alpha numeric'),
  passportIssuePlace: yup.string().required('Passport issue place is required'),
  passportExpiryDate: yup.date().required('Passport expiry date is required'),
  signatoryEmail: yup
    .string()
    .required('Signatory email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  addressLine1: yup.string().required('Address line 1 is required'),
  addressLine2: yup.string().notRequired(), // Still optional
  poBox: yup.string().required('P.O. Box is required'),
});

export const internationalFreelancerStep2Schema = yup.object().shape({
  bankName: yup.string().required('Bank name is required'),
  bankAccountNumber: yup
    .string()
    .required('Bank account number is required')
    .matches(alphaNumeric, 'Bank account number must be alpha numeric'),

  bankCountry: yup.string().required('Bank country is required'),
  beneficiaryName: yup.string().required('Beneficiary name is required'),
  ibanNumber: yup
    .string()
    .required('IBAN number is required')
    .matches(alphaNumeric, 'IBAN must be alpha numeric'),
  swiftCode: yup
    .string()
    .notRequired()
    .matches(alphaNumeric, 'Swift code must be alpha numeric'),
  currency: yup.string().required('Currency is required'),
  bankBranchName: yup.string().notRequired(),
  bankAddress: yup.string().required('Bank address is required'),
});

export const internationalFreelancerStep3Schema = yup.object().shape({
  passportCopy: yup.mixed().required('Signatory Passport is required'),
  nationalIdNumberpdf: yup.mixed().required('National ID is required'),
  bankLetter: yup.mixed().required('Bank letter is required'),
});

export const step1Schema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),
  // .matches(companyNameRegix, 'Only letters, spaces, and & are allowed'),
  tradeLicenseCategory: yup.string().when('$checkType', {
    is: false,
    then: schema => schema.required('Trade license category is required'),
    otherwise: schema => schema.notRequired(),
  }),
  tradeLicenseNumber: yup.string().when(['$checkType'], {
    is: (checkType: boolean) => checkType === false,
    then: schema =>
      schema
        .required('Trade license number is required')
        .matches(alphaNumeric, 'Trade license number must be alphanumeric'),
    otherwise: schema =>
      schema
        .notRequired()
        .matches(alphaNumeric, 'Trade license number must be alphanumeric'),
  }),

  tradeLicenseExpiryDate: yup.date().when('$checkType', {
    is: false,
    then: schema => schema.required('Trade license expiry date is required'),
    otherwise: schema => schema.notRequired(),
  }),

  registrationNumber: yup.string().when('$checkType', {
    is: true,
    then: schema =>
      schema
        .required('Registration number is required')
        .matches(/^\d+$/, 'Registration number must be numeric'),
    otherwise: schema => schema.notRequired(),
  }),

  registrationExpiryDate: yup.date().when(['$checkType', '$checknonEstate'], {
    is: (checkType: boolean, checknonEstate: boolean) =>
      checkType && checknonEstate,
    then: schema => schema.required('Registration expiry date is required'),
    otherwise: schema => schema.notRequired(),
  }),

  companyEmail: yup
    .string()
    .required('Company email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  dialCode: yup.string().required('Dial code is required'),
  companyPhone: yup
    .string()
    .required('Company phone number is required')
    .matches(/^\d+$/, 'Company phone number must contain only digits')
    .max(40, 'Company phone number must not exceed 40 digits'),
  // .when('dialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Company number must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(/^\d{5,15}$/, 'Company number must be 5 to 15 digits'),
  // }),
  propertyConsultant: yup.string().notRequired(), // Optional
  addressLine1: yup.string().required('Address line 1 is required'),
  addressLine2: yup.string().notRequired(), // Optional
  country: yup.string().required('Country is required'),
  city: yup.string().notRequired(),
  poBox: yup.string().notRequired(), // Optional
  companyReraNumber: yup
    .string()
    // .matches(/^\d+$/, 'Only digits are allowed')
    // .min(5, 'RERA number must be at least 5 digits')
    // .max(5, 'RERA number must be at most 5 digits')
    .when(['tradeLicenseCategory', '$headerTitle'], {
      is: (category, headerTitle) =>
        findConditionStatus(
          category,
          dropdownData?.trade_licence_category,
        )?.toLowerCase() != 'freezone' &&
        headerTitle === 'Real Estate Agency (Dubai Based)',
      then: schema =>
        schema
          .required('Company RERA number is required')
          .matches(alphaNumeric, 'Company RERA number must be alphanumeric'),
      otherwise: schema => schema.notRequired(),
    }),
  companyReraRegistrationExpiry: yup
    .date()
    .when(['tradeLicenseCategory', '$headerTitle'], {
      is: (category, headerTitle) =>
        findConditionStatus(
          category,
          dropdownData?.trade_licence_category,
        )?.toLowerCase() != 'freezone' &&
        headerTitle === 'Real Estate Agency (Dubai Based)',
      then: schema =>
        schema
          .required('RERA expiry date is required')
          .test(
            'is-future-date',
            'RERA expiry date must be in the future',
            value => !!value && moment(value).isAfter(moment(), 'day'),
          ),
      otherwise: schema => schema.notRequired(),
    }),

  haveTrn: yup.string().when('$checkType', {
    is: false,
    then: schema => schema.required('Selection Required'),
    otherwise: schema => schema.notRequired(),
  }),

  trnNumber: yup.string().when(['haveTrn'], {
    is: haveTrn => haveTrn.toLowerCase() === 'yes',
    then: schema =>
      schema
        .required('TRN number is required')
        .matches(/^\d{15}$/, 'TRN number must be exactly 15 digits'),
    otherwise: schema =>
      schema.notRequired().matches(/^\d{15}$/, {
        excludeEmptyString: true,
        message: 'TRN number must be exactly 15 digits',
      }),
  }),

  ownership: yup.string().when('$checkType', {
    is: false,
    then: schema => schema.required('Ownership is required'),
    otherwise: schema => schema.notRequired(),
  }),
});
export const step2Schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),

  emiratesIdNum: yup.string().when(['$checkType'], {
    is: (checkType: boolean) => !checkType,
    then: schema =>
      schema
        .required('Emirates ID number is required')
        .matches(emiratesIdRegix, 'Must be in format 123-1234-1234567-1')
        .test('no-zero-blocks', function (value) {
          if (!value) return true;

          const parts = value.split('-');
          if (parts.length !== 4) return true;

          const [a, b, c] = parts; // ignore last digit

          if (a === '000') {
            return this.createError({message: 'First 3 digits cannot be 000.'});
          }
          if (b === '0000') {
            return this.createError({
              message: 'Middle 4 digits cannot be 0000.',
            });
          }
          if (c === '0000000') {
            return this.createError({
              message: 'The 7-digit block cannot be all zeros.',
            });
          }

          return true;
        }),
    otherwise: schema => schema.strip(), // strip from payload if not shown
  }),

  eidExpiryDate: yup.date().when(['$checkType'], {
    is: (checkType: boolean, headerTitle: string) => !checkType,
    then: schema => schema.required('EID expiry date is required'),
    otherwise: schema => schema.strip(),
  }),

  nationalIdNumber: yup
    .string()
    .notRequired()
    .matches(alphaNumeric, 'National ID number must be alpha numeric'),
  // .test(
  //   'emirates-id-format',
  //   'National ID must be in format 123-1234-1234567-1',
  //   value => {
  //     if (!value) return true; // pass if empty or null
  //     const emiratesIdRegex = /^784-\d{4}-\d{7}-\d{1}$/;
  //     return emiratesIdRegex.test(value);
  //   },
  // ),

  nationalExpiryDate: yup.date().notRequired(),
  // .test(
  //   'is-future-date',
  //   'National ID expiry date must be in the future',
  //   value => !!value && moment(value).isAfter(moment(), 'day'),
  // ),
  passportNumber: yup
    .string()
    .required('Passport number is required')
    .matches(alphaNumeric, 'Passport number must be alpha numeric'),
  // .min(6, 'Passport number must be at least 6 characters')
  // .max(9, 'Passport number must be at most 9 characters')
  // .matches(/^[A-Z0-9]+$/, 'Passport must be uppercase letters & numbers'),
  passportIssuePlace: yup.string().required('Passport Issue Place is required'), // Optional
  passportExpiryDate: yup.date().required('Passport expiry date is required'),
  signatoryDialCode: yup.string().required('Signatory dial code is required'),
  signatoryMobile: yup
    .string()
    .required('Signatory mobile is required')
    .matches(/^\d+$/, 'Signatory mobile must contain only digits')
    .max(40, 'Signatory mobile number must not exceed 40 digits'),
  // .when('signatoryDialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(
  //       /^\d{5,15}$/,
  //       'Signatory mobile must be 5 to 15 digits',
  //     ),
  // }),
  signatoryEmail: yup
    .string()
    .notRequired()
    .max(80, 'Email must not exceed 80 characters'),
  // .required('Signatory email is required')
  // .matches(emailreg2, 'Please enter valid email address'),
  role: yup.string().required('Role is required'),
  designation: yup.string().required('Designation is required'),
  brokenReraNumber: yup
    .string()
    .when(['$headerTitle', 'tradeLicenseCategory'], {
      is: (headerTitle: string, tradeLicenseCategory: string) =>
        headerTitle === 'Real Estate Agency (Dubai Based)' &&
        findConditionStatus(
          tradeLicenseCategory,
          dropdownData?.trade_licence_category,
        )?.toLowerCase() === 'ded',
      then: schema =>
        schema
          .required('Broker RERA number is required')
          .matches(alphaNumeric, 'Broker RERA number must be alpha numeric'),
      otherwise: schema => schema.notRequired(),
    }),
  reraRegistrationExpiryDate: yup
    .date()
    .when(['$headerTitle', 'tradeLicenseCategory'], {
      is: (headerTitle: string, category: string) =>
        headerTitle === 'Real Estate Agency (Dubai Based)' &&
        findConditionStatus(
          category,
          dropdownData?.trade_licence_category,
        )?.toLowerCase() === 'ded',
      then: schema => schema.required('RERA registration expiry is required'),
      otherwise: schema => schema.notRequired(),
    }),
});

export const step3Schema = yup.object().shape({
  bankName: yup.string().when(['$headerTitle', '$bankAvailability'], {
    is: (headerTitle: string, bankAvailability: boolean) =>
      isBankFieldRequired(headerTitle, bankAvailability) &&
      headerTitle !== 'Non Real Estate Company',
    then: schema => schema.required('Bank name is required'),
    otherwise: schema => schema.notRequired(),
  }),

  bankAccountNumber: yup.string().when(['$headerTitle', '$bankAvailability'], {
    is: isBankFieldRequired,
    then: schema =>
      schema
        .required('Bank account number is required')
        .matches(alphaNumeric, 'Bank account number must be alpha numeric'),
    otherwise: schema => schema.notRequired(),
  }),

  // yup
  //   .string()
  //   .when(['$headerTitle', '$bankAvailability', '$international'], {
  //     is: (
  //       headerTitle: string,
  //       bankAvailability: boolean,
  //       international: boolean,
  //     ) =>
  //       isBankFieldRequired(headerTitle, bankAvailability) &&
  //       international !== true,
  //     then: schema =>
  //       schema
  //         .required('Bank account number is required')
  //         .matches(/^\d{16}$/, 'Bank account number must be exactly 16 digits'),
  //     otherwise: schema => schema.nullable().required('Bank number is required'), // optional when not required or international is true
  //   }),

  bankCountry: yup.string().when(['$headerTitle', '$bankAvailability'], {
    is: isBankFieldRequired,
    then: schema => schema.required('Bank country is required'),
    otherwise: schema => schema.notRequired(),
  }),

  beneficiaryName: yup.string().when(['$headerTitle', '$bankAvailability'], {
    is: isBankFieldRequired,
    then: schema => schema.required('Beneficiary name is required'),
    otherwise: schema => schema.notRequired(),
  }),

  ibanNumber: yup.string().when(['$headerTitle', '$bankAvailability'], {
    is: isBankFieldRequired,
    then: schema =>
      schema
        .required('IBAN number is required')
        .matches(alphaNumeric, 'IBAN must be alpha numeric'),
    // .length(23, 'IBAN number must be exactly 23 characters'),
    otherwise: schema => schema.notRequired(),
  }),

  swiftCode: yup.string().when(['$headerTitle', '$bankAvailability'], {
    is: isBankFieldRequired,
    then: schema =>
      schema
        .required('Swift Code is required')
        .matches(alphaNumeric, 'Swift Code format, e.g: TESTAA00 Or ABCDXY12'),
    otherwise: schema => schema.notRequired(),
  }),
  currency: yup.string().when(['$headerTitle', '$bankAvailability'], {
    is: isBankFieldRequired,
    then: schema => schema.required('Currency is required'),
    otherwise: schema => schema.notRequired(),
  }),

  bankBranchName: yup.string().when(['$headerTitle', '$bankAvailability'], {
    is: isBankFieldRequired,
    then: schema => schema, // Optional field, keep it as is
    otherwise: schema => schema.notRequired(),
  }),

  bankAddress: yup.string().when(['$headerTitle', '$bankAvailability'], {
    is: isBankFieldRequired,
    then: schema => schema.required('Bank address is required'),
    otherwise: schema => schema.notRequired(),
  }),

  // bankName: yup.string().when(['$checknonEstate', '$checkType'], {
  //   is: (checknonEstate: boolean, checkType: boolean) =>
  //     !(checknonEstate && checkType === false),
  //   then: schema => schema.required('Bank name is required'),
  //   otherwise: schema => schema.notRequired(),
  // }),
  // bankAccountNumber: yup
  //   .string()
  //   .required('Bank account number is required')
  //   .matches(/^\d{16}$/, 'Bank account number must be exactly 16 digits'),
  // bankCountry: yup.string().required('Bank country is required'),
  // beneficiaryName: yup.string().required('Beneficiary name is required'),
  // ibanNumber: yup
  //   .string()
  //   .required('IBAN number is required')
  //   .matches(
  //     /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{23}$/,
  //     'IBAN must letters and numbers (uppercase only)',
  //   )
  //   .length(23, 'IBAN number must be exactly 23 characters'),
  // swiftCode: yup
  //   .string()
  //   .required('Swift Code is required')
  //   .matches(
  //     /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/i,
  //     'Swift Code format, e.g: TESTAA00 Or ABCDXY12',
  //   )
  //   .test(
  //     'swift-length',
  //     'Swift Code must be either 8 or 11 characters',
  //     value => !value || value.length === 8 || value.length === 11,
  //   ),
  // swiftCode: yup
  //   .string()
  //   .notRequired()
  //   .trim()
  //   .test(
  //     'swift-length',
  //     'Swift Code must be either 8 or 11 characters',
  //     value => !value || value.length === 8 || value.length === 11,
  //   ),

  // currency: yup.string().required('Currency is required'),
  // bankBranchName: yup.string(), // Optional
  // bankAddress: yup.string().required('Bank address is required'),
});

export const step3InternationalSchema = yup.object().shape({
  bankName: yup.string().required('Bank name is required'),

  bankAccountNumber: yup
    .string()
    .required('Bank account number is required')
    .matches(alphaNumeric, 'Bank account number must be alpha numeric'),

  bankCountry: yup.string().required('Bank country is required'),

  beneficiaryName: yup.string().required('Beneficiary name is required'),

  ibanNumber: yup
    .string()
    .required('IBAN number is required')
    .matches(alphaNumeric, 'IBAN must be alpha numeric'),
  swiftCode: yup
    .string()
    .notRequired()
    .matches(alphaNumeric, 'Swift code must be alpha numeric'),
  // .matches(
  //   /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/i,
  //   'Swift Code format, e.g: TESTAA00 Or ABCDXY12',
  // )
  // .test(
  //   'swift-length',
  //   'Swift Code must be either 8 or 11 characters',
  //   value => !value || value.length === 8 || value.length === 11,
  // ),
  currency: yup.string().required('Currency is required'),

  bankBranchName: yup.string().when(['$headerTitle', '$bankAvailability'], {
    is: isBankFieldRequired,
    then: schema => schema, // Optional field, keep it as is
    otherwise: schema => schema.notRequired(),
  }),

  bankAddress: yup.string().required('Bank address is required'),
});

export const step4Schema = yup.object().shape({
  passportCopy: yup.mixed().required('Signatory Passport is required'),

  visaCopy: yup.mixed().notRequired(), // Optional globally

  // Required when freelancer is false
  emiratesIdCopy: yup.mixed().when(['$checkType'], {
    is: (checkType: boolean) => !checkType,
    then: schema => schema.required('Emirates ID copy is required'),
    otherwise: schema => schema.notRequired(),
  }),

  // // Required for all freelancers
  nationalIdNumberpdf: yup.mixed().when(['$checkType', '$freelancer'], {
    is: (checkType: boolean, freelancer: boolean) => checkType || freelancer,
    then: schema => schema.required('National ID is required'),
    otherwise: schema => schema.notRequired(),
  }),

  // IBAN Letter required when bank availability is true
  bankLetter: yup.mixed().when(['$bankAvailability'], {
    is: true,
    then: schema => schema.required('IBAN letter is required'),
    otherwise: schema => schema.notRequired(),
  }),

  // VAT Certificate (if not freelancer and answered Yes to having TRN)
  vatCertificate: yup
    .mixed()
    .when(['$freelancer', 'haveTrn', '$checknonEstate'], {
      is: (freelancer: boolean, haveTrn: string, checknonEstate: boolean) =>
        !freelancer && haveTrn.toLowerCase() === 'yes' && !checknonEstate,
      then: schema => schema.required('VAT certificate is required'),
      otherwise: schema => schema.notRequired(),
    }),

  // Non VAT Disclosure (for Dubai-based, non-freelancer, only if answered No to TRN and not Non-Estate)
  nonVatDisclosure: yup
    .mixed()
    .when(['$freelancer', 'haveTrn', '$checknonEstate', '$checkType'], {
      is: (
        freelancer: boolean,
        haveTrn: string,
        checknonEstate: boolean,
        checkType: boolean,
      ) =>
        !freelancer &&
        haveTrn.toLowerCase() == 'no' &&
        !checknonEstate &&
        !checkType, // Only for Dubai Based real estate types
      then: schema => schema.required('Non VAT Disclosure is required'),
      otherwise: schema => schema.notRequired(),
    }),

  // POA MOA – is optional only for partnership
  // poaMoa: yup.mixed().when(['$headerTitle'], {
  //   is: (headerTitle: string) =>
  //     headerTitle === 'Real Estate Agency (Dubai Based)',
  //   then: schema => schema.required('POA & MOA document is required'),
  //   otherwise: schema => schema.notRequired(),
  // }),
  poaMoa: yup.mixed().notRequired(),

  validTradeLicense: yup.mixed().when(['$freelancer', '$headerTitle'], {
    is: (freelancer, headerTitle) =>
      !freelancer && headerTitle === 'Real Estate Agency (Dubai Based)',
    then: schema => schema.required('Valid trade license is required'),
    otherwise: schema => schema.notRequired(),
  }),

  commercialLicense: yup.mixed().when(['$checknonEstate', '$headerTitle'], {
    is: (checknonEstate: boolean, headerTitle: string) =>
      checknonEstate || headerTitle == 'Real Estate Agency (Other Emirates)',
    then: schema =>
      schema.required('Business / Commercial license is required'),
    otherwise: schema => schema.notRequired(),
  }),
  bankAccountStamp: yup
    .mixed()
    .when(['$freelancer', '$checkType', '$checknonEstate'], {
      is: (freelancer, checkType, checknonEstate) =>
        !freelancer && checknonEstate && !checkType,
      then: schema =>
        schema.required('Bank Account Details Document is required'),
      otherwise: schema => schema.notRequired(),
    }),

  reraCertificate: yup
    .mixed()
    .when(['$freelancer', 'tradeLicenseCategory', '$headerTitle'], {
      is: (freelancer, category, headerTitle) =>
        !freelancer &&
        findConditionStatus(
          category,
          dropdownData?.trade_licence_category,
        )?.toLowerCase() !== 'freezone' &&
        headerTitle === 'Real Estate Agency (Dubai Based)',
      then: schema => schema.required('RERA certificate is required'),
      otherwise: schema => schema.notRequired(),
    }),

  brokerCard: yup
    .mixed()
    .when(['$freelancer', 'tradeLicenseCategory', '$headerTitle'], {
      is: (freelancer, category, headerTitle) =>
        !freelancer &&
        findConditionStatus(
          category,
          dropdownData?.trade_licence_category,
        )?.toLowerCase() !== 'freezone' &&
        headerTitle === 'Real Estate Agency (Dubai Based)',
      then: schema => schema.required('Broker card is required'),
      otherwise: schema => schema.notRequired(),
    }),
  registerationCertificate: yup.mixed().when(['$headerTitle'], {
    is: headerTitle => headerTitle == 'International Real Estate Agency',
    then: schema => schema.required('Registration certificate is required'),
    otherwise: schema => schema.notRequired(),
  }),
});

export const step4InternationRealEstateSchema = yup.object().shape({
  passportCopy: yup.mixed().required('Signatory Passport is required'),

  visaCopy: yup.mixed().notRequired(), // Optional globally

  // IBAN Letter required when bank availability is true
  bankLetter: yup.mixed().required('IBAN letter is required'),
  registerationCertificate: yup
    .mixed()
    .required('Registration certificate is required'),
});
export const step4SchemaUAEFreelancer = yup.object().shape({
  passportCopy: yup.mixed().required('Signatory Passport is required'),

  visaCopy: yup.mixed().notRequired(), // Optional globally

  // Required when freelancer is false
  emiratesIdCopy: yup.mixed().required('Emirates ID copy is required'),

  // IBAN Letter required when bank availability is true
  bankLetter: yup.mixed().required('IBAN letter is required'),
});

export const LoginValidation = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  password: yup.string().required('Password is required'),
});

export const FaceIdValidation = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      passwordRegix,
      'Must contain 8+, upper, lower, digit, special char',
    ),
});

export const ForgotPasswordValidation = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
});

export const SignupEmailValidation = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
});

export const SetPasswordValidation = yup.object().shape({
  newPassword: yup
    .string()
    .required('Please enter your password')
    // .min(9, 'Must be 8+ chars')
    .matches(
      passwordRegix,
      'Must contain 8+, upper, lower, digit, special char',
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please enter confirm password'),
});

export const ChangePasswordValidation = yup.object().shape({
  oldPassword: yup.string().required('Please enter your password'),
  newPassword: yup
    .string()
    .required('Please enter your password')
    // .min(9, 'Must be 8+ chars')
    .matches(
      passwordRegix,
      'Must contain 8+, upper, lower, digit, special char',
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please enter confirm password'),
});

export const OtpValidation = yup.object().shape({
  otp: yup
    .string()
    .length(6, 'OTP must be 6 digits')
    .required('Please enter the OTP'),
});

export const AddLeadsValidtion = yup.object().shape({
  salutation: yup.string().required('Title is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  dialCode: yup.string().required('Dial code is required'),
  mobileNumber: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\d+$/, 'Mobile must contain only digits')
    .max(40, 'Mobile number must not exceed 40 digits'),
  // .when('dialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Mobile number must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(/^\d{5,15}$/, 'Mobile number must be 5 to 15 digits'),
  // }),

  email: yup
    .string()
    .required('Email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  nationality: yup.string().required('Nationality is required'),
  salesManager: yup.string().required('Sales manager is required'),
});

// Keeping for refrence, prolly re-use it.
// export const AddAgentValidtion = yup.object().shape({
//   firstName: yup.string().required('First name is required'),
//   lastName: yup.string().required('Last name is required'),
//   nationality: yup.string().required('Nationality is required'),
//   dialCode: yup.string().required('Dial code is required'),
//   companyPhone: yup
//     .string()
//     .required('Agent Phone is required')
//     .when('dialCode', {
//       is: '+971',
//       then: schema =>
//         schema.matches(/^\d{8,9}$/, 'Phone number must be 8 to 9 digits'),
//       otherwise: schema =>
//         schema.matches(/^\d{5,15}$/, 'Phone number must be 5 to 15 digits'),
//     }),

//   companyEmail: yup
//     .string()
//     .required('Email address is required')
//     .matches(emailreg2, 'Please enter valid email address'),
//   emiratesIdNum: yup
//     .string()
//     .required('Emirates ID number is required')
//     .matches(emiratesIdRegix, 'Must be in format 123-1234-1234567-1'),
//   eidExpiryDate: yup.string().required('Emirates ID expiry date is required'),
//   emirateIdIssuePlace: yup
//     .string()
//     .required('Emirates ID issue place is required'),
//   passportNumber: yup
//     .string()
//     .required('Passport number is required')
//     .min(6, 'Passport number must be at least 6 characters')
//     .max(9, 'Passport number must be at most 9 characters')
//     .matches(/^[A-Z0-9]+$/, 'Passport must be uppercase letters & numbers'),
//   passportIssuePlace: yup
//     .string()
//     .required('Passport issue place is required'),
//   passportExpiryDate: yup
//     .string()
//     .required('Passport expiry date is required'),
//   brokenReraNumber: yup
//     .string()
//     .required('RERA number is required')
//     .min(5, 'RERA number must be at least 5 digits')
//     .max(5, 'RERA number must be at most 5 digits')
//     .matches(/^\d+$/, 'Only digits are allowed'),
//   reraRegistrationExpiryDate: yup
//     .string()
//     .required('RERA registration expiry date is required'),
//   role: yup.string().required('Role is required'),
//   designation: yup.string().required('Designation is required'),
//   reraCard: yup.mixed().required('RERA Card upload is required'),
//   emirateIdPdf: yup.mixed().required('Emirates ID upload is required'),
//   passport: yup.mixed().required('Passport is required'),
// });

export const AddAgentValidtion = yup
  .object()
  .shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    nationality: yup.string().required('Nationality is required'),
    dialCode: yup.string().required('Dial code is required'),
    companyPhone: yup
      .string()
      .required('Agent Phone is required')
      .matches(/^\d+$/, 'Agent phone number must contain only digits')
      .max(40, 'Agent phone number must not exceed 40 digits'),
    // .when('dialCode', {
    //   is: '+971',
    //   then: schema =>
    //     schema.matches(/^\d{8,9}$/, 'Phone number must be 8 to 9 digits'),
    //   otherwise: schema =>
    //     schema.matches(/^\d{5,15}$/, 'Phone number must be 5 to 15 digits'),
    // }),
    companyEmail: yup
      .string()
      .required('Email address is required')
      .matches(emailreg2, 'Please enter valid email address')
      .max(80, 'Email must not exceed 80 characters'),
    emiratesIdNum: yup
      .string()
      .notRequired()
      .matches(emiratesIdRegix, 'Must be in format 123-1234-1234567-1')
      .test('no-zero-blocks', function (value) {
        if (!value) return true;

        const parts = value.split('-');
        if (parts.length !== 4) return true;

        const [a, b, c] = parts; // ignore last digit

        if (a === '000') {
          return this.createError({message: 'First 3 digits cannot be 000.'});
        }
        if (b === '0000') {
          return this.createError({message: 'Middle 4 digits cannot be 0000.'});
        }
        if (c === '0000000') {
          return this.createError({
            message: 'The 7-digit block cannot be all zeros.',
          });
        }

        return true;
      }),
    eidExpiryDate: yup.string().notRequired(),
    emirateIdIssuePlace: yup.string().notRequired(),
    passportNumber: yup
      .string()
      .required('Passport number is required')
      .matches(alphaNumeric, 'Passport number must be alpha numeric'),
    // .min(6, 'Passport number must be at least 6 characters')
    // .max(9, 'Passport number must be at most 9 characters')
    // .matches(/^[A-Z0-9]+$/, 'Passport must be uppercase letters & numbers'),
    passportIssuePlace: yup
      .string()
      .required('Passport issue place is required'),
    passportExpiryDate: yup
      .string()
      .required('Passport expiry date is required'),
    brokenReraNumber: yup
      .string()
      .notRequired()
      .matches(alphaNumeric, 'Broker RERA number must be alpha numeric'),
    // .min(5, 'RERA number must be at least 5 digits')
    // .max(5, 'RERA number must be at most 5 digits')
    // .matches(/^\d+$/, 'Only digits are allowed'),
    reraRegistrationExpiryDate: yup.string().notRequired(),
    role: yup.string().required('Role is required'),
    designation: yup.string().required('Designation is required'),

    // All three docs optional here
    reraCard: yup.mixed().nullable(),
    emirateIdPdf: yup.mixed().nullable(),
    passport: yup.mixed().nullable(),
  })
  .test(
    'at-least-one-doc',
    'At least one document is required',
    function (values) {
      const {reraCard, emirateIdPdf, passport} = values;
      return Boolean(reraCard || emirateIdPdf || passport);
    },
  );

export const LeadsFilterValidation = yup.object().shape({});

export const EoiFilterValidation = yup.object().shape({});

export const CommissionFilterValidation = yup.object().shape({});

export const freelancerStep1Schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().when(['$freelancer', '$internationRealEstate'], {
    is: (freelancer, internationRealEstate) =>
      freelancer || internationRealEstate,
    then: schema => schema.required('City is required'),
    otherwise: schema => schema.notRequired(),
  }),
  signatoryDialCode: yup.string().required('Signatory dial code is required'),
  signatoryMobile: yup
    .string()
    .required('Signatory mobile is required')
    .matches(/^\d+$/, 'Signatory mobile must contain only digits')
    .max(40, 'Signatory mobile number must not exceed 40 digits'),
  // .when('signatoryDialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(
  //       /^\d{5,15}$/,
  //       'Signatory mobile must be 5 to 15 digits',
  //     ),
  // }),

  emiratesIdNum: yup.string().when('$checkType', {
    is: (checkType: boolean) => !checkType,
    then: schema =>
      schema
        .required('Emirates ID number is required')
        .matches(emiratesIdRegix, 'Must be in format 123-1234-1234567-1')
        .test('no-zero-blocks', function (value) {
          if (!value) return true;

          const parts = value.split('-');
          if (parts.length !== 4) return true;

          const [a, b, c] = parts; // ignore last digit

          if (a === '000') {
            return this.createError({message: 'First 3 digits cannot be 000.'});
          }
          if (b === '0000') {
            return this.createError({
              message: 'Middle 4 digits cannot be 0000.',
            });
          }
          if (c === '0000000') {
            return this.createError({
              message: 'The 7-digit block cannot be all zeros.',
            });
          }

          return true;
        }),
    otherwise: schema => schema.strip(), // strip from payload if not shown
  }),

  eidExpiryDate: yup.date().when('$checkType', {
    is: (checkType: boolean) => !checkType,
    then: schema => schema.required('EID expiry date is required'),
    otherwise: schema => schema.strip(),
  }),
  nationalIdNumber: yup
    .string()
    .notRequired()
    .matches(alphaNumeric, 'National ID number must be alpha numeric'),
  // .test(
  //   'emirates-id-format',
  //   'National ID must be in format 123-1234-1234567-1',
  //   value => {
  //     if (!value) return true; // pass if empty or null
  //     const emiratesIdRegex = /^784-\d{4}-\d{7}-\d{1}$/;
  //     return emiratesIdRegex.test(value);
  //   },
  // ),

  nationalExpiryDate: yup.date().notRequired(),
  // .test(
  //   'is-future-date',
  //   'National ID expiry date must be in the future',
  //   value => !!value && moment(value).isAfter(moment(), 'day'),
  // ),
  passportNumber: yup
    .string()
    .required('Passport number is required')
    .matches(alphaNumeric, 'Passport number must be alpha numeric'),
  // .min(6, 'Passport number must be at least 6 characters')
  // .max(9, 'Passport number must be at most 9 characters')
  // .matches(/^[A-Z0-9]+$/, 'Passport must be uppercase letters & numbers'),
  passportIssuePlace: yup.string().required('Passport issue place is required'),
  passportExpiryDate: yup.date().required('Passport expiry date is required'),
  signatoryEmail: yup
    .string()
    .required('Signatory email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  addressLine1: yup.string().required('Address line 1 is required'),
  addressLine2: yup.string(), // Still optional
  poBox: yup.string().required('P.O. Box is required'),
});

export const BankDetailsValidation = yup.object().shape({
  bankCountry: yup.string().required('Bank country is required'),
  bankName: yup.string().when('$bankNameMandatory', {
    is: true,
    then: schema => schema.required('Bank name is required'),
    otherwise: schema => schema.notRequired(),
  }),
  bankAccountNumber: yup
    .string()
    .required('Bank account number is required')
    .matches(alphaNumeric, 'Bank account number must be alpha numeric'),
  beneficiaryName: yup.string().required('Beneficiary name is required'),
  ibanNumber: yup
    .string()
    .required('IBAN number is required')
    .matches(alphaNumeric, 'IBAN must be alpha numeric'),
  swiftCode: yup
    .string()
    .required('Swift Code is required')
    .matches(alphaNumeric, 'Swift code must be alpha numeric'),

  currency: yup.string().required('Currency is required'),
  bankBranchName: yup.string().nullable(), // optional
  bankAddress: yup.string().required('Bank address is required'),
  bankDocuments: yup.mixed().required('This document is required'),
});

///////////////////////////////Document Update Validations//////////////////////////////////////
export const UpdateDocumentValidation = yup.object().shape({
  updateDocument: yup.mixed().required('Please select a document to update'),
});

export const UpdateTradeLicenseValidation = yup.object().shape({
  updateDocument: yup.mixed().required('Please select a document to update'),
  expiry: yup.string().required('Trade license expiry date is required'),
  documentNumber: yup.string().required('Trade license number is required'),
});
export const UpdateNationalCardValidation = yup.object().shape({
  updateDocument: yup.mixed().required('Please select a document to update'),
  expiry: yup.string().required('National Card expiry date is required'),
  documentNumber: yup.string().required('National Card number is required'),
});
export const UpdateEmiratesCardValidation = yup.object().shape({
  updateDocument: yup.mixed().required('Please select a document to update'),
  expiry: yup.string().required('Emirates Card expiry date is required'),
  documentNumber: yup
    .string()
    .required('Emirates ID number is required')
    .matches(emiratesIdRegix, 'Must be in format 123-1234-1234567-1')
    .test('no-zero-blocks', function (value) {
      if (!value) return true;

      const parts = value.split('-');
      if (parts.length !== 4) return true;

      const [a, b, c] = parts; // ignore last digit

      if (a === '000') {
        return this.createError({message: 'First 3 digits cannot be 000.'});
      }
      if (b === '0000') {
        return this.createError({message: 'Middle 4 digits cannot be 0000.'});
      }
      if (c === '0000000') {
        return this.createError({
          message: 'The 7-digit block cannot be all zeros.',
        });
      }

      return true;
    }),
});

export const UpdatePassportValidation = yup.object().shape({
  updateDocument: yup.mixed().required('Please select a document to update'),
  expiry: yup.string().required('Passport expiry date is required'),
  place: yup.string().required('Passport place is required'),
  passportNumber: yup
    .string()
    .required('Passport number is required')
    .matches(alphaNumeric, 'Passport number must be alpha numeric'),
  // .min(6, 'Passport number must be at least 6 characters')
  // .max(9, 'Passport number must be at most 9 characters')
  // .matches(/^[A-Z0-9]+$/, 'Passport must be uppercase letters & numbers'),
});

export const UpdateRERACertificateValidation = yup.object().shape({
  updateDocument: yup.mixed().required('Please select a document to update'),
  expiry: yup.string().required('RERA Certificate expiry date is required'),
  reraNumber: yup
    .string()
    .required('RERA number is required')
    .matches(alphaNumeric, 'Broker RERA number must be alpha numeric'),
});
///////////////////////////////Document Update Validations//////////////////////////////////////
const getPaymentModes = () =>
  store?.getState()?.user?.dropdownData?.payment_mode || [];
export const individualSchema = yup.object().shape({
  applicantType: yup.string().oneOf(['Individual']).required(),

  // Individual fields
  title: yup.string().required('Title is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .required('Email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  dialCode: yup.string().required('Dial code is required'),
  mobilePhone: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\d+$/, 'Mobile must contain only digits')
    .max(40, 'Mobile number must not exceed 40 digits'),
  // .when('dialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Mobile number must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(/^\d{5,15}$/, 'Mobile number must be 5 to 15 digits'),
  // }),
  countryOfResidence: yup.string().required('Residence is required'),
  nationality: yup.string().required('Nationality is required'),
  // Info section
  bookingType: yup.string().required('Booking type is required'),
  projectName: yup.string().required('Project name is required'),
  salesManager: yup.string().required('Sales manager is required'),
  // Unit preferences
  unitPreferences: yup.array().of(
    yup.object().shape({
      unitPreference: yup.string().required('Unit Preference is required'),
      noOfUnits: yup
        .number()
        .transform((value, originalValue) => {
          const parsed = Number(String(originalValue).replace(/,/g, ''));
          return Number.isNaN(parsed) ? value : parsed;
        })
        .required("Unit's quantity is required")
        .typeError('No of units must be a number')
        .min(1, 'At least 1 unit is required'),
      eoiAmount: yup
        .number()
        .transform((value, originalValue) => {
          const parsed = Number(String(originalValue).replace(/,/g, ''));
          return Number.isNaN(parsed) ? value : parsed;
        })
        .typeError('EOI amount must be a number')
        .required('EOI Amount is required'),
      remarks: yup.string().required('Remarks is required'),
    }),
  ),

  // Payment
  totalEoiAmount: yup
    .string()
    .required('Total EOI amount is required')
    .test('minimum-amount', function (value) {
      const {parent} = this;
      const unitPreferences = parent.unitPreferences;

      if (!unitPreferences || !Array.isArray(unitPreferences)) {
        return true;
      }

      const calculatedAmount = unitPreferences.reduce(
        (total: number, unit: any) => {
          return total + (Number(unit.eoiAmount) || 0);
        },
        0,
      );

      const enteredAmount = Number(value) || 0;

      if (enteredAmount < calculatedAmount) {
        return this.createError({
          message: `Total EOI cannot be less than ${calculatedAmount.toLocaleString()}`,
        });
      }

      return true;
    }),
  modeOfPayment: yup.string().required('Mode of payment is required'),
  chequeBankName: yup.string().nullable(),
  // .when('modeOfPayment', {
  //   is: value => {
  //     const selected = paymentModes.find(item => item.id === value);
  //     return selected?.key === 'Bank Transfer';
  //   },
  //   then: schema => schema.required('Bank Name is required'),
  //   otherwise: schema => schema.nullable(),
  // }),

  sourceOfFund: yup
    .string()
    .nullable()
    .when('modeOfPayment', {
      is: value => {
        const selected = getPaymentModes()?.find(item => item.id === value);
        return selected?.key === 'Cash';
      },
      then: schema => schema.required('Source of Fund is required'),
      otherwise: schema => schema.nullable(),
    }),

  sourceOfWealth: yup.string().notRequired(),
  // .when('modeOfPayment', {
  //   is: value => {
  //     const selected = getPaymentModes()?.find(item => item.id === value);
  //     return selected?.key === 'Cash';
  //   },
  //   then: schema => schema.required('Source of Wealth is required'),
  //   otherwise: schema => schema.nullable(),
  // }),

  // KYC
  passportNumber: yup.string().required('Passport number is required'),
  passportExpiryDate: yup.date().required('Passport expiry date is required'),
  nationalIdNumber: yup
    .string()
    .required('National ID number is required')
    .matches(alphaNumeric, 'National ID number must be alpha numeric'),
  nationIdExpiryDate: yup
    .date()
    .required('National ID expiry date is required'),
  addressLine2: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal code is required'),

  // Cheque Fields (required if modeOfPayment === 'Cheque')
  // chequeNumber: yup
  //   .string()
  //   .nullable()
  //   .when('modeOfPayment', {
  //     is: value => {
  //       const selected = paymentModes.find(item => item.id === value);
  //       return selected?.key === 'Cheque';
  //     },
  //     then: schema => schema.required('Cheque number is required'),
  //   }),

  // chequeDate: yup
  //   .date()
  //   .nullable()
  //   .when('modeOfPayment', {
  //     is: value => {
  //       const selected = paymentModes.find(item => item.id === value);
  //       return selected?.key === 'Cheque';
  //     },
  //     then: schema => schema.required('Cheque date is required'),
  //   }),

  // partyCheque: yup
  //   .string()
  //   .nullable()
  //   .when('modeOfPayment', {
  //     is: value => {
  //       const selected = paymentModes.find(item => item.id === value);
  //       return selected?.key === 'Cheque';
  //     },
  //     then: schema => schema.required('Party cheque selection is required'),
  //   }),

  // Docs
  passport: yup.mixed().required('Passport is required'),
  nationalId: yup.mixed().nullable(),
  proofOfPayment: yup
    .mixed()
    .nullable()
    .when('modeOfPayment', {
      // is: value => value !== 'Cash' && value !== 'Online',
      is: value => {
        const selected = getPaymentModes()?.find(item => item.id === value);
        return selected?.key !== 'Cash' && selected?.key !== 'Online';
      },
      then: schema => schema.required('Proof of payment is required'),
      otherwise: schema => schema.nullable(),
    }),
});

export const corporateSchema = yup.object().shape({
  applicantType: yup.string().oneOf(['Corporate']).required(),

  // Corporate fields
  companyName: yup.string().required('Company name is required'),
  companyEmail: yup
    .string()
    .required('Company email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),
  dialCode: yup.string().required('Dial code is required'),
  companyMobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\d+$/, 'Mobile must contain only digits')
    .max(40, 'Mobile number must not exceed 40 digits'),
  // .when('dialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Mobile number must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(/^\d{5,15}$/, 'Mobile number must be 5 to 15 digits'),
  // }),

  // Info section
  bookingType: yup.string().required('Booking type is required'),
  projectName: yup.string().required('Project name is required'),
  salesManager: yup.string().required('Sales manager is required'),

  // Unit preferences
  unitPreferences: yup.array().of(
    yup.object().shape({
      unitPreference: yup.string().required('Unit Preference is required'),
      noOfUnits: yup
        .number()
        .transform((value, originalValue) => {
          const parsed = Number(String(originalValue).replace(/,/g, ''));
          return Number.isNaN(parsed) ? value : parsed;
        })
        .required("Unit's quantity is required")
        .typeError('No of units must be a number')
        .min(1, 'At least 1 unit is required'),
      eoiAmount: yup
        .number()
        .transform((value, originalValue) => {
          const parsed = Number(String(originalValue).replace(/,/g, ''));
          return Number.isNaN(parsed) ? value : parsed;
        })
        .typeError('EOI amount must be a number')
        .required('EOI Amount is required'),
      remarks: yup.string().required('Remarks is required'),
    }),
  ),

  // Payment
  totalEoiAmount: yup
    .string()
    .required('Total EOI amount is required')
    .test('minimum-amount', function (value) {
      const {parent} = this;
      const unitPreferences = parent.unitPreferences;

      if (!unitPreferences || !Array.isArray(unitPreferences)) {
        return true;
      }

      const calculatedAmount = unitPreferences.reduce(
        (total: number, unit: any) => {
          return total + (Number(unit.eoiAmount) || 0);
        },
        0,
      );

      const enteredAmount = Number(value) || 0;

      if (enteredAmount < calculatedAmount) {
        return this.createError({
          message: `Total EOI cannot be less than ${calculatedAmount.toLocaleString()}`,
        });
      }

      return true;
    }),
  modeOfPayment: yup.string().required('Mode of payment is required'),
  chequeBankName: yup.string().nullable(),
  sourceOfFund: yup
    .string()
    .nullable()
    .when('modeOfPayment', {
      is: value => {
        const selected = getPaymentModes()?.find(item => item.id === value);
        return selected?.key === 'Cash';
      },
      then: schema => schema.required('Source of Fund is required'),
      otherwise: schema => schema.nullable(),
    }),
  sourceOfWealth: yup.string().notRequired(),
  // .nullable()
  // .when('modeOfPayment', {
  //   is: value => {
  //     const selected = getPaymentModes()?.find(item => item.id === value);
  //     return selected?.key === 'Cash';
  //   },
  //   then: schema => schema.required('Source of Wealth is required'),
  //   otherwise: schema => schema.nullable(),
  // }),
  // Cheque Fields (required if modeOfPayment === 'Cheque')

  // chequeNumber: yup
  //   .string()
  //   .nullable()
  //   .when('modeOfPayment', {
  //     is: value => {
  //       const selected = paymentModes.find(item => item.id === value);
  //       return selected?.key === 'Cheque';
  //     },
  //     then: schema => schema.required('Cheque number is required'),
  //   }),

  // chequeDate: yup
  //   .date()
  //   .nullable()
  //   .when('modeOfPayment', {
  //     is: value => {
  //       const selected = paymentModes.find(item => item.id === value);
  //       return selected?.key === 'Cheque';
  //     },
  //     then: schema => schema.required('Cheque date is required'),
  //   }),

  // partyCheque: yup
  //   .string()
  //   .nullable()
  //   .when('modeOfPayment', {
  //     is: value => {
  //       const selected = paymentModes.find(item => item.id === value);
  //       return selected?.key === 'Cheque';
  //     },
  //     then: schema => schema.required('Party cheque selection is required'),
  //   }),

  // KYC

  companyRegistrationDate: yup
    .date()
    .required('Registration expiry date is required'),

  companyRegistrationNo: yup
    .string()
    .required('Registration number is required'),

  companyRegistrationPlace: yup
    .string()
    .required('Company registration place is required'),

  tradeLicenseNo: yup.string().required('Trade license number is required'),

  tradeLicenseExpiry: yup
    .date()
    .required('Trade license expiry date is required'),

  // Docs
  passport: yup.mixed().required('Passport is required'),
  proofOfPayment: yup
    .mixed()
    .nullable()
    .when('modeOfPayment', {
      is: value => {
        const selected = getPaymentModes()?.find(item => item.id === value);
        return selected?.key != 'Cash' && selected?.key != 'Online';
      },
      then: schema => schema.required('Proof of payment is required'),
      otherwise: schema => schema.nullable(),
    }),
  tradeLicense: yup
    .mixed()
    .nullable()
    .when('modeOfPayment', {
      is: value => {
        const selected = getPaymentModes()?.find(item => item.id === value);
        return selected?.key == 'Cash';
      },
      then: schema => schema.required('Trade license is required'),
      otherwise: schema => schema.nullable(),
    }),
});

// Dynamically pick schema based on applicantType so resolver stays stable across tab switches
export const eoiSchema = yup.lazy((values: any) => {
  return values?.applicantType === 'Corporate'
    ? (corporateSchema as yup.ObjectSchema<any>)
    : (individualSchema as yup.ObjectSchema<any>);
}) as unknown as yup.ObjectSchema<any>;

export const AddSalesOfferValidation = yup.object().shape({
  propertyName: yup.string().required('Property name is required'),
  buildingName: yup.string().notRequired(),
  unitType: yup.string().notRequired(),
  numberOfBedrooms: yup.string().notRequired(),
});

export const uploadInvoiceValidation = yup.object().shape({
  invoiceDocument: yup.mixed().required('Invoice is required'),
});

/////////////// Other Emirates /////////////////
export const step1OtherEmiratesSchema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),

  tradeLicenseCategory: yup
    .string()
    .required('Trade license category is required'),

  tradeLicenseNumber: yup
    .string()
    .required('Trade license number is required')
    .matches(alphaNumeric, 'Trade license number must be alphanumeric'),

  tradeLicenseExpiryDate: yup
    .date()
    .required('Trade license expiry date is required'),

  companyEmail: yup
    .string()
    .required('Company email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),

  dialCode: yup.string().required('Dial code is required'),

  companyPhone: yup
    .string()
    .required('Company phone number is required')
    .matches(/^\d+$/, 'Company phone number must contain only digits'),
  // .when('dialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Company number must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(/^\d{5,15}$/, 'Company number must be 5 to 15 digits'),
  // }),

  propertyConsultant: yup.string().notRequired(), // Optional

  addressLine1: yup.string().required('Address line 1 is required'),

  addressLine2: yup.string().notRequired(), //

  country: yup.string().required('Country is required'),

  city: yup.string().notRequired(),

  poBox: yup.string().notRequired(), // Optional

  haveTrn: yup.string().required('Selection Required'),

  trnNumber: yup.string().when(['haveTrn'], {
    is: haveTrn => haveTrn?.toLowerCase() === 'yes',
    then: schema =>
      schema
        .required('TRN number is required')
        .matches(/^\d{15}$/, 'TRN number must be exactly 15 digits'),
    otherwise: schema =>
      schema.notRequired().matches(/^\d{15}$/, {
        excludeEmptyString: true,
        message: 'TRN number must be exactly 15 digits',
      }),
  }),

  ownership: yup.string().required('Ownership is required'),
});

export const step2OtherEmiratesSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),

  emiratesIdNum: yup
    .string()
    .required('Emirates ID number is required')
    .matches(emiratesIdRegix, 'Must be in format 123-1234-1234567-1')
    .test('no-zero-blocks', function (value) {
      if (!value) return true;

      const parts = value.split('-');
      if (parts.length !== 4) return true;

      const [a, b, c] = parts; // ignore last digit

      if (a === '000') {
        return this.createError({message: 'First 3 digits cannot be 000.'});
      }
      if (b === '0000') {
        return this.createError({message: 'Middle 4 digits cannot be 0000.'});
      }
      if (c === '0000000') {
        return this.createError({
          message: 'The 7-digit block cannot be all zeros.',
        });
      }

      return true;
    }),
  eidExpiryDate: yup.date().required('EID expiry date is required'),

  passportNumber: yup
    .string()
    .required('Passport number is required')
    .matches(alphaNumeric, 'Passport number must be alpha numeric'),

  passportIssuePlace: yup.string().required('Passport Issue Place is required'),

  passportExpiryDate: yup.date().required('Passport expiry date is required'),

  signatoryDialCode: yup.string().required('Signatory dial code is required'),

  signatoryMobile: yup
    .string()
    .required('Signatory mobile is required')
    .matches(/^\d+$/, 'Signatory mobile must contain only digits')
    .max(40, 'Signatory mobile number must not exceed 40 digits'),
  // .when('signatoryDialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(
  //       /^\d{5,15}$/,
  //       'Signatory mobile must be 5 to 15 digits',
  //     ),
  // }),
  signatoryEmail: yup
    .string()
    .notRequired()
    .max(80, 'Email must not exceed 80 characters'),

  role: yup.string().required('Role is required'),

  designation: yup.string().required('Designation is required'),
});

export const step3OtherEmiratesSchema = yup.object().shape({
  bankName: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Bank name is required'),
    otherwise: schema => schema.notRequired(),
  }),

  bankAccountNumber: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema =>
      schema
        .required('Bank account number is required')
        .matches(alphaNumeric, 'Bank account number must be alpha numeric'),
    otherwise: schema => schema.notRequired(),
  }),

  bankCountry: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Bank country is required'),
    otherwise: schema => schema.notRequired(),
  }),

  beneficiaryName: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Beneficiary name is required'),
    otherwise: schema => schema.notRequired(),
  }),

  ibanNumber: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema =>
      schema
        .required('IBAN number is required')
        .matches(alphaNumeric, 'IBAN must be alpha numeric'),
    otherwise: schema => schema.notRequired(),
  }),

  swiftCode: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema =>
      schema
        .required('Swift Code is required')
        .matches(alphaNumeric, 'Swift Code must be alpha numeric'),
    otherwise: schema => schema.notRequired(),
  }),
  currency: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Currency is required'),
    otherwise: schema => schema.notRequired(),
  }),

  bankBranchName: yup.string().notRequired(),

  bankAddress: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Bank address is required'),
    otherwise: schema => schema.notRequired(),
  }),
});

export const step4OtherEmiratesSchema = yup.object().shape({
  passportCopy: yup.mixed().required('Signatory Passport is required'),

  visaCopy: yup.mixed().notRequired(), // Optional globally

  // Required when freelancer is false
  emiratesIdCopy: yup.mixed().required('Emirates ID copy is required'),

  // IBAN Letter required when bank availability is true
  bankLetter: yup.mixed().when(['$bankAvailability'], {
    is: true,
    then: schema => schema.required('IBAN letter is required'),
    otherwise: schema => schema.notRequired(),
  }),

  // VAT Certificate (if Yes to having TRN)
  vatCertificate: yup.mixed().when(['haveTrn'], {
    is: (haveTrn: string) => haveTrn.toLowerCase() === 'yes',
    then: schema => schema.required('VAT certificate is required'),
    otherwise: schema => schema.notRequired(),
  }),

  // Non VAT Disclosure (for Dubai-based, non-freelancer, only if answered No to TRN and not Non-Estate)
  nonVatDisclosure: yup.mixed().when(['haveTrn'], {
    is: (haveTrn: string) => haveTrn.toLowerCase() === 'no',
    then: schema => schema.required('Non VAT Disclosure is required'),
    otherwise: schema => schema.notRequired(),
  }),

  // POA MOA – required for non-freelancers
  poaMoa: yup.mixed().notRequired(),

  commercialLicense: yup
    .mixed()
    .required('Business / Commercial license is required'),
});
/////////////// Other Emirates /////////////////

////////// Non Real Estate (UAE) ////////

export const step1NonRealEstateSchema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),

  tradeLicenseCategory: yup
    .string()
    .required('Trade license category is required'),

  tradeLicenseNumber: yup
    .string()
    .required('Trade license number is required')
    .matches(alphaNumeric, 'Trade license number must be alphanumeric'),

  tradeLicenseExpiryDate: yup
    .date()
    .required('Trade license expiry date is required'),

  companyEmail: yup
    .string()
    .required('Company email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),

  dialCode: yup.string().required('Dial code is required'),

  companyPhone: yup
    .string()
    .required('Company phone number is required')
    .matches(/^\d+$/, 'Company phone number must contain only digits'),
  // .when('dialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Company number must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(/^\d{5,15}$/, 'Company number must be 5 to 15 digits'),
  // }),
  propertyConsultant: yup.string().notRequired(), // Optional
  addressLine1: yup.string().required('Address line 1 is required'),
  addressLine2: yup.string().notRequired(), // Optional
  country: yup.string().required('Country is required'),
  city: yup.string().notRequired(),
  poBox: yup.string().notRequired(), // Optional

  haveTrn: yup.string().required('Selection Required'),

  trnNumber: yup.string().when(['haveTrn'], {
    is: haveTrn => haveTrn?.toLowerCase() === 'yes',
    then: schema =>
      schema
        .required('TRN number is required')
        .matches(/^\d{15}$/, 'TRN number must be exactly 15 digits'),
    otherwise: schema =>
      schema.notRequired().matches(/^\d{15}$/, {
        excludeEmptyString: true,
        message: 'TRN number must be exactly 15 digits',
      }),
  }),

  ownership: yup.string().required('Ownership is required'),
});
export const step2NonRealEstateSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),

  emiratesIdNum: yup
    .string()
    .required('Emirates ID number is required')
    .matches(emiratesIdRegix, 'Must be in format 123-1234-1234567-1')
    .test('no-zero-blocks', function (value) {
      if (!value) return true;

      const parts = value.split('-');
      if (parts.length !== 4) return true;

      const [a, b, c] = parts; // ignore last digit

      if (a === '000') {
        return this.createError({message: 'First 3 digits cannot be 000.'});
      }
      if (b === '0000') {
        return this.createError({message: 'Middle 4 digits cannot be 0000.'});
      }
      if (c === '0000000') {
        return this.createError({
          message: 'The 7-digit block cannot be all zeros.',
        });
      }

      return true;
    }),

  eidExpiryDate: yup.date().required('EID expiry date is required'),

  passportNumber: yup
    .string()
    .required('Passport number is required')
    .matches(alphaNumeric, 'Passport number must be alpha numeric'),

  passportIssuePlace: yup.string().required('Passport Issue Place is required'),

  passportExpiryDate: yup.date().required('Passport expiry date is required'),
  signatoryDialCode: yup.string().required('Signatory dial code is required'),

  signatoryMobile: yup
    .string()
    .required('Signatory mobile is required')
    .matches(/^\d+$/, 'Signatory mobile must contain only digits')
    .max(40, 'Signatory mobile number must not exceed 40 digits'),
  // .when('signatoryDialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(
  //       /^\d{5,15}$/,
  //       'Signatory mobile must be 5 to 15 digits',
  //     ),
  // }),
  signatoryEmail: yup
    .string()
    .notRequired()
    .max(80, 'Email must not exceed 80 characters'),
  role: yup.string().required('Role is required'),
  designation: yup.string().required('Designation is required'),
});
export const step3NonRealEstateSchema = yup.object().shape({
  bankName: yup.string().notRequired(),

  bankAccountNumber: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema =>
      schema
        .required('Bank account number is required')
        .matches(alphaNumeric, 'Bank account number must be alpha numeric'),
    otherwise: schema => schema.notRequired(),
  }),

  bankCountry: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Bank country is required'),
    otherwise: schema => schema.notRequired(),
  }),

  beneficiaryName: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Beneficiary name is required'),
    otherwise: schema => schema.notRequired(),
  }),

  ibanNumber: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema =>
      schema
        .required('IBAN number is required')
        .matches(alphaNumeric, 'IBAN must be alpha numeric'),
    otherwise: schema => schema.notRequired(),
  }),

  swiftCode: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema =>
      schema
        .required('Swift Code is required')
        .matches(alphaNumeric, 'Swift Code must be alpha numeric'),
    otherwise: schema => schema.notRequired(),
  }),
  currency: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Currency is required'),
    otherwise: schema => schema.notRequired(),
  }),

  bankBranchName: yup.string().notRequired(),

  bankAddress: yup.string().when(['$bankAvailability'], {
    is: (bankAvailability: boolean) => bankAvailability,
    then: schema => schema.required('Bank address is required'),
    otherwise: schema => schema.notRequired(),
  }),
});
export const step4NonRealEstateSchema = yup.object().shape({
  passportCopy: yup.mixed().required('Signatory Passport is required'),

  visaCopy: yup.mixed().notRequired(), // Optional globally

  // Required when freelancer is false
  emiratesIdCopy: yup.mixed().required('Emirates ID copy is required'),

  // IBAN Letter required when bank availability is true
  bankLetter: yup.mixed().when(['$bankAvailability'], {
    is: true,
    then: schema => schema.required('IBAN letter is required'),
    otherwise: schema => schema.notRequired(),
  }),

  // POA MOA – required for non-freelancers
  poaMoa: yup.mixed().notRequired(),

  commercialLicense: yup
    .mixed()
    .required('Business / Commercial license is required'),

  bankAccountStamp: yup
    .mixed()
    .required('Bank Account Details Document is required'),
});
////////// Non Real Estate (UAE) ////////

/////// Freelance (UAE)  ///////
export const step1FreelanceUAESchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),

  lastName: yup.string().required('Last name is required'),

  country: yup.string().required('Country is required'),

  city: yup.string().required('City is required'),

  signatoryDialCode: yup.string().required('Signatory dial code is required'),

  signatoryMobile: yup
    .string()
    .required('Signatory mobile is required')
    .matches(/^\d+$/, 'Signatory mobile must contain only digits')
    .max(40, 'Signatory mobile number must not exceed 40 digits'),
  // .when('signatoryDialCode', {
  //   is: '+971',
  //   then: schema =>
  //     schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
  //   otherwise: schema =>
  //     schema.matches(
  //       /^\d{5,15}$/,
  //       'Signatory mobile must be 5 to 15 digits',
  //     ),
  // }),

  signatoryEmail: yup
    .string()
    .required('Signatory email is required')
    .matches(emailreg2, 'Please enter valid email address')
    .max(80, 'Email must not exceed 80 characters'),

  emiratesIdNum: yup
    .string()
    .required('Emirates ID number is required')
    .matches(emiratesIdRegix, 'Must be in format 123-1234-1234567-1')
    .test('no-zero-blocks', function (value) {
      if (!value) return true;

      const parts = value.split('-');
      if (parts.length !== 4) return true;

      const [a, b, c] = parts; // ignore last digit

      if (a === '000') {
        return this.createError({message: 'First 3 digits cannot be 000.'});
      }
      if (b === '0000') {
        return this.createError({message: 'Middle 4 digits cannot be 0000.'});
      }
      if (c === '0000000') {
        return this.createError({
          message: 'The 7-digit block cannot be all zeros.',
        });
      }

      return true;
    }),

  eidExpiryDate: yup.date().required('EID expiry date is required'),

  passportNumber: yup
    .string()
    .required('Passport number is required')
    .matches(alphaNumeric, 'Passport number must be alpha numeric'),

  passportIssuePlace: yup.string().required('Passport issue place is required'),

  passportExpiryDate: yup.date().required('Passport expiry date is required'),

  addressLine1: yup.string().required('Address line 1 is required'),
  addressLine2: yup.string(), // Still optional
  poBox: yup.string().required('P.O. Box is required'),
});
export const step2FreelanceUAESchema = yup.object().shape({
  bankName: yup.string().required('Bank name is required'),

  bankAccountNumber: yup
    .string()
    .required('Bank account number is required')
    .matches(alphaNumeric, 'Bank account number must be alpha numeric'),

  bankCountry: yup.string().required('Bank country is required'),

  beneficiaryName: yup.string().required('Beneficiary name is required'),

  ibanNumber: yup
    .string()
    .required('IBAN number is required')
    .matches(alphaNumeric, 'IBAN must be alpha numeric'),

  swiftCode: yup
    .string()
    .required('Swift Code is required')
    .matches(alphaNumeric, 'Swift Code must be alpha numeric'),

  currency: yup.string().required('Currency is required'),

  bankBranchName: yup.string().notRequired(),

  bankAddress: yup.string().required('Bank address is required'),
});
export const step4FreelanceUAESchema = yup.object().shape({
  passportCopy: yup.mixed().required('Signatory Passport is required'),

  visaCopy: yup.mixed().notRequired(), // Optional globally

  // Required when freelancer is false
  emiratesIdCopy: yup.mixed().required('Emirates ID copy is required'),

  // IBAN Letter required when bank availability is true
  bankLetter: yup.mixed().required('IBAN letter is required'),
});
/////// Freelance (UAE)  ///////

// export const internationNonRealEstateStep1Schema = yup.object().shape({
//   companyName: yup.string().required('Company name is required'),
//   registrationNumber: yup
//     .string()
//     .required('Registration number is required')
//     .matches(alphaNumeric, 'Registration Number must be alpha numeric'),
//   registrationExpiryDate: yup
//     .date()
//     .required('Registration expiry date is required'),
//   country: yup.string().required('Country is required'),
//   city: yup.string().notRequired(),
//   dialCode: yup.string().required('Dial code is required'),
//   companyPhone: yup
//     .string()
//     .required('Company phone number is required')
//     .when('dialCode', {
//       is: '+971',
//       then: schema =>
//         schema.matches(/^\d{8,9}$/, 'Company number must be 8 to 9 digits'),
//       otherwise: schema =>
//         schema.matches(/^\d{5,15}$/, 'Company number must be 5 to 15 digits'),
//     }),
//   companyEmail: yup
//     .string()
//     .required('Company email is required')
//     .matches(emailreg2, 'Please enter valid email address'),
//   addressLine1: yup.string().required('Address line 1 is required'),
//   addressLine2: yup.string().notRequired(), // Optional
//   poBox: yup.string().notRequired(), // Optional
//   propertyConsultant: yup.string().notRequired(),
// });
// export const internationNonRealEstateStep2Schema = yup.object().shape({
//   firstName: yup.string().required('First name is required'),
//   lastName: yup.string().required('Last name is required'),
//   nationalIdNumber: yup.string().notRequired(),
//   nationIdExpiryDate: yup.date().notRequired(),
//   passportNumber: yup.string().required('Passport number is required'),
//   passportIssuePlace: yup.string().required('Passport Issue Place is required'), // Optional
//   passportExpiryDate: yup.date().required('Passport expiry date is required'),
//   signatoryDialCode: yup.string().required('Signatory dial code is required'),
//   signatoryMobile: yup
//     .string()
//     .required('Signatory mobile is required')
//     .when('signatoryDialCode', {
//       is: '+971',
//       then: schema =>
//         schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
//       otherwise: schema =>
//         schema.matches(
//           /^\d{5,15}$/,
//           'Signatory mobile must be 5 to 15 digits',
//         ),
//     }),
//   signatoryEmail: yup
//     .string()
//     .required('Signatory email is required')
//     .matches(emailreg2, 'Please enter valid email address'),
//   role: yup.string().required('Role is required'),
//   designation: yup.string().required('Designation is required'),
// });

// export const internationNonRealEstateStep3Schema = yup.object().shape({
//   bankCountry: yup.string().required('Bank country is required'),
//   bankName: yup.string().required('Bank name is required'),
//   bankAccountNumber: yup
//     .string()
//     .required('Bank account number is required')
//     .matches(/^[0-9]+$/, 'Bank account number must be numeric'),
//   beneficiaryName: yup.string().required('Beneficiary name is required'),
//   ibanNumber: yup
//     .string()
//     .required('IBAN number is required')
//     .matches(alphaNumeric, 'IBAN must be alpha numeric'),
//   swiftCode: yup
//     .string()
//     .notRequired()
//     .matches(alphaNumeric, 'Swift code must be alpha numeric'),
//   currency: yup.string().required('Currency is required'),
//   bankBranchName: yup.string().notRequired(), // Optional
//   bankAddress: yup.string().required('Bank address is required'),
// });

// export const internationNonRealEstateStep4Schema = yup.object().shape({
//   commercialLicense: yup
//     .mixed()
//     .required('Business / Commercial license is required'),
//   passportCopy: yup.mixed().required('Signatory Passport is required'),
//   nationalIdNumberpdf: yup.mixed().required('National ID number is required'),
//   bankLetter: yup.mixed().required('Bank letter or Cancel Cheque is required'),
// });

// export const internationalFreelancerStep1Schema = yup.object().shape({
//   firstName: yup.string().required('First name is required'),
//   lastName: yup.string().required('Last name is required'),
//   country: yup.string().required('Country is required'),
//   city: yup.string().required('City is required'),
//   signatoryDialCode: yup.string().required('Signatory dial code is required'),
//   signatoryMobile: yup
//     .string()
//     .required('Signatory mobile is required')
//     .when('signatoryDialCode', {
//       is: '+971',
//       then: schema =>
//         schema.matches(/^\d{8,9}$/, 'Signatory mobile must be 8 to 9 digits'),
//       otherwise: schema =>
//         schema.matches(
//           /^\d{5,15}$/,
//           'Signatory mobile must be 5 to 15 digits',
//         ),
//     }),
//   nationalIdNumber: yup.string().nullable().notRequired(),
//   nationalExpiryDate: yup.date().notRequired(),
//   passportNumber: yup.string().required('Passport number is required'),
//   passportIssuePlace: yup.string().required('Passport issue place is required'),
//   passportExpiryDate: yup.date().required('Passport expiry date is required'),
//   signatoryEmail: yup
//     .string()
//     .required('Signatory email is required')
//     .matches(emailreg2, 'Please enter valid email address'),
//   addressLine1: yup.string().required('Address line 1 is required'),
//   addressLine2: yup.string().notRequired(), // Still optional
//   poBox: yup.string().required('P.O. Box is required'),
// });

// export const internationalFreelancerStep2Schema = yup.object().shape({
//   bankName: yup.string().required('Bank name is required'),
//   bankAccountNumber: yup
//     .string()
//     .required('Bank account number is required')
//     .matches(/^[0-9]+$/, 'Bank account number must be numeric'),

//   bankCountry: yup.string().required('Bank country is required'),
//   beneficiaryName: yup.string().required('Beneficiary name is required'),
//   ibanNumber: yup
//     .string()
//     .required('IBAN number is required')
//     .matches(alphaNumeric, 'IBAN must be alpha numeric'),
//   swiftCode: yup
//     .string()
//     .notRequired()
//     .matches(alphaNumeric, 'Swift code must be alpha numeric'),
//   currency: yup.string().required('Currency is required'),
//   bankBranchName: yup.string().notRequired(),
//   bankAddress: yup.string().required('Bank address is required'),
// });

// export const internationalFreelancerStep3Schema = yup.object().shape({
//   passportCopy: yup.mixed().required('Signatory Passport is required'),
//   nationalIdNumberpdf: yup.mixed().required('National ID number is required'),
//   bankLetter: yup.mixed().required('Bank letter is required'),
// });
