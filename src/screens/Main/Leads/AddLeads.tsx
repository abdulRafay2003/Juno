import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  CustomDatePicker,
  DropDownPicker,
  MainContainer,
  PrimaryButton,
  CustomPhoneInput,
  CustomInput,
  CustomText,
  Loader,
} from '@/components';
import {Colors, Metrix, NavigationService} from '@/config';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {AddLeadsValidtion} from '@/components/Validations';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {RouteNames} from '@/config/routes';
import {useMutation, useQuery} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  findCountryByCode,
  formatDate,
  showToast,
} from '@/utils/business.helper';
import {AxiosError} from 'axios';
import {AddLeadsFormData, AddLeadsRequestBody} from '@/constants/Types';

const AddLeads = ({route}) => {
  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );
  const [countryCode, setCountryCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(AddLeadsValidtion),
  });

  const {data: projectsData, isLoading: projectsLoading} = useQuery({
    queryKey: ['projects'],
    queryFn: () => APIS.getWithSlug('projects'),
    staleTime: 300000, // 5 minutes cache time
  });
  const {data: campaignData, isLoading: campaignLoading} = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => APIS.getWithSlug('campaigns'),
    staleTime: 300000, // 5 minutes cache time
  });

  const {data: salesManagerData, isLoading: salesManagerLoading} = useQuery({
    queryKey: ['salesManager'],
    queryFn: () => APIS.getWithSlug('salesmanagers'),
    staleTime: 300000, // 5 minutes cache time
  });

  const postLead = useMutation({
    mutationFn: (body: AddLeadsRequestBody) => APIS?.creatLeads(body),
    onSuccess: data => {
      setLoading(false);
      NavigationService.replace(RouteNames.HomeRoutes.Success, {
        from: route?.params?.from || 'leads',
        heading: 'The Lead has been successfully created',
        buttonText: 'Back to Leads',
        headingStyle: {width: '70%'},
      });
    },
    onError: (error: any) => {
      const err = error as AxiosError;

      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Login Failed',
      );
    },
  });

  useEffect(() => {
    if (countryCode == null) {
      const dialCodeOption = dropDownData?.mobile_country_code?.find(
        item => item?.key == '971',
      );
      if (dialCodeOption) {
        setCountryCode({
          dial_code: `+${dialCodeOption?.key}`,
          flag: dialCodeOption?.icon_url,
        });
        setValue('dialCode', `+${dialCodeOption?.key}`);
      }
    }
  }, []);

  const transformLeadData = (
    formData: AddLeadsFormData,
  ): AddLeadsRequestBody => {
    return {
      title_id: formData.salutation ?? null,
      first_name: formData.firstName ?? null,
      last_name: formData.lastName ?? null,
      gender_id: formData.gender ?? null,
      date_of_birth: formData.dob != null ? formatDate(formData.dob) : null,
      mobile_country_code_id: findCountryByCode(countryCode?.dial_code),
      mobile_phone: formData.mobileNumber ?? null,
      email: formData.email ?? null,
      interested_property_type_id: formData.interestPropertyType ?? null,
      nationality_id: formData.nationality ?? null,
      country_of_residence_id: formData.countryOfResidence ?? null,
      sales_manager_id: formData.salesManager ?? null,
      project_id: formData.project ?? null,
      campaign_id: formData.campaign ?? null,
      preferred_language_id: formData.preferredLanguage ?? '',
      company_name: 'Test Data', // static value
    };
  };

  const addLead = (values: AddLeadsFormData) => {
    setLoading(true);
    postLead.mutate(transformLeadData(values));
  };

  return (
    <MainContainer isHeader isFlatList heading="Add Lead">
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.backgroundContainer}>
          <CustomText.LargeSemiBoldText customStyle={styles.headingMargin}>
            Lead Information
          </CustomText.LargeSemiBoldText>
          <DropDownPicker
            heading={'Title'}
            isRequired
            placeholder={'Select'}
            searchPlaceholder={'Search Title'}
            data={dropDownData?.salutation}
            fieldName={'salutation'}
            control={control}
            errTxt={errors?.salutation && errors?.salutation?.message}
          />
          <CustomInput
            heading="First Name"
            placeholder="e.g. Muhammad"
            keyboardType="email-address"
            returnKeyType="next"
            isRequired
            fieldName={'firstName'}
            control={control}
            errTxt={errors?.firstName && errors?.firstName?.message}
          />
          <CustomInput
            heading="Last Name"
            placeholder="e.g. Ali"
            keyboardType="email-address"
            returnKeyType="next"
            isRequired
            fieldName={'lastName'}
            control={control}
            errTxt={errors?.lastName && errors?.lastName?.message}
          />
          <DropDownPicker
            heading={'Gender'}
            placeholder={'Select'}
            searchPlaceholder={'Search Gender'}
            data={dropDownData?.gender}
            fieldName={'gender'}
            control={control}
          />
          <CustomDatePicker
            heading={'Date of Birth'}
            fieldName={'dob'}
            control={control}
            maxDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
          />
          <CustomPhoneInput
            heading={'Mobile'}
            isRequired
            setValue={setCountryCode}
            value={countryCode}
            fieldName={'mobileNumber'}
            control={control}
            errTxt={errors?.mobileNumber && errors?.mobileNumber?.message}
          />

          <CustomInput
            heading="Email"
            placeholder="e.g. ali@beyond.ae"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            isRequired
            fieldName={'email'}
            control={control}
            errTxt={errors?.email && errors?.email?.message}
          />
          <DropDownPicker
            heading={'Nationality'}
            placeholder={'Select'}
            isRequired
            searchPlaceholder={'Search Nationality'}
            data={dropDownData?.nationality}
            fieldName={'nationality'}
            control={control}
            errTxt={errors?.nationality && errors?.nationality?.message}
          />
          <DropDownPicker
            heading={'Sales Manager'}
            placeholder={'Select'}
            isRequired
            searchPlaceholder={'Search Sales Manager'}
            data={salesManagerData?.data?.data}
            fieldName={'salesManager'}
            control={control}
            errTxt={errors?.salesManager && errors?.salesManager?.message}
          />
          <DropDownPicker
            heading={'Preferred Language'}
            placeholder={'Select'}
            searchPlaceholder={'Search Preferred Language'}
            data={dropDownData?.preferred_language}
            fieldName={'preferredLanguage'}
            control={control}
          />
          <DropDownPicker
            heading={'Residence'}
            placeholder={'Select'}
            searchPlaceholder={'Search Country'}
            data={dropDownData?.country}
            fieldName={'countryOfResidence'}
            control={control}
          />
        </View>
        <View style={styles.backgroundContainer}>
          <CustomText.LargeSemiBoldText customStyle={styles.headingMargin}>
            Interest Details
          </CustomText.LargeSemiBoldText>
          <DropDownPicker
            heading={'Property Type'}
            placeholder={'Select'}
            searchPlaceholder={'Search Property Type'}
            data={dropDownData?.property_type}
            fieldName={'interestPropertyType'}
            control={control}
          />
          <DropDownPicker
            heading={'Select Project'}
            placeholder={'Project'}
            searchPlaceholder={'Search Project'}
            data={projectsData?.data?.data}
            fieldName={'project'}
            isSearch
            control={control}
            dropdownPosition={'top'}
          />

          <DropDownPicker
            heading={'Select Campaign'}
            placeholder={'Select'}
            searchPlaceholder={'Search Campaign'}
            data={campaignData?.data?.data}
            isSearch
            fieldName={'campaign'}
            control={control}
            dropdownPosition={'top'}
          />
        </View>
        <PrimaryButton title="Submit" onPress={handleSubmit(addLead)} />
      </ScrollView>
      <Loader isLoading={loading} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    borderWidth: 1,
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    borderColor: Colors.TextInputBorderColor,
    paddingVertical: Metrix.VerticalSize(20),
    paddingHorizontal: Metrix.HorizontalSize(15),
    marginTop: Metrix.VerticalSize(15),
  },
  headingMargin: {marginBottom: Metrix.VerticalSize(20)},
  container: {
    padding: Metrix.HorizontalSize(15),
    backgroundColor: Colors.White,
  },
  section: {
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    borderRadius: Metrix.Radius,
    padding: Metrix.VerticalSize(20),
    marginBottom: Metrix.VerticalSize(15),
  },
  title: {
    height: 20,
    width: '40%',
    marginBottom: Metrix.VerticalSize(20),
  },
  input: {
    height: 45,
    borderRadius: 6,
    marginBottom: Metrix.VerticalSize(15),
    width: '100%',
  },
  button: {
    height: 50,
    width: '100%',
    borderRadius: 8,
    marginTop: Metrix.VerticalSize(20),
    marginBottom: Metrix.VerticalSize(40),
  },
  scrollContentContainer: {
    paddingBottom: Metrix.VerticalSize(40),
    flexGrow: 1,
  },
});

export default AddLeads;
