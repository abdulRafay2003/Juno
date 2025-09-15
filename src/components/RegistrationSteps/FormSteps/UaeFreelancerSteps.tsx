import React from 'react';
import FreelancerStepOne from '../FreelancerStepOne';
import StepThree from '../StepThree';
import StepFour from '../StepFour';
import {ONBOARDING_CATEGORIES, ONBOARDING_STEPS} from '@/constants/globalConst';
import {APIS} from '@/services/apiMethods';

interface UaeFreelancerStepsProps {
  selectedSteps: number;
  control: any;
  errors: any;
  watch: any;
  setValue: any;
  bankAvailability: boolean;
  onSubmit: (data: any) => void;
  mobileCountryCode: any;
  setMobileCountryCode: any;
  heading?: string;
  setError?: any;
}

const UaeFreelancerSteps = ({
  selectedSteps,
  control,
  errors,
  watch,
  setValue,
  bankAvailability,
  onSubmit,
  mobileCountryCode,
  setMobileCountryCode,
  heading,
  setError,
}: UaeFreelancerStepsProps) => {
  const handleStepSubmit = async (formData: any) => {
    let submitData: any = {
      category: ONBOARDING_CATEGORIES.FREELANCER,
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
          emirates_id_number: formData.emiratesIdNum,
          eid_expiry_date: formData.eidExpiryDate,
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
          visa_copy: formData.visaCopy,
          emirates_id_copy: formData.emiratesIdCopy,
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
            checkType={false}
            mobileCountryCode={mobileCountryCode}
            setMobileCountryCode={setMobileCountryCode}
            heading={heading}
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
            checkType={false}
          />
        );
      case 3:
        return (
          <StepFour
            control={control}
            errors={errors}
            bank={bankAvailability}
            checknonEstate={false}
            checkType={false}
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

export default UaeFreelancerSteps;
