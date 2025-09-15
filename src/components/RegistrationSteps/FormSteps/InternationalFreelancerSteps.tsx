import React from 'react';
import FreelancerStepOne from '../FreelancerStepOne';
import StepThree from '../StepThree';
import StepFour from '../StepFour';
import {ONBOARDING_CATEGORIES, ONBOARDING_STEPS} from '@/constants/globalConst';
import {APIS} from '@/services/apiMethods';

interface InternationalFreelancerStepsProps {
  selectedSteps: number;
  control: any;
  errors: any;
  watch: any;
  setValue: any;
  bankAvailability: boolean;
  onSubmit: (data: any) => void;
  mobileCountryCode?: any;
  setMobileCountryCode?: any;
  setError?: any;
}

const InternationalFreelancerSteps = ({
  selectedSteps,
  control,
  errors,
  watch,
  setValue,
  bankAvailability,
  onSubmit,
  mobileCountryCode,
  setMobileCountryCode,
  setError,
}: InternationalFreelancerStepsProps) => {
  const handleStepSubmit = async (formData: any) => {
    let submitData: any = {
      category: ONBOARDING_CATEGORIES.FREELANCER_INTERNATIONAL,
      data: {},
    };

    switch (selectedSteps) {
      case 1:
        // Step 1: Freelancer Information
        submitData.step = ONBOARDING_STEPS.AGENCY_DETAIL;
        submitData.data = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          country_id: formData.country,
          city: formData.city,
          signatory_mobile_country_code_id:
            formData.signatoryMobile?.countryCode,
          signatory_mobile_number: formData.signatoryMobile?.phoneNumber,
          national_id_number: formData.nationalIdNumber,
          national_expiry_date: formData.nationalExpiryDate,
          passport_number: formData.passportNumber,
          passport_issue_place: formData.passportIssuePlace,
          passport_expiry_date: formData.passportExpiryDate,
          signatory_email: formData.signatoryEmail,
          address_line_1: formData.addressLine1,
          address_line_2: formData.addressLine2,
          po_box_number: formData.poBox,
        };
        break;

      case 2:
        // Step 2: Bank Information
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

      case 3:
        // Step 3: Submit (Documents)
        submitData.step = ONBOARDING_STEPS.SUBMIT;
        submitData.data = {
          passport_copy: formData.passportCopy,
          national_id_copy: formData.nationalIdNumberpdf,
          iban_letter: formData.ibanLetter,
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
          <FreelancerStepOne
            control={control}
            setValue={setValue}
            errors={errors}
            watch={watch}
            checkType={true}
            mobileCountryCode={mobileCountryCode}
            setMobileCountryCode={setMobileCountryCode}
            countryAndCity={true}
          />
        );
      case 2:
        return (
          <StepThree
            control={control}
            errors={errors}
            bankAvailability={bankAvailability}
            checknonEstate={false}
            freelancer={true}
            checkType={true}
            countryAndCity={true}
          />
        );
      case 3:
        return (
          <StepFour
            control={control}
            errors={errors}
            bank={bankAvailability}
            checknonEstate={false}
            checkType={true}
            watch={watch}
            checkDubaiBased={false}
            headerTitle="Freelancer"
            setError={setError}
          />
        );
      default:
        return null;
    }
  };

  return renderSteps();
};

export default InternationalFreelancerSteps;
