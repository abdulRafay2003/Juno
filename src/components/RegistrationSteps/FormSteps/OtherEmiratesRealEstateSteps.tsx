import React from 'react';
import StepOne from '../StepOne';
import StepTwo from '../StepTwo';
import StepThree from '../StepThree';
import StepFour from '../StepFour';
import {ONBOARDING_CATEGORIES, ONBOARDING_STEPS} from '@/constants/globalConst';
import {APIS} from '@/services/apiMethods';

interface OtherEmiratesRealEstateStepsProps {
  selectedSteps: number;
  control: any;
  errors: any;
  watch: any;
  setValue: any;
  bankAvailability: boolean;
  onSubmit: (data: any) => void;
  companyPhoneCountryCode: any;
  setCompanyPhoneCountryCode?: any;
  signatoryPhoneCountryCode?: any;
  setSignatoryPhoneCountryCode?: any;
  heading?: string;
}

const OtherEmiratesRealEstateSteps = ({
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
  heading,
}: OtherEmiratesRealEstateStepsProps) => {
  const handleStepSubmit = async (formData: any) => {
    let submitData: any = {
      category: ONBOARDING_CATEGORIES.REAL_ESTATE_AGENCY_OTHER_EMIRATES,
      data: {},
    };

    switch (selectedSteps) {
      case 1:
        // Step 1: Company Information
        submitData.step = ONBOARDING_STEPS.AGENCY_DETAIL;
        submitData.data = {
          name: formData.companyName,
          trade_licence_category: formData.tradeLicenseCategory,
          trade_licence_number: formData.tradeLicenseNumber,
          trade_licence_expiry_date: formData.tradeLicenseExpiryDate,
          country_id: formData.country,
          city: formData.city,
          phone_country_code_id: formData.companyPhone?.countryCode,
          phone_number: formData.companyPhone?.phoneNumber,
          email: formData.companyEmail,
          address_line_1: formData.addressLine1,
          address_line_2: formData.addressLine2,
          po_box_number: formData.poBox,
          property_consultant_name: formData.propertyConsultant,
          has_trn: formData.haveTrn === 'Yes' ? true : false,
          ownership_id: formData.ownership,
        };
        break;

      case 2:
        // Step 2: Signatory Details
        submitData.step = ONBOARDING_STEPS.SIGNATORY_DETAIL;
        submitData.data = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          emirates_id_number: formData.emiratesIdNum,
          eid_expiry_date: formData.eidExpiryDate,
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
          visa_copy: formData.visaCopy,
          emirates_id_copy: formData.emiratesIdCopy,
          poa_moa: formData.poaMoa,
          iban_letter: formData.ibanLetter,
          non_vat_disclosure: formData.nonVatDisclosure,
          vat_certificate: formData.vatCertificate,
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
            checknonEstate={false}
            checkType={false}
            checkDubaiBased={false}
            companyPhoneCountryCode={companyPhoneCountryCode}
            setCompanyPhoneCountryCode={setCompanyPhoneCountryCode}
            heading={heading}
          />
        );
      case 2:
        return (
          <StepTwo
            control={control}
            errors={errors}
            checkDubaiBased={false}
            watch={watch}
            checknonEstate={false}
            checkType={false}
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
            checknonEstate={false}
            freelancer={false}
            checkType={false}
          />
        );
      case 4:
        return (
          <StepFour
            control={control}
            errors={errors}
            bank={bankAvailability}
            checknonEstate={false}
            checkType={false}
            watch={watch}
            checkDubaiBased={false}
            headerTitle="Real Estate Agency (Other Emirates)"
          />
        );
      default:
        return null;
    }
  };

  return renderSteps();
};

export default OtherEmiratesRealEstateSteps;
