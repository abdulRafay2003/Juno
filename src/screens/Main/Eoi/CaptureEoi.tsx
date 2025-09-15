import {
  CustomDatePicker,
  CustomInput,
  CustomPhoneInput,
  CustomText,
  DropDownPicker,
  Loader,
  MainContainer,
  PrimaryButton,
} from '@/components';
import UploadDocument from '@/components/UploadDocument';
import {corporateSchema, individualSchema} from '@/components/Validations';
import {Colors, FontType, Images, Metrix, NavigationService} from '@/config';
import {RouteNames} from '@/config/routes';
import {bookingTypeOptions, partyCheque} from '@/constants/dummyData';
import {DOCUMENT_TYPE} from '@/constants/globalConst';
import {globalStyles} from '@/constants/globalStyles';
import {RootState} from '@/redux/store';
import {APIS} from '@/services/apiMethods';
import {findCountryByCode, showToast} from '@/utils/business.helper';
import {yupResolver} from '@hookform/resolvers/yup';
import {useRoute} from '@react-navigation/native';
import {useMutation, useQuery} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useFieldArray, useForm, useWatch} from 'react-hook-form';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import * as yup from 'yup';

const CaptureEoi = () => {
  const route = useRoute<any>();
  const from = route?.params?.from;
  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );
  const selectType = ['Individual', 'Corporate'];
  const [selected, setSelected] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);
  const [countryDialCode, setCountryDialCode] = useState(null);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    watch,
    setError,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(
      (selected === 0
        ? individualSchema
        : corporateSchema) as yup.ObjectSchema<any>,
    ),
    defaultValues: {
      unitPreferences: [
        {unitPreference: '', noOfUnits: 0, eoiAmount: 0, remarks: ''},
      ],
      applicantType: 'Individual',
      bookingType: 'Broker Sale',
      countryCode: '+971',
    },
  });
  const applicationType = watch('applicantType');

  // Helper function to get selected payment mode meta data
  const getSelectedPaymentModeMeta = () => {
    const selectedPaymentModeId = watch('modeOfPayment');
    const selectedPaymentMode = dropDownData?.payment_mode?.find(
      (item: any) => item?.id === selectedPaymentModeId,
    );
    return selectedPaymentMode?.meta;
  };

  // Helper function to check if a field is required based on meta data
  const isFieldRequired = (
    fieldName: string,
    section: 'payment' | 'kyc' | 'documents',
  ) => {
    const meta = getSelectedPaymentModeMeta();
    if (!meta) return false;

    const applicantType =
      applicationType === 'Individual' ? 'individual' : 'corporate';
    const sectionData = meta[applicantType]?.[section] || [];

    const field = sectionData.find((item: any) => item.name === fieldName);
    return field ? !field.is_optional : false;
  };

  // Helper function to get required fields for a section
  const getRequiredFields = (section: 'payment' | 'kyc' | 'documents') => {
    const meta = getSelectedPaymentModeMeta();
    if (!meta) return [];

    const applicantType =
      applicationType === 'Individual' ? 'individual' : 'corporate';
    const sectionData = meta[applicantType]?.[section] || [];

    return sectionData
      .filter((item: any) => !item.is_optional)
      .map((item: any) => item.name);
  };

  // Helper function to get all fields for a section
  const getAllFields = (section: 'payment' | 'kyc' | 'documents') => {
    const meta = getSelectedPaymentModeMeta();
    if (!meta) return [];

    const applicantType =
      applicationType === 'Individual' ? 'individual' : 'corporate';
    const sectionData = meta[applicantType]?.[section] || [];

    return sectionData.map((item: any) => item.name);
  };

  // const {fields, append, remove} = useFieldArray({
  //   control,
  //   name: 'unitPreferences',
  // });

  const unitPreferencesArray = useFieldArray({
    control,
    name: 'unitPreferences',
  });
  const watchedProjectName = useWatch({control, name: 'projectName'});
  const watchCompanyRegistrationNo = useWatch({
    control,
    name: 'companyRegistrationNo',
  });

  const {data: projectsData} = useQuery({
    queryKey: ['projectsData'],
    queryFn: () => APIS.getProjectsData(),
  });
  const {data: salesManagerData} = useQuery({
    queryKey: ['salesManagerData'],
    queryFn: () => APIS.getSalesManagerData(),
  });

  const calculateEoiAmount = useCallback(
    index => {
      const projectName = watch('projectName');
      const unitPreferences = watch('unitPreferences');

      if (!projectName || !projectsData?.data?.data) {
        return;
      }

      const selectedProject = projectsData?.data?.data?.find(
        (project: any) => project.id === projectName,
      );

      if (!selectedProject) {
        return;
      }

      const noOfUnits = Number(unitPreferences[index]?.noOfUnits) || 0;
      const eoiAmount =
        selectedProject.minimum_token_amount != null
          ? Number(selectedProject.minimum_token_amount) * noOfUnits
          : selectedProject.minimum_token_amount != ''
            ? Number(selectedProject.minimum_token_amount) * noOfUnits
            : 0 * noOfUnits;
      // Set the EOI amount for this specific unit preference
      setValue(`unitPreferences.${index}.eoiAmount`, eoiAmount.toString());

      // Calculate and set total EOI amount
      const totalAmount = unitPreferences.reduce(
        (total: number, unit: any, idx: number) => {
          if (idx === index) {
            return total + eoiAmount;
          }
          return total + (Number(unit.eoiAmount) || 0);
        },
        0,
      );

      setValue('totalEoiAmount', totalAmount.toString());
    },
    [watch, projectsData, setValue],
  );

  const calculateAllEoiAmounts = useCallback(() => {
    const projectName = watch('projectName');
    const unitPreferences = watch('unitPreferences');

    if (!projectName || !projectsData?.data?.data) {
      return;
    }

    const selectedProject = projectsData?.data?.data?.find(
      (project: any) => project.id === projectName,
    );

    if (!selectedProject) {
      return;
    }

    let totalAmount = 0;

    // Calculate EOI amount for each unit preference
    unitPreferences.forEach((unit: any, index: number) => {
      const noOfUnits = Number(unit.noOfUnits) || 0;
      const eoiAmount =
        selectedProject.minimum_token_amount != null
          ? Number(selectedProject.minimum_token_amount) * noOfUnits
          : selectedProject.minimum_token_amount != ''
            ? Number(selectedProject.minimum_token_amount) * noOfUnits
            : 0 * noOfUnits;

      // Set the EOI amount for this unit preference
      setValue(`unitPreferences.${index}.eoiAmount`, eoiAmount.toString());

      // Add to total
      totalAmount += eoiAmount;
    });

    // Set total EOI amount
    setValue('totalEoiAmount', totalAmount.toString());
  }, [watch, projectsData, setValue]);

  useEffect(() => {
    if (countryDialCode == null) {
      const dialCodeOption = dropDownData?.mobile_country_code?.find(
        item => item?.key == '971',
      );
      if (dialCodeOption) {
        setCountryDialCode({
          dial_code: `+${dialCodeOption?.key}`,
          flag: dialCodeOption?.icon_url,
        });
        setValue('dialCode', `+${dialCodeOption?.key}`);
      }
    }
  }, []);

  // useEffect(() => {
  //   reset();
  //   setValue('passport', undefined);
  //   setValue('nationalId', undefined);
  //   setValue('tradeLicense', undefined);
  //   setValue('proofOfPayment', undefined);
  //   setValue('applicantType', selected === 0 ? 'Individual' : 'Corporate');
  //   setValue('dialCode', countryDialCode?.dial_code);
  // }, [selected]);

  const mutation = useMutation({
    mutationFn: (body: any) => APIS?.creatEoi(body),
    onSuccess: data => {
      setLoading(false);
      NavigationService.replace(RouteNames.HomeRoutes.Success, {
        from: from || 'eoi',
        heading: 'Expression of interest successfully submit.',
        buttonText: 'Back to EOI',
        headingStyle: styles.successHeadingStyle,
      });
    },
    onError: (error: any) => {
      const err = error as AxiosError;

      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Upload Failed',
      );
    },
  });

  useEffect(() => {
    if (countryDialCode == null) {
      const dialCodeOption = dropDownData?.mobile_country_code?.find(
        item => item?.key == '971',
      );
      if (dialCodeOption) {
        setCountryDialCode({
          dial_code: `+${dialCodeOption?.key}`,
          flag: dialCodeOption?.icon_url,
        });
        setValue('dialCode', `+${dialCodeOption?.key}`);
      }
    }
  }, []);

  useEffect(() => {
    if (watchedProjectName && projectsData?.data?.data) {
      calculateAllEoiAmounts();
    }
  }, [watchedProjectName, projectsData, calculateAllEoiAmounts]);

  useEffect(() => {
    setValue('dialCode', countryDialCode?.dial_code);
  }, [countryDialCode]);

  const uploadDocument = async (file, key) => {
    if (!file?.uri) return null;

    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await APIS.uploadEoiDocumnet(formData);

      return res?.data?.data; // or res?.data?.fileUrl depending on your API
    } catch (error) {
      return null;
    }
  };
  // Utility function to remove undefined, null, or empty string fields
  const cleanObject = obj =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          (typeof value !== 'string' || value.trim() !== ''),
      ),
    );

  // Utility function to format date fields to YYYY-MM-DD
  const formatDate = value => {
    if (!value) return value;
    // If already in YYYY-MM-DD, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    // Try to parse and format
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return value;
  };

  const transformEOIPayload = data => {
    const extractDocument = (doc, type) => {
      if (!doc?.file_url) return null;
      const extension = doc?.file_url?.split('.')?.pop() || 'pdf';

      return {
        document_type: type,
        file_name: doc.file_name || 'file',
        file_extension: extension,
        file_url: doc.file_url,
      };
    };

    // Get meta data for conditional field inclusion
    const meta = getSelectedPaymentModeMeta();
    const applicantType =
      data.applicantType === 'Individual' ? 'individual' : 'corporate';
    const paymentFields = meta?.[applicantType]?.payment || [];
    const kycFields = meta?.[applicantType]?.kyc || [];
    const documentFields = meta?.[applicantType]?.documents || [];

    const documents = [
      extractDocument(data.proofOfPayment, DOCUMENT_TYPE.proofOfPayment),
      extractDocument(data.nationalId, DOCUMENT_TYPE.NATIONAL_ID),
      extractDocument(data.passport, DOCUMENT_TYPE.passportCopy),
      extractDocument(data.tradeLicense, DOCUMENT_TYPE.validTradeLicense),
    ].filter(Boolean); // remove nulls

    const eoiPayload = {
      data: {
        buyer_type: data.applicantType,
        booking_type: data.bookingType,
        title_id: data.title,
        first_name: data.firstName,
        last_name: data.lastName,
        ...(data.applicantType === 'Individual'
          ? {email: data.email}
          : {company_email: data.companyEmail}),
        ...(data.applicantType === 'Individual'
          ? {company_name: data.companyName}
          : {company_name: data.companyName}),
        phone_country_code_id: findCountryByCode(data.dialCode),
        mobile_number:
          data.applicantType === 'Individual'
            ? data.mobilePhone
            : data.companyMobile,
        country_of_residence_id: data.countryOfResidence,
        project_id: data.projectName,
        sales_manager_id: data.salesManager,
        deposit_amount: parseFloat(data.totalEoiAmount || 0),
        payment_mode_id: data.modeOfPayment,
        nationality_id: data.nationality,
        payment_mode_helper: cleanObject({
          // Payment fields - conditionally included based on meta
          ...(paymentFields.some(
            field => field.name === 'third_party_cheque',
          ) && {
            third_party_cheque: data.partyCheque == 1 ? true : false,
          }),
          ...(paymentFields.some(field => field.name === 'bank_name') && {
            bank_name: data.chequeBankName,
          }),
          ...(paymentFields.some(field => field.name === 'cheque_number') && {
            cheque_number: data.chequeNumber,
          }),
          ...(paymentFields.some(field => field.name === 'cheque_date') && {
            cheque_date: data.chequeDate ? formatDate(data.chequeDate) : '',
          }),
          ...(paymentFields.some(
            field => field.name === 'source_of_fund_id',
          ) && {
            source_of_fund_id: data.sourceOfFund,
          }),
          ...(paymentFields.some(
            field => field.name === 'source_of_wealth_id',
          ) && {
            source_of_wealth_id: data.sourceOfWealth,
          }),
        }),
      },
      kyc: {
        // KYC fields - conditionally included based on meta
        ...(kycFields.some(
          field => field.name === 'company_registration_number',
        ) && {
          company_registration_number: data.companyRegistrationNo,
        }),
        ...(kycFields.some(
          field => field.name === 'company_registration_place',
        ) && {
          company_registration_place: data.companyRegistrationPlace,
        }),
        ...(kycFields.some(
          field => field.name === 'company_registration_date',
        ) && {
          company_registration_date: data.companyRegistrationDate
            ? formatDate(data.companyRegistrationDate)
            : '',
        }),
        ...(kycFields.some(field => field.name === 'trade_licence_number') && {
          trade_licence_number: data.tradeLicenseNo,
        }),
        ...(kycFields.some(
          field => field.name === 'trade_licence_expiry_date',
        ) && {
          trade_licence_expiry_date: data.tradeLicenseExpiry
            ? formatDate(data.tradeLicenseExpiry)
            : '',
        }),
        ...(kycFields.some(field => field.name === 'passport_number') && {
          passport_number: data.passportNumber,
        }),
        ...(kycFields.some(field => field.name === 'passport_expiry_date') && {
          passport_expiry_date: data.passportExpiryDate
            ? formatDate(data.passportExpiryDate)
            : '',
        }),
        ...(kycFields.some(field => field.name === 'national_id_number') && {
          national_id_number: data.nationalIdNumber,
        }),
        ...(kycFields.some(
          field => field.name === 'national_id_expiry_date',
        ) && {
          national_id_expiry_date: data.nationIdExpiryDate
            ? formatDate(data.nationIdExpiryDate)
            : '',
        }),
        ...(kycFields.some(field => field.name === 'address') && {
          address: data.addressLine2 || '',
        }),
        ...(kycFields.some(field => field.name === 'city') && {
          city: data.city || '',
        }),
        ...(kycFields.some(field => field.name === 'postal_code') && {
          postal_code: data.postalCode || '',
        }),
      },
      unit_preference: data.unitPreferences.map(unit => ({
        eoi_amount: unit.eoiAmount,
        number_of_units: unit.noOfUnits,
        unit_preference_id: unit.unitPreference || '',
        remarks: unit.remarks,
      })),
      documents,
    };

    // Clean the entire payload
    const cleanedPayload = {
      data: cleanObject(eoiPayload?.data),
      kyc: cleanObject(eoiPayload?.kyc),
      unit_preference: eoiPayload.unit_preference.map(unit =>
        cleanObject(unit),
      ),
      documents: eoiPayload.documents,
    };
    return cleanedPayload;
  };
  // Helper to retry upload with delay
  const retryUntilUploaded = async (
    file,
    type,
    maxRetries = 5,
    delay = 2000,
  ) => {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const result = await uploadDocument(file, type);
        if (result) return result;
      } catch (err) {
        console.warn(`Upload failed for ${type}, attempt ${attempt + 1}:`, err);
      }
      attempt++;
      await new Promise<void>(resolve => setTimeout(() => resolve(), delay));
    }
    throw new Error(`Failed to upload ${type} after ${maxRetries} attempts`);
  };
  const onSubmit = async data => {
    setLoading(true);
    const uploadStatus = {
      passport: 'skipped',
      nationalId: 'skipped',
      proofOfPayment: 'skipped',
      tradeLicense: 'skipped',
    };

    // Only attempt upload if document has `.uri` (i.e. not uploaded)
    const uploads = await Promise.all([
      data.passport && data.passport.uri
        ? retryUntilUploaded(data.passport, 'passport').then(res => {
            uploadStatus.passport = 'uploaded';
            return res;
          })
        : null,

      data.nationalId && data.nationalId.uri
        ? retryUntilUploaded(data.nationalId, 'nationalId').then(res => {
            uploadStatus.nationalId = 'uploaded';
            return res;
          })
        : null,

      data.proofOfPayment && data.proofOfPayment.uri
        ? retryUntilUploaded(data.proofOfPayment, 'validTradeLicense').then(
            res => {
              uploadStatus.proofOfPayment = 'uploaded';
              return res;
            },
          )
        : null,
      data.tradeLicense && data.tradeLicense.uri
        ? retryUntilUploaded(data.tradeLicense, 'Trade License').then(res => {
            uploadStatus.tradeLicense = 'uploaded';
            return res;
          })
        : null,
    ]);

    // Assign uploaded values back to `data` only if uploaded
    const [
      passportUpload,
      nationalIdUpload,
      proofOfPaymentUpload,
      tradeLicenseUpload,
    ] = uploads;

    if (passportUpload) data.passport = passportUpload;
    if (nationalIdUpload) data.nationalId = nationalIdUpload;
    if (proofOfPaymentUpload) data.proofOfPayment = proofOfPaymentUpload;
    if (tradeLicenseUpload) data.tradeLicense = tradeLicenseUpload;

    const finalData = transformEOIPayload(data);

    mutation.mutate(finalData);
  };

  const renderPrimaryIndividual = () => {
    return (
      <>
        <DropDownPicker
          heading={'Title'}
          isRequired
          placeholder={'Select'}
          data={dropDownData?.salutation}
          fieldName={'title'}
          control={control}
          errTxt={errors?.title && errors?.title?.message}
        />
        <CustomInput
          heading="First Name"
          placeholder="e.g. Muhammad"
          autoCapitalize="none"
          returnKeyType="next"
          isRequired
          fieldName={'firstName'}
          control={control}
          errTxt={errors?.firstName && errors?.firstName?.message}
        />
        <CustomInput
          heading="Last Name"
          placeholder="e.g. Evans"
          autoCapitalize="none"
          returnKeyType="next"
          isRequired
          fieldName={'lastName'}
          control={control}
          errTxt={errors?.lastName && errors?.lastName?.message}
        />

        <CustomInput
          heading="Email"
          placeholder="e.g. evans@beyond.ae"
          autoCapitalize="none"
          returnKeyType="next"
          isRequired
          fieldName={'email'}
          keyboardType={'email-address'}
          control={control}
          errTxt={errors?.email && errors?.email?.message}
        />
        <CustomPhoneInput
          heading="Mobile"
          isRequired
          placeholder="e.g. 4 123 4567"
          fieldName={'mobilePhone'}
          setValue={setCountryDialCode}
          value={countryDialCode}
          errTxt={errors?.mobilePhone && errors?.mobilePhone?.message}
          control={control}
        />
        <DropDownPicker
          heading={'Residence'}
          isRequired
          placeholder={'Select'}
          data={dropDownData?.country}
          fieldName={'countryOfResidence'}
          control={control}
          errTxt={
            errors?.countryOfResidence && errors?.countryOfResidence?.message
          }
        />
        <DropDownPicker
          heading={'Nationality'}
          isRequired
          placeholder={'Select'}
          data={dropDownData?.nationality}
          fieldName={'nationality'}
          control={control}
          errTxt={errors?.nationality && errors?.nationality?.message}
        />
      </>
    );
  };
  const renderPrimaryCorporate = () => {
    return (
      <>
        <CustomInput
          heading="Company Name"
          placeholder="e.g. Evans"
          autoCapitalize="none"
          returnKeyType="next"
          isRequired
          fieldName={'companyName'}
          control={control}
          errTxt={errors?.companyName && errors?.companyName?.message}
        />

        <CustomInput
          heading="Company Email Address"
          placeholder="e.g. evans@beyond.ae"
          autoCapitalize="none"
          returnKeyType="next"
          isRequired
          keyboardType="email-address"
          fieldName={'companyEmail'}
          control={control}
          errTxt={errors?.companyEmail && errors?.companyEmail?.message}
        />
        <CustomPhoneInput
          heading="Mobile"
          isRequired
          placeholder="e.g.  4 123 4567"
          fieldName={'companyMobile'}
          setValue={setCountryDialCode}
          value={countryDialCode}
          errTxt={errors?.companyMobile && errors?.companyMobile?.message}
          control={control}
        />
      </>
    );
  };

  const findModeOfPaymentStatus = () => {
    const mop = watch('modeOfPayment');
    const find = dropDownData?.payment_mode?.find(item => {
      return item?.id === mop;
    });
    return find?.key;
  };

  // Helper function to get selected payment mode key
  const getSelectedPaymentModeKey = () => {
    const selectedPaymentModeId = watch('modeOfPayment');
    const selectedPaymentMode = dropDownData?.payment_mode?.find(
      (item: any) => item?.id === selectedPaymentModeId,
    );
    return selectedPaymentMode?.key;
  };
  return (
    <MainContainer isHeader isFlatList heading="Capture EOI">
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.buttonContainer}>
          {selectType.map((item, index) => {
            const isSelected = selected === index;
            return (
              <TouchableOpacity
                onPress={() => {
                  reset();
                  setValue('passport', undefined);
                  setValue('nationalId', undefined);
                  setValue('tradeLicense', undefined);
                  setValue('proofOfPayment', undefined);
                  setValue(
                    'applicantType',
                    selected === 0 ? 'Individual' : 'Corporate',
                  );
                  setValue('dialCode', countryDialCode?.dial_code);
                  setSelected(index);
                  setValue(
                    'applicantType',
                    index === 0 ? 'Individual' : 'Corporate',
                  );
                }}
                style={[
                  styles.buttonText,
                  isSelected && styles.selectedTabContainer,
                ]}>
                {isSelected ? (
                  <CustomText.LargeSemiBoldText
                    customStyle={styles.selectedTabText}>
                    {item}
                  </CustomText.LargeSemiBoldText>
                ) : (
                  <CustomText.RegularText customStyle={styles.selectedTabText}>
                    {item}
                  </CustomText.RegularText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={globalStyles.cardContainer}>
          <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
            Primary Applicant
          </CustomText.LargeSemiBoldText>
          {selected ? renderPrimaryCorporate() : renderPrimaryIndividual()}
        </View>

        <View style={globalStyles.cardContainer}>
          <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
            Information
          </CustomText.LargeSemiBoldText>
          <DropDownPicker
            heading={'Booking Type'}
            isRequired
            placeholder={'Broker Sale'}
            data={bookingTypeOptions}
            fieldName={'bookingType'}
            control={control}
            disable
            errTxt={errors?.bookingType && errors?.bookingType?.message}
          />
          <DropDownPicker
            heading={'Project Name'}
            isRequired
            placeholder={'Select'}
            searchPlaceholder={'Search Project'}
            isSearch
            data={projectsData?.data?.data}
            fieldName={'projectName'}
            control={control}
            errTxt={errors?.projectName && errors?.projectName?.message}
          />
          <DropDownPicker
            heading={'Sales Manager'}
            isRequired
            placeholder={'Select'}
            data={salesManagerData?.data?.data}
            fieldName={'salesManager'}
            control={control}
            errTxt={errors?.salesManager && errors?.salesManager?.message}
          />
        </View>
        <View style={globalStyles.cardContainer}>
          <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
            Unit Preference
          </CustomText.LargeSemiBoldText>
          <View style={[globalStyles.cardContainer, styles.unitCardContainer]}>
            <FlatList
              keyExtractor={(_, idx) => idx?.toString()}
              data={unitPreferencesArray.fields}
              renderItem={({index}) => (
                <>
                  <DropDownPicker
                    heading={'Unit Preference'}
                    placeholder={'Select'}
                    isRequired
                    customMainContainerStyle={styles.inputContainer}
                    optionalText={' '}
                    data={dropDownData?.unit_preference}
                    fieldName={`unitPreferences.${index}.unitPreference`}
                    control={control}
                    disable={watch('projectName') == undefined}
                    errTxt={
                      errors?.unitPreferences?.[index]?.unitPreference?.message
                    }
                  />
                  <CustomInput
                    heading="No of Units"
                    placeholder="e.g. 1"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    returnKeyType="next"
                    optionalText={' '}
                    isRequired
                    onChangeText={text => {
                      const onlyDigits = text.replace(/[^0-9]/g, ''); // remove anything not 0-9
                      setValue(
                        `unitPreferences.${index}.noOfUnits`,
                        onlyDigits,
                        {shouldValidate: true},
                      );

                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      timeoutRef.current = setTimeout(() => {
                        calculateEoiAmount(index);
                      }, 1000);
                    }}
                    editable={watch('projectName') != undefined}
                    fieldName={`unitPreferences.${index}.noOfUnits`}
                    control={control}
                    errTxt={
                      errors?.unitPreferences?.[index]?.noOfUnits?.message
                    }
                  />

                  <CustomInput
                    heading="EOI Amount (AED)"
                    autoCapitalize="none"
                    editable={false}
                    returnKeyType="next"
                    fieldName={`unitPreferences.${index}.eoiAmount`}
                    optionalText={' '}
                    control={control}
                    errTxt={
                      errors?.unitPreferences?.[index]?.eoiAmount?.message
                    }
                  />
                  <CustomInput
                    heading="Remarks"
                    placeholder="Add remarks"
                    keyboardType="default"
                    returnKeyType="next"
                    optionalText={' '}
                    isRequired
                    editable={watch('projectName') != undefined}
                    fieldName={`unitPreferences.${index}.remarks`}
                    control={control}
                    errTxt={errors?.unitPreferences?.[index]?.remarks?.message}
                  />
                  {unitPreferencesArray.fields.length > 1 && (
                    <TouchableOpacity
                      style={styles.deleteContainer}
                      onPress={() => {
                        unitPreferencesArray.remove(index);
                        calculateAllEoiAmounts();
                      }}>
                      <Image source={Images.Delete} style={styles.deleteImg} />
                      <CustomText.MediumText customStyle={styles.deleteText}>
                        Delete
                      </CustomText.MediumText>
                    </TouchableOpacity>
                  )}
                </>
              )}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )} // optional spacing between items
            />
          </View>
          <TouchableOpacity
            style={styles.addContainer}
            disabled={watch('projectName') == undefined}
            onPress={() =>
              unitPreferencesArray.append({
                unitPreference: '',
                noOfUnits: 0,
                eoiAmount: 0,
                remarks: '',
              })
            }>
            <Image source={Images.Plus} style={styles.addImg} />
            <CustomText.MediumText customStyle={styles.deleteText}>
              Add New Unit
            </CustomText.MediumText>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.cardContainer}>
          <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
            Payment Details
          </CustomText.LargeSemiBoldText>
          <CustomInput
            heading="Total EOI Amount (AED)"
            placeholder="e.g. 300,521,869"
            containerStyle={styles.inputContainer}
            autoCapitalize="none"
            returnKeyType="next"
            isRequired
            keyboardType="number-pad"
            fieldName={'totalEoiAmount'}
            control={control}
            errTxt={errors?.totalEoiAmount && errors?.totalEoiAmount?.message}
          />
          <DropDownPicker
            heading={'Mode of Payment'}
            isRequired
            placeholder={'Select'}
            data={dropDownData?.payment_mode}
            fieldName={'modeOfPayment'}
            control={control}
            errTxt={errors?.modeOfPayment && errors?.modeOfPayment?.message}
          />

          {/* Payment Fields - Conditionally rendered based on meta data */}
          {getAllFields('payment').includes('bank_name') && (
            <CustomInput
              heading="Bank Name"
              autoCapitalize="none"
              returnKeyType="next"
              placeholder="Enter Bank Name"
              isRequired={isFieldRequired('bank_name', 'payment')}
              fieldName={'chequeBankName'}
              control={control}
              errTxt={errors?.chequeBankName && errors?.chequeBankName?.message}
            />
          )}

          {getAllFields('payment').includes('cheque_number') && (
            <CustomInput
              heading="Cheque Number"
              placeholder="e.g. 123456789"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              isRequired={isFieldRequired('cheque_number', 'payment')}
              fieldName={'chequeNumber'}
              control={control}
              errTxt={errors?.chequeNumber && errors?.chequeNumber?.message}
            />
          )}

          {getAllFields('payment').includes('cheque_date') && (
            <CustomDatePicker
              heading={'Cheque Date'}
              placeholder="Select"
              isRequired={isFieldRequired('cheque_date', 'payment')}
              fieldName={'chequeDate'}
              control={control}
              // minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
              errTxt={errors?.chequeDate && errors?.chequeDate?.message}
            />
          )}

          {getAllFields('payment').includes('third_party_cheque') && (
            <DropDownPicker
              heading={'3rd Party Cheque'}
              placeholder={'Select'}
              isRequired={isFieldRequired('third_party_cheque', 'payment')}
              data={[
                {
                  id: 1,
                  key: 'Yes',
                  value: 'Yes',
                },
                {
                  id: 0,
                  key: 'No',
                  value: 'No',
                },
              ]}
              fieldName={'partyCheque'}
              control={control}
              errTxt={errors?.partyCheque && errors?.partyCheque?.message}
            />
          )}

          {getAllFields('payment').includes('source_of_fund_id') && (
            <DropDownPicker
              heading={'Source of Fund'}
              placeholder={'Select'}
              isRequired={isFieldRequired('source_of_fund_id', 'payment')}
              data={dropDownData?.source_of_fund}
              fieldName={'sourceOfFund'}
              control={control}
              errTxt={errors?.sourceOfFund && errors?.sourceOfFund?.message}
            />
          )}

          {getAllFields('payment').includes('source_of_wealth_id') && (
            <DropDownPicker
              heading={'Source of Wealth'}
              placeholder={'Select'}
              isRequired={isFieldRequired('source_of_wealth_id', 'payment')}
              data={dropDownData?.source_of_wealth}
              fieldName={'sourceOfWealth'}
              control={control}
              errTxt={errors?.sourceOfWealth && errors?.sourceOfWealth?.message}
            />
          )}
        </View>
        {applicationType === 'Corporate' ? (
          <View style={globalStyles.cardContainer}>
            <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
              KYC Details
            </CustomText.LargeSemiBoldText>

            <CustomDatePicker
              heading="Company Registration Date"
              isRequired
              placeholder="Select"
              fieldName={'companyRegistrationDate'}
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
              control={control}
              errTxt={
                errors?.companyRegistrationDate &&
                errors?.companyRegistrationDate?.message
              }
            />

            <CustomInput
              heading="Company Registration No"
              placeholder="e.g. 6515161506"
              isRequired
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              fieldName={'companyRegistrationNo'}
              control={control}
              errTxt={
                errors?.companyRegistrationNo &&
                errors?.companyRegistrationNo?.message
              }
            />

            <CustomInput
              heading="Company Registration Place"
              placeholder="e.g. United Arab Emirates"
              isRequired
              autoCapitalize="none"
              returnKeyType="next"
              fieldName={'companyRegistrationPlace'}
              control={control}
              errTxt={
                errors?.companyRegistrationPlace &&
                errors?.companyRegistrationPlace?.message
              }
            />

            <CustomInput
              heading="Trade License No"
              placeholder="e.g. 6515161506"
              isRequired
              autoCapitalize="none"
              keyboardType="default"
              maxLength={15}
              returnKeyType="next"
              fieldName={'tradeLicenseNo'}
              control={control}
              errTxt={errors?.tradeLicenseNo && errors?.tradeLicenseNo?.message}
            />

            <CustomDatePicker
              heading={'Trade License Expiry'}
              isRequired
              placeholder="Select"
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
              fieldName={'tradeLicenseExpiry'}
              control={control}
              errTxt={
                errors?.tradeLicenseExpiry &&
                errors?.tradeLicenseExpiry?.message
              }
            />
          </View>
        ) : (
          <View style={globalStyles.cardContainer}>
            <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
              KYC Details
            </CustomText.LargeSemiBoldText>

            <CustomInput
              heading="Passport Number"
              placeholder="e.g. AEP6316516160"
              containerStyle={styles.inputContainer}
              autoCapitalize="none"
              returnKeyType="next"
              isRequired
              fieldName={'passportNumber'}
              control={control}
              errTxt={errors?.passportNumber && errors?.passportNumber?.message}
            />

            <CustomDatePicker
              heading={'Passport Expiry Date'}
              placeholder="Select"
              fieldName={'passportExpiryDate'}
              isRequired
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
              control={control}
              errTxt={
                errors?.passportExpiryDate &&
                errors?.passportExpiryDate?.message
              }
            />

            <CustomInput
              heading="National ID Number"
              placeholder="e.g. 6515161506"
              autoCapitalize="none"
              isRequired
              keyboardType="default"
              maxLength={15}
              returnKeyType="next"
              fieldName={'nationalIdNumber'}
              control={control}
              errTxt={
                errors?.nationalIdNumber && errors?.nationalIdNumber?.message
              }
            />

            <CustomDatePicker
              heading={'National ID Expiry Date'}
              isRequired
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
              placeholder="Select"
              fieldName={'nationIdExpiryDate'}
              control={control}
              errTxt={
                errors?.nationIdExpiryDate &&
                errors?.nationIdExpiryDate?.message
              }
            />

            <CustomInput
              heading="Address"
              placeholder="e.g. 26th Floor, OMNIYAT Business Bay"
              autoCapitalize="none"
              returnKeyType="next"
              fieldName={'addressLine2'}
              multiline={true}
              isRequired
              control={control}
              customStyle={styles.inputTextTopAlign}
              errTxt={errors?.addressLine2 && errors?.addressLine2?.message}
            />

            <CustomInput
              heading={'City'}
              isRequired
              autoCapitalize="none"
              returnKeyType="next"
              placeholder="Enter City"
              fieldName={'city'}
              control={control}
              errTxt={errors?.city && errors?.city?.message}
            />

            <CustomInput
              heading="Postal Code"
              placeholder="e.g. 6515161506"
              isRequired
              autoCapitalize="none"
              keyboardType="number-pad"
              returnKeyType="next"
              fieldName={'postalCode'}
              control={control}
              errTxt={errors?.postalCode && errors?.postalCode?.message}
            />
          </View>
        )}
        {applicationType === 'Corporate' ? (
          <View style={globalStyles.cardContainer}>
            <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
              Expression of Interest
            </CustomText.LargeSemiBoldText>
            <CustomText.LargeSemiBoldText customStyle={styles.attachedText}>
              Attach Documents
            </CustomText.LargeSemiBoldText>

            {/* Corporate Document Fields - Conditionally rendered based on meta data */}

            <UploadDocument
              fieldName="passport"
              control={control}
              setError={setError}
              heading={'Upload Passport Copy'}
              isRequired
              errTxt={errors?.passport && errors?.passport?.message}
            />

            {getAllFields('documents').includes('National ID') && (
              <UploadDocument
                fieldName="nationalId"
                control={control}
                setError={setError}
                errTxt={errors?.nationalId && errors?.nationalId?.message}
                heading={'Upload National ID Copy'}
                isRequired={isFieldRequired('National ID', 'documents')}
              />
            )}

            {getAllFields('documents').includes('Trade License') && (
              <UploadDocument
                fieldName="tradeLicense"
                control={control}
                setError={setError}
                errTxt={errors?.tradeLicense && errors?.tradeLicense?.message}
                isRequired={isFieldRequired('Trade License', 'documents')}
                heading={'Upload Trade License'}
              />
            )}

            {getAllFields('documents').includes('Proof of Payment') && (
              <UploadDocument
                fieldName="proofOfPayment"
                control={control}
                setError={setError}
                errTxt={
                  errors?.proofOfPayment && errors?.proofOfPayment?.message
                }
                isRequired={isFieldRequired('Proof of Payment', 'documents')}
                heading={'Upload Proof of Payment'}
              />
            )}
          </View>
        ) : (
          <View style={globalStyles.cardContainer}>
            <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
              Expression of Interest
            </CustomText.LargeSemiBoldText>
            <CustomText.LargeSemiBoldText customStyle={styles.attachedText}>
              Attach Documents
            </CustomText.LargeSemiBoldText>

            {/* Individual Document Fields - Conditionally rendered based on meta data */}

            <UploadDocument
              fieldName="passport"
              control={control}
              setError={setError}
              heading={'Upload Passport'}
              isRequired
              errTxt={errors?.passport && errors?.passport?.message}
            />

            {getAllFields('documents').includes('National ID') && (
              <UploadDocument
                fieldName="nationalId"
                control={control}
                setError={setError}
                errTxt={errors?.nationalId && errors?.nationalId?.message}
                heading={'Upload National ID'}
                isRequired={isFieldRequired('National ID', 'documents')}
              />
            )}

            {getAllFields('documents').includes('Proof of Payment') && (
              <UploadDocument
                fieldName="proofOfPayment"
                control={control}
                setError={setError}
                errTxt={
                  errors?.proofOfPayment && errors?.proofOfPayment?.message
                }
                isRequired={isFieldRequired('Proof of Payment', 'documents')}
                heading={'Upload Proof of Payment'}
              />
            )}
          </View>
        )}

        <PrimaryButton title="Submit" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
      <Loader isLoading={loading} />
    </MainContainer>
  );
};
const styles = StyleSheet.create({
  scroll: {flexGrow: 1, paddingBottom: Metrix.VerticalSize(40)},
  successHeadingStyle: {width: '70%'},
  buttonText: {
    textAlign: 'center',
    flex: 1,
    padding: Metrix.VerticalSize(10),
    alignItems: 'center',
    margin: Metrix.HorizontalSize(2),
    borderRadius: Metrix.LightRadius,
  },
  buttonContainer: {
    marginTop: Metrix.VerticalSize(20),
    backgroundColor: Colors.LightGreyBadge('0.12'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: Metrix.LightRadius,
  },
  selectedTabText: {
    fontSize: FontType.FontSmall,
  },
  selectedTabContainer: {
    backgroundColor: Colors.White,
    elevation: 5,
    shadowColor: Colors.DarkBlack,
    shadowOffset: {
      width: Metrix.HorizontalSize(0),
      height: Metrix.HorizontalSize(1),
    },
    shadowOpacity: 0.22,
  },
  headingText: {
    fontSize: FontType.FontMedium,
    marginBottom: Metrix.VerticalSize(15),
  },
  inputContainer: {
    marginTop: Metrix.VerticalSize(20),
  },
  attachedText: {
    fontSize: FontType.FontRegular,
  },
  deleteImg: {
    height: Metrix.VerticalSize(14),
    width: Metrix.HorizontalSize(14),
    resizeMode: 'contain',
  },
  addImg: {
    height: Metrix.VerticalSize(14),
    width: Metrix.HorizontalSize(14),
    resizeMode: 'contain',
    tintColor: Colors.Black,
  },
  deleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrix.HorizontalSize(5),
    justifyContent: 'center',
    marginTop: Metrix.VerticalSize(10),
    padding: Metrix.HorizontalSize(10),
    borderWidth: 1,
    borderColor: Colors.Black,
    borderRadius: Metrix.RoundRadius,
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrix.HorizontalSize(5),
    justifyContent: 'center',
    marginTop: Metrix.VerticalSize(10),
    padding: Metrix.HorizontalSize(10),
    borderWidth: 1,
    borderColor: Colors.Black,
    borderRadius: Metrix.RoundRadius,
    borderStyle: 'dashed',
  },
  deleteText: {
    fontSize: FontType.FontSmall,
  },
  unitCardContainer: {
    paddingTop: Metrix.HorizontalSize(0),
  },
  itemSeparator: {height: 10},
  inputTextTopAlign: {textAlignVertical: 'top'},
});

export default CaptureEoi;
