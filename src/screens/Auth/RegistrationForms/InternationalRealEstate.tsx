import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  step1InternationRESchema,
  step2InternationRESchema,
  step3InternationRESchema,
  step4InternationRESchema,
} from '@/components/Validations';
import {MainContainer} from '@/components/MainContainer';
import {PrimaryButton} from '@/components/PrimaryButton';
import CustomSwitch from '@/components/Switch';
import {Loader} from '@/components/Loader';
import {Colors, FontType, Metrix, NavigationService} from '@/config';
import {RouteNames} from '@/config/routes';
import InternationalRealEstateSteps from '@/components/RegistrationSteps/FormSteps/InternationalRealEstateSteps';
import {CustomText} from '@/components';
import {APIS} from '@/services/apiMethods';
import {findCountryByCode, showToast} from '@/utils/business.helper';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {LIST_DATA} from '@/constants/dummyData';
import {DOCUMENT_TYPE, PICKERCOUNTRYVALUES} from '@/constants/globalConst';

const InternationalRealEstate = () => {
  const userEmail = useSelector((state: RootState) => state?.auth?.userEmail);
  const [selectedSteps, setSelectedSteps] = useState<number>(1);
  const [bankAvailability, setBankAvailability] = useState<boolean>(true);
  const [companyPhoneCountryCode, setCompanyPhoneCountryCode] = useState(null);
  const [signatoryPhoneCountryCode, setSignatoryPhoneCountryCode] =
    useState(null);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );

  // Set dial code fields when country codes change
  useEffect(() => {
    setValue('dialCode', companyPhoneCountryCode?.dial_code);
  }, [companyPhoneCountryCode]);

  useEffect(() => {
    setValue('signatoryDialCode', signatoryPhoneCountryCode?.dial_code);
  }, [signatoryPhoneCountryCode]);

  useEffect(() => {
    getStepDataQuery.refetch();
    setValue('signatoryEmail', userEmail?.toLowerCase());
    if (selectedSteps === 3) {
      const currencyOption = dropDownData?.currency?.find(
        item => item?.is_default === true,
      );
      if (currencyOption) {
        setValue('currency', currencyOption.value);
      }
    } else if (selectedSteps === 4) {
      setValue('registerationCertificate', null);
      setValue('passportCopy', null);
      setValue('nationalIdNumberpdf', null);
      setValue('bankLetter', null);
    }
  }, [selectedSteps]);
  const scrollRef = useRef<ScrollView>(null);

  const {
    handleSubmit,
    control,
    trigger,
    setValue,
    watch,
    reset,
    setError,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    context: {
      freelancer: false,
      checkType: true,
      headerTitle: 'International Real Estate Agency',
      tradeLicenseCategory: '',
      bankAvailability: bankAvailability,
      checknonEstate: false,
      internationRealEstate: true,
      haveTrn: 'No',
      dropDownData: dropDownData,
    },
    resolver: yupResolver(
      [
        step1InternationRESchema,
        step2InternationRESchema,
        step3InternationRESchema,
        step4InternationRESchema,
      ][selectedSteps - 1] as yup.ObjectSchema<any>,
    ),
  });

  const onSubmit = (data: any) => {
    NavigationService.reset_0(RouteNames.AuthRoutes.Success, {
      heading: 'Thank You! Your registration is submitted for approval.',
      buttonText: 'Close',
      from: 'registeration',
    });
  };

  // Get step data query
  const getStepDataQuery = useQuery({
    queryKey: ['onboardingInternationalRealEstate', selectedSteps],
    queryFn: () => APIS.getOnboardingStep(getStepName(selectedSteps)),
    enabled: true, // Enable to fetch data
    staleTime: 0,
  });

  // Effect to populate form fields when data is fetched
  useEffect(() => {
    if (getStepDataQuery.data?.data?.data) {
      setHasData(true);
      populateFormFields(getStepDataQuery.data.data.data);
    } else {
      setHasData(false);
    }
  }, [getStepDataQuery.data]);
  useEffect(() => {
    if (companyPhoneCountryCode == null && signatoryPhoneCountryCode == null) {
      const dialCodeOption = dropDownData?.mobile_country_code?.find(
        item => item?.key == '971',
      );
      if (dialCodeOption) {
        setSignatoryPhoneCountryCode({
          dial_code: `+${dialCodeOption?.key}`,
          flag: dialCodeOption?.icon_url,
        });
        setCompanyPhoneCountryCode({
          dial_code: `+${dialCodeOption?.key}`,
          flag: dialCodeOption?.icon_url,
        });
      }
    }
  }, []);

  // Helper function to find dropdown option by ID
  const findDropdownOptionById = (data: any[], id: string) => {
    return data?.find(item => item.id === id || item.value === id);
  };

  // Helper function to find dropdown option by display value and return ID
  const findDropdownIdByValue = (data: any[], displayValue: string) => {
    const option = data?.find(
      item =>
        item.value === displayValue ||
        item.id === displayValue ||
        item.label === displayValue,
    );

    return option?.id || option?.value;
  };

  // Helper function to populate form fields with existing data
  const populateFormFields = (stepData: any) => {
    switch (selectedSteps) {
      case 1:
        // Agency Detail fields
        if (stepData.name) setValue('companyName', stepData.name);
        if (stepData.trade_licence_number)
          setValue('registrationNumber', stepData.trade_licence_number);
        if (stepData.trade_licence_expiry_date)
          setValue(
            'registrationExpiryDate',
            new Date(stepData.trade_licence_expiry_date),
          );
        if (stepData.country_id) {
          const countryOption = findDropdownOptionById(
            dropDownData?.country,
            stepData.country_id,
          );
          if (countryOption) setValue('country', countryOption.value);
        }
        if (stepData.city) setValue('city', stepData.city);
        if (stepData.phone_number)
          setValue('companyPhone', stepData.phone_number);
        if (stepData.email) {
          setValue('companyEmail', stepData.email?.toLowerCase());
        }

        if (stepData.address_line_1)
          setValue('addressLine1', stepData.address_line_1);
        if (stepData.address_line_2)
          setValue('addressLine2', stepData.address_line_2);
        if (stepData.po_box_number) setValue('poBox', stepData.po_box_number);
        if (stepData.property_consultant_name)
          setValue('propertyConsultant', stepData.property_consultant_name);

        if (stepData?.phone_country_code_id) {
          const countryDialCodeOption = findDropdownOptionById(
            dropDownData?.mobile_country_code,
            stepData.phone_country_code_id,
          );

          const dialCodeOption = dropDownData?.mobile_country_code?.find(
            item => item?.key == countryDialCodeOption?.key,
          );

          if (countryDialCodeOption && dialCodeOption) {
            setCompanyPhoneCountryCode({
              dial_code: `+${dialCodeOption?.key}`,
              flag: dialCodeOption?.icon_url,
            });
            setValue('dialCode', `+${dialCodeOption?.key}`);
          }
        }
        break;

      case 2:
        // Signatory Detail fields
        if (stepData.first_name) setValue('firstName', stepData.first_name);
        if (stepData.last_name) setValue('lastName', stepData.last_name);
        if (stepData.national_id_number)
          setValue('nationalIdNumber', stepData.national_id_number);
        if (stepData.national_id_expiry_date)
          setValue(
            'nationalExpiryDate',
            new Date(stepData.national_id_expiry_date),
          );
        if (stepData.passport_number)
          setValue('passportNumber', stepData.passport_number);
        if (stepData.passport_issue_place)
          setValue('passportIssuePlace', stepData.passport_issue_place);
        if (stepData.passport_expiry_date)
          setValue(
            'passportExpiryDate',
            new Date(stepData.passport_expiry_date),
          );
        if (stepData.phone_number)
          setValue('signatoryMobile', stepData.phone_number);

        if (stepData.role_id) {
          const roleOption = findDropdownOptionById(
            dropDownData?.role,
            stepData.role_id,
          );
          if (roleOption) setValue('role', roleOption.value);
        }
        if (stepData.designation) setValue('designation', stepData.designation);

        if (stepData?.phone_country_code_id) {
          const countryDialCodeOption = findDropdownOptionById(
            dropDownData?.mobile_country_code,
            stepData.phone_country_code_id,
          );

          const dialCodeOption = dropDownData?.mobile_country_code?.find(
            item => item?.key == countryDialCodeOption?.key,
          );

          if (countryDialCodeOption && dialCodeOption) {
            setSignatoryPhoneCountryCode({
              dial_code: `+${dialCodeOption?.key}`,
              flag: dialCodeOption?.icon_url,
            });
            setValue('signatoryDialCode', `+${dialCodeOption?.key}`);
          }
        }
        break;

      case 3:
        // Bank Information fields
        if (stepData.country_id) {
          const bankCountryOption = findDropdownOptionById(
            dropDownData?.country,
            stepData.country_id,
          );
          if (bankCountryOption)
            setValue('bankCountry', bankCountryOption.value);
        }
        if (stepData.name) setValue('bankName', stepData.name);
        if (stepData.account_number)
          setValue('bankAccountNumber', stepData.account_number);
        if (stepData.beneficiary_name)
          setValue('beneficiaryName', stepData.beneficiary_name);
        if (stepData.iban_number) setValue('ibanNumber', stepData.iban_number);
        if (stepData.swift_code) setValue('swiftCode', stepData.swift_code);
        if (stepData.currency_code_id) {
          const currencyOption = findDropdownOptionById(
            dropDownData?.currency,
            stepData.currency_code_id,
          );
          if (currencyOption) setValue('currency', currencyOption.value);
        }
        if (stepData.bank_branch_name)
          setValue('bankBranchName', stepData.bank_branch_name);
        if (stepData.branch_address)
          setValue('bankAddress', stepData.branch_address);
        break;

      case 4:
        // Documents fields - no form fields to populate
        break;
    }
  };

  // Submit step mutation
  const submitStepMutation = useMutation({
    mutationFn: (data: any) => APIS.submitOnboardingStep(data),
    onSuccess: response => {
      afterSuccess();
    },
    onError: (error: any) => {
      const err = error as any;
      setIsStepLoading(false);
      showToast(
        'error',
        'Error',
        ((err?.response?.data as any)?.message as string) || 'Request failed',
      );
      // console.error('❌ Step submission failed:', err?.response?.data);
    },
  });

  // Patch step mutation
  const patchStepMutation = useMutation({
    mutationFn: (data: any) => APIS.patchOnboardingStep(data),
    onSuccess: response => {
      afterSuccess();
    },
    onError: (error: any) => {
      const err = error as any;
      setIsStepLoading(false);
      showToast(
        'error',
        'Error',
        ((err?.response?.data as any)?.message as string) || 'Request failed',
      );
      // console.error('❌ Step patch failed:', err?.response?.data);
    },
  });

  const afterSuccess = async () => {
    setSelectedSteps(prev => prev + 1);
    setHasData(false);
    if (getStepDataQuery?.data?.data) {
      setTimeout(() => {
        setIsStepLoading(false);
      }, 200);
    }
  };

  // Helper function to get step name
  const getStepName = (step: number) => {
    const stepNames = [
      'AGENCY_DETAIL',
      'SIGNATORY_DETAIL',
      'BANK_INFORMATION',
      'SUBMIT',
    ];
    return stepNames[step - 1];
  };

  const handleSteps = async () => {
    const isStepValid = await trigger();
    if (!isStepValid) {
      return;
    }

    setIsStepLoading(true);
    try {
      // Get current form data
      const formData = watch();

      // If it's step 4 (SUBMIT), handle documents upload and step submission
      if (selectedSteps === 4) {
        // Upload documents first
        const uploadResults = await uploadDocuments(formData);

        // Check if any uploads failed
        const failedUploads = uploadResults.filter(result => !result.success);
        if (failedUploads.length > 0) {
          console.error('❌ Some document uploads failed:', failedUploads);
          // Show error message to user
          console.error(
            'Failed uploads:',
            failedUploads.map(f => f.fieldName),
          );
          setIsStepLoading(false);
          return;
        }

        // Now call the step API with the specified body
        const stepData = {
          step: 'SUBMIT',
          data: {
            category: 'International Real Estate Agency',
          },
        };

        await submitStepMutation.mutateAsync(stepData);

        // Navigate to success screen
        handleSubmit(onSubmit)();
        return;
      }

      // For steps 1, 2, 3 - use existing logic
      // const stepData = await getStepDataQuery.refetch();

      // Call the appropriate API based on whether data exists
      if (hasData && selectedSteps !== 4) {
        // Data exists, use PATCH
        scrollRef.current?.scrollTo({y: 0, animated: true});
        await patchStepMutation.mutateAsync(await submitStepData(formData));
      } else if (hasData && selectedSteps === 4) {
        scrollRef.current?.scrollTo({y: 0, animated: true});
        setIsStepLoading(false);
        // await patchStepMutation.mutateAsync(await submitStepData(formData));
      } else {
        // No data exists, use POST
        scrollRef.current?.scrollTo({y: 0, animated: true});
        await submitStepMutation.mutateAsync(await submitStepData(formData));
      }
    } catch (error) {
      console.error('❌ Step submission failed:', error);
      setIsStepLoading(false);
      // Don't proceed to next step if API fails
    } finally {
      // setSelectedSteps(prev => prev + 1);
      setIsStepLoading(false);
      // setIsStepLoading(false);
    }
  };
  // Upload documents function for step 4
  const uploadDocuments = async (formData: any) => {
    const documentFields = Object.keys(DOCUMENT_TYPE);
    const documentsToUpload = documentFields.filter(
      fieldName => formData[fieldName],
    );

    const uploadPromises = documentsToUpload.map(async fieldName => {
      const file = formData[fieldName];
      const backendType =
        DOCUMENT_TYPE[fieldName as keyof typeof DOCUMENT_TYPE];

      if (file && file.uri) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', {
          uri: file.uri,
          type: file.type || 'application/pdf',
          name: file.name || `${fieldName}.pdf`,
        } as any);
        formDataToSend.append('type', backendType);
        try {
          const response = await APIS.uploadOnboardingDocument(formDataToSend);

          return {fieldName, success: true, response};
        } catch (error) {
          const err = error as any;
          console.error(`❌ Failed to upload document ${fieldName}:`, err);
          return {fieldName, success: false, err};
        }
      } else {
        return {fieldName, success: true, skipped: true};
      }
    });

    return Promise.all(uploadPromises);
  };

  const submitStepData = async (formData: any) => {
    let submitData: any = {
      step: '',
      data: {
        category: 'International Real Estate Agency',
        data: {},
      },
    };

    // Helper function to remove empty/undefined values and format dates
    const cleanData = (data: any) => {
      const cleaned: any = {};

      Object.keys(data).forEach(key => {
        const value = data[key];

        if (
          value !== undefined &&
          value !== null &&
          value !== '' &&
          value !== 'undefined'
        ) {
          // Format dates to YYYY-MM-DD
          if (
            key.includes('date') ||
            key.includes('expiry') ||
            key.includes('Date')
          ) {
            if (value && typeof value === 'string') {
              // Convert date format to YYYY-MM-DD
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                cleaned[key] = date.toISOString().split('T')[0];
              }
            } else if (
              value &&
              typeof value === 'object' &&
              value.toISOString
            ) {
              // Handle Date objects
              cleaned[key] = value.toISOString().split('T')[0];
            }
          } else {
            cleaned[key] = value;
          }
        }
      });

      return cleaned;
    };
    let CityId = dropDownData?.uae_city?.find(
      itemX => itemX?.meta?.isOther === true,
    );
    switch (selectedSteps) {
      case 1:
        submitData.step = 'AGENCY_DETAIL';
        submitData.data.data = cleanData({
          name: formData.companyName,
          trade_licence_number: formData.registrationNumber,
          trade_licence_expiry_date: formData.registrationExpiryDate,
          country_id: findDropdownIdByValue(
            dropDownData?.country,
            formData.country,
          ),
          city_id: CityId?.id,
          city: formData.city,
          phone_country_code_id: findCountryByCode(
            companyPhoneCountryCode?.dial_code,
          ),
          phone_number: formData.companyPhone,
          email: formData.companyEmail.toLowerCase(),
          address_line_1: formData.addressLine1,
          address_line_2: formData.addressLine2,
          po_box_number: formData.poBox,
          property_consultant_name: formData.propertyConsultant,
        });
        break;

      case 2:
        submitData.step = 'SIGNATORY_DETAIL';
        submitData.data.data = cleanData({
          first_name: formData.firstName,
          last_name: formData.lastName,
          national_id_number: formData.nationalIdNumber,
          national_id_expiry_date: formData.nationalExpiryDate,
          passport_number: formData.passportNumber,
          passport_issue_place: formData.passportIssuePlace,
          passport_expiry_date: formData.passportExpiryDate,
          phone_country_code_id: findCountryByCode(
            signatoryPhoneCountryCode?.dial_code,
          ),
          phone_number: formData.signatoryMobile,
          // signatory_email: formData.signatoryEmail, // commented for time being
          role_id: findDropdownIdByValue(dropDownData?.role, formData.role),
          designation: formData.designation,
        });
        break;

      case 3:
        submitData.step = 'BANK_INFORMATION';
        submitData.data.data = cleanData({
          country_id: findDropdownIdByValue(
            dropDownData?.country,
            formData.bankCountry,
          ),
          name: formData.bankName,
          account_number: formData.bankAccountNumber,
          beneficiary_name: formData.beneficiaryName,
          iban_number: formData.ibanNumber,
          swift_code: formData.swiftCode,
          currency_code_id: findDropdownIdByValue(
            dropDownData?.currency,
            formData.currency,
          ),
          branch_name: formData.bankBranchName,
          branch_address: formData.bankAddress,
        });
        break;

      case 4:
        submitData.step = 'SUBMIT';
        break;
    }

    return submitData;
  };

  const renderSteps = () => {
    return (
      <InternationalRealEstateSteps
        selectedSteps={selectedSteps}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        setError={setError}
        bankAvailability={bankAvailability}
        onSubmit={onSubmit}
        companyPhoneCountryCode={companyPhoneCountryCode}
        setCompanyPhoneCountryCode={setCompanyPhoneCountryCode}
        signatoryPhoneCountryCode={signatoryPhoneCountryCode}
        setSignatoryPhoneCountryCode={setSignatoryPhoneCountryCode}
      />
    );
  };

  const renderTitle = () => {
    const titles = [
      'Company Information',
      'Signatory Details',
      'Bank Information',
      'Documents',
    ];
    return titles[selectedSteps - 1] || '';
  };

  const handleBackPress = () => {
    if (selectedSteps > 1) {
      scrollRef.current?.scrollTo({y: 0, animated: true});
      setSelectedSteps(selectedSteps - 1);
    } else {
      NavigationService.goBack();
    }
  };

  return (
    <MainContainer
      isHeader
      heading="International Real Estate Agency"
      isFlatList
      customeHeaderStyle={styles.headerStyle}
      customeStyle={styles.containerMain}
      backFunction={handleBackPress}>
      <View style={styles.stepContainer}>
        {[1, 2, 3, 4].map((step, index) => {
          const isActive = index < selectedSteps;
          return (
            <View
              key={step}
              style={
                isActive
                  ? [styles.stepLine, styles.selectedSteps]
                  : styles.stepLine
              }
            />
          );
        })}
      </View>
      <View style={styles.hrLine} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContentContainer}
        ref={scrollRef}>
        <View style={styles.containerStyle}>
          <View style={styles.card}>
            <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
              {renderTitle()}{' '}
              {selectedSteps == 3 && (
                <CustomText.RegularText
                  customStyle={{fontSize: FontType.FontSemiRegular}}
                  isSecondaryColor>
                  (For Information Only)
                </CustomText.RegularText>
              )}
            </CustomText.LargeSemiBoldText>
            {renderSteps()}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={selectedSteps == 4 ? 'Submit' : 'Continue'}
            onPress={handleSteps}
            disabled={isStepLoading}
          />
        </View>
      </ScrollView>
      <Loader isLoading={isStepLoading} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: Metrix.VerticalSize(80),
  },
  headerStyle: {
    borderBottomWidth: 0,
  },
  hrLine: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.TextInputBorderColor,
    paddingTop: Metrix.VerticalSize(3),
  },
  stepLine: {
    height: Metrix.VerticalSize(3.5),
    flex: 1,
    backgroundColor: Colors.BgGRay,
    borderRadius: Metrix.VerticalSize(5),
  },
  containerStyle: {
    paddingHorizontal: Metrix.HorizontalSize(15),
  },
  stepContainer: {
    flexDirection: 'row',
    gap: Metrix.HorizontalSize(8),
    marginHorizontal: Metrix.HorizontalSize(20),
    paddingBottom: Metrix.VerticalSize(10),
  },
  selectedSteps: {
    backgroundColor: Colors.Black,
  },
  card: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(20),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(6),
    marginTop: Metrix.VerticalSize(20),
  },
  headingText: {
    marginBottom: Metrix.VerticalSize(15),
  },
  bankAvailabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    borderRadius: Metrix.VerticalSize(30),
    paddingVertical: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(20),
    backgroundColor: Colors.White,
  },
  containerMain: {
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  buttonContainer: {
    paddingHorizontal: Metrix.VerticalSize(15),
  },
});

export default InternationalRealEstate;
