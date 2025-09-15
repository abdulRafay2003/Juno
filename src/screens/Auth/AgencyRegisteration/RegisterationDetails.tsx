import {CustomText} from '@/components';
import {MainContainer} from '@/components/MainContainer';
import {PrimaryButton} from '@/components/PrimaryButton';
import CustomSwitch from '@/components/Switch';
import * as yup from 'yup';
import {
  freelancerStep1Schema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from '@/components/Validations';
import {Colors, FontType, Metrix, NavigationService} from '@/config';
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {View, StyleSheet, ScrollView} from 'react-native';
import StepOne from '@/components/RegistrationSteps/StepOne';
import StepTwo from '@/components/RegistrationSteps/StepTwo';
import StepThree from '@/components/RegistrationSteps/StepThree';
import StepFour from '@/components/RegistrationSteps/StepFour';
import {FreelancerSteps, RegistrationSteps} from '@/constants/dummyData';
import FreelancerStepOne from '@/components/RegistrationSteps/FreelancerStepOne';
import {RouteNames} from '@/config/routes';
import {setDropDownData} from '@/redux/slice/UserSlice/userSlice';
import {dispatchToStore} from '@/redux/store';
import {APIS} from '@/services/apiMethods';
import {useQuery} from '@tanstack/react-query';

const RegisterationDetails = props => {
  const [selectedSteps, setSelectedSteps] = useState<number>(1);
  const [bankAvailability, setBankAvailability] = useState<boolean>(true);
  const headerTitle = props?.route?.params?.subType;
  const checkType = props?.route?.params?.type == 'international';

  const checkDubaiBased = headerTitle === 'Real Estate Agency (Dubai Based)';
  const checkFreelancer = headerTitle === 'Freelancer';
  const checknonEstate = headerTitle == 'Non-Real Estate Company';
  const internationRealEstate = headerTitle == 'Real Estate Company';
  const {data: dropdownData} = useQuery({
    queryKey: ['dropdownData'],
    queryFn: () => APIS.getDropDownData(),
    staleTime: 0,
  });
  useEffect(() => {
    if (dropdownData) {
      dispatchToStore(setDropDownData(dropdownData?.data?.data?.dropdowns));
    }
  }, [dropdownData]);
  const getYupValidationSchema = () => {
    if (selectedSteps === 3 && !bankAvailability && !checkFreelancer) {
      return yup.object().shape({}); // No validation on this step
    }

    return [step1Schema, step2Schema, step3Schema, step4Schema][
      selectedSteps - 1
    ];
  };
  const getFreelancerYupValidationSchema = () => {
    return [freelancerStep1Schema, step3Schema, step4Schema][selectedSteps - 1];
  };

  const {
    handleSubmit,
    control,
    trigger,
    formState: {errors},
    getValues,
    setValue,
    watch,
  } = useForm({
    mode: 'onChange',

    reValidateMode: 'onChange',
    context: {
      freelancer: checkFreelancer,
      checkType: checkType,
      headerTitle: headerTitle,
      tradeLicenseCategory: '',
      bankAvailability: bankAvailability,
      checknonEstate: checknonEstate,
      internationRealEstate: internationRealEstate,
      haveTrn: 'No',
    },
    resolver: yupResolver(
      checkFreelancer
        ? getFreelancerYupValidationSchema()
        : (getYupValidationSchema() as yup.ObjectSchema<any>),
    ),
  });
  const scrollRef = useRef<ScrollView>(null);

  const onSubmit = (data: any) => {
    NavigationService.navigate(RouteNames.AuthRoutes.Success, {
      heading: 'Thank You! Your registration is submitted for approval.',
      buttonText: 'Close',
      from: 'registeration',
    });
  };

  const handleSteps = async () => {
    const isStepValid = await trigger();
    if (!isStepValid) {
      return;
    }
    const isLastStep = selectedSteps === getData().length;

    if (isLastStep) {
      handleSubmit(onSubmit)();
    } else {
      scrollRef.current?.scrollTo({y: 0, animated: true});
      setSelectedSteps(prev => prev + 1);
    }
  };
  const getData = () => (checkFreelancer ? FreelancerSteps : RegistrationSteps);

  const renderSteps = () => {
    switch (selectedSteps) {
      case 1:
        return (
          <StepOne
            control={control}
            setValue={setValue}
            internationRealEstate={internationRealEstate}
            errors={errors}
            watch={watch}
            checknonEstate={checknonEstate}
            checkType={checkType}
            checkDubaiBased={checkDubaiBased}
          />
        );
      case 2:
        return (
          <StepTwo
            control={control}
            errors={errors}
            checkDubaiBased={checkDubaiBased}
            watch={watch}
            checknonEstate={checknonEstate}
            checkType={checkType}
          />
        );
      case 3:
        return (
          <StepThree
            control={control}
            errors={errors}
            bankAvailability={bankAvailability}
            checknonEstate={checknonEstate}
            freelancer={checkFreelancer}
            checkType={checkType}
          />
        );
      case 4:
        return (
          <StepFour
            control={control}
            errors={errors}
            bank={bankAvailability}
            checknonEstate={checknonEstate}
            checkType={checkType}
            watch={watch}
            checkDubaiBased={checkDubaiBased}
            headerTitle={headerTitle}
          />
        );
      default:
        return null;
    }
  };
  const renderFreelancerSteps = () => {
    switch (selectedSteps) {
      case 1:
        return (
          <FreelancerStepOne
            control={control}
            setValue={setValue}
            errors={errors}
            watch={watch}
            checkType={checkType}
          />
        );
      case 2:
        return (
          <StepThree
            control={control}
            checkType={checkType}
            checknonEstate={checknonEstate}
            freelancer={checkFreelancer}
            errors={errors}
            bankAvailability={checkFreelancer}
          />
        );
      case 3:
        return (
          <StepFour
            control={control}
            errors={errors}
            freelancer={checkFreelancer}
            bank={checkFreelancer}
            checkType={checkType}
            headerTitle={headerTitle}
            watch={watch}
          />
        );
      default:
        return null;
    }
  };
  const renderTitle = () => {
    const currentStep =
      getData() != null &&
      getData().length &&
      getData().find(step => step.id === selectedSteps);
    return currentStep?.title || '';
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
      heading={headerTitle}
      isFlatList
      customeHeaderStyle={styles.headerStyle}
      customeStyle={styles.containerMain}
      backFunction={handleBackPress}>
      <View style={styles.stepContainer}>
        {getData() != null &&
          getData()?.length &&
          getData().map((item, index) => {
            const isActive = index < selectedSteps;
            return (
              <View
                style={[styles.stepLine, isActive && styles.selectedSteps]}
              />
            );
          })}
      </View>
      <View style={styles.hrLine} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ref={scrollRef}>
        <View style={styles.containerStyle}>
          {selectedSteps == 3 && !checkFreelancer && !checkType && (
            <View>
              {
                <CustomText.LargeBoldText
                  customStyle={{
                    fontSize: FontType.FontMedium,
                    marginVertical: Metrix.VerticalSize(10),
                  }}>
                  {' '}
                  <CustomText.LargeBoldText
                    customStyle={{
                      color: Colors.Error,
                      fontSize: FontType.FontExtraLarge,
                    }}>
                    *
                  </CustomText.LargeBoldText>{' '}
                  Bank Details
                </CustomText.LargeBoldText>
              }
              <View style={styles.bankAvailabilityContainer}>
                <CustomText.RegularText>Availability</CustomText.RegularText>
                <CustomSwitch
                  value={bankAvailability}
                  onChange={setBankAvailability}
                />
              </View>
            </View>
          )}

          <View style={[styles.card]}>
            <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
              {renderTitle()}
            </CustomText.LargeSemiBoldText>
            {checkFreelancer ? renderFreelancerSteps() : renderSteps()}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={
              selectedSteps == getData().length && getData() != null
                ? 'Submit'
                : 'Continue'
            }
            onPress={handleSteps}
          />
        </View>
      </ScrollView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
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

export default RegisterationDetails;
