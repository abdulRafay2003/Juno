import React from 'react';
import StepOne from '../StepOne';
import StepTwo from '../StepTwo';
import StepThree from '../StepThree';
import StepFour from '../StepFour';
import {ONBOARDING_CATEGORIES, ONBOARDING_STEPS} from '@/constants/globalConst';
import {APIS} from '@/services/apiMethods';

interface InternationalNonRealEstateStepsProps {
  selectedSteps: number;
  control: any;
  errors: any;
  watch: any;
  setValue: any;
  bankAvailability: boolean;
  onSubmit: (data: any) => void;
  companyPhoneCountryCode?: any;
  setCompanyPhoneCountryCode?: any;
  signatoryPhoneCountryCode?: any;
  setSignatoryPhoneCountryCode?: any;
  setError?: any;
}

const InternationalNonRealEstateSteps = ({
  selectedSteps,
  control,
  errors,
  watch,
  setValue,
  bankAvailability,
  onSubmit,
  companyPhoneCountryCode,
  setCompanyPhoneCountryCode,
  signatoryPhoneCountryCode,
  setSignatoryPhoneCountryCode,
  setError,
}: InternationalNonRealEstateStepsProps) => {
  const handleStepSubmit = async (formData: any) => {
    let submitData: any = {
      category: ONBOARDING_CATEGORIES.NON_REAL_ESTATE_COMPANY_INTERNATIONAL,
      data: {},
    };

    switch (selectedSteps) {
      case 1:
        // Step 1: Company Information
        submitData.step = ONBOARDING_STEPS.AGENCY_DETAIL;
        submitData.data = {
          name: formData.companyName,
          registration_number: formData.registrationNumber,
          registration_expiry_date: formData.registrationExpiryDate,
          country_id: formData.country,
          city: formData.city,
          phone_country_code_id: formData.companyPhone?.countryCode,
          phone_number: formData.companyPhone?.phoneNumber,
          email: formData.companyEmail,
          address_line_1: formData.addressLine1,
          address_line_2: formData.addressLine2,
          po_box_number: formData.poBox,
          property_consultant_name: formData.propertyConsultant,
        };
        break;

      case 2:
        // Step 2: Signatory Details
        submitData.step = ONBOARDING_STEPS.SIGNATORY_DETAIL;
        submitData.data = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          national_id_number: formData.nationalIdNumber,
          national_expiry_date: formData.nationalExpiryDate,
          passport_number: formData.passportNumber,
          passport_issue_place: formData.passportIssuePlace,
          passport_expiry_date: formData.passportExpiryDate,
          signatory_mobile_country_code_id:
            formData.signatoryMobile?.countryCode,
          signatory_mobile_number: formData.signatoryMobile?.phoneNumber,
          signatory_email: formData.signatoryEmail,
          role: formData.role,
          designation: formData.designation,
        };
        break;

      case 3:
        // Step 3: Bank Information
        submitData.step = ONBOARDING_STEPS.BANK_INFORMATION;
        submitData.data = {
          bank_country_id: formData.bankCountry,
          bank_name: formData.bankName,
          bank_account_number: formData.bankAccountNumber,
          beneficiary_name: formData.beneficiaryName,
          iban_number: formData.ibanNumber,
          swift_code: formData.swiftCode,
          currency: formData.currency,
          bank_branch_name: formData.bankBranchName,
          bank_address: formData.bankAddress,
        };
        break;

      case 4:
        // Step 4: Submit (Documents)
        submitData.step = ONBOARDING_STEPS.SUBMIT;
        submitData.data = {
          commercial_license: formData.commercialLicense,
          passport_copy: formData.passportCopy,
          national_id_copy: formData.nationalIdNumberpdf,
          bank_letter: formData.bankLetter,
        };
        break;
    }

    try {
      const response = await APIS.submitOnboardingStep(submitData);

      onSubmit(response);
    } catch (error) {
      throw error;
    }
  };

  const renderSteps = () => {
    switch (selectedSteps) {
      case 1:
        return (
          <StepOne
            control={control}
            setValue={setValue}
            internationRealEstate={false}
            errors={errors}
            watch={watch}
            checknonEstate={true}
            checkType={true}
            checkDubaiBased={false}
            companyPhoneCountryCode={companyPhoneCountryCode}
            setCompanyPhoneCountryCode={setCompanyPhoneCountryCode}
            countryAndCity={true}
          />
        );
      case 2:
        return (
          <StepTwo
            control={control}
            errors={errors}
            checkDubaiBased={false}
            watch={watch}
            checknonEstate={true}
            checkType={true}
            signatoryPhoneCountryCode={signatoryPhoneCountryCode}
            setSignatoryPhoneCountryCode={setSignatoryPhoneCountryCode}
          />
        );
      case 3:
        return (
          <StepThree
            control={control}
            errors={errors}
            bankAvailability={bankAvailability}
            checknonEstate={true}
            freelancer={false}
            checkType={true}
            countryAndCity={true}
          />
        );
      case 4:
        return (
          <StepFour
            control={control}
            errors={errors}
            bank={bankAvailability}
            checknonEstate={true}
            checkType={true}
            watch={watch}
            checkDubaiBased={false}
            headerTitle="Non Real Estate Company"
            setError={setError}
          />
        );
      default:
        return null;
    }
  };

  return renderSteps();
};

export default InternationalNonRealEstateSteps;
