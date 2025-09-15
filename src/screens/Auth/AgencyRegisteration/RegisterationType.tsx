import React, {use, useEffect, useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import {MainContainer} from '@/components/MainContainer';
import CustomText from '@/components/CustomText';
import {NavigationService, Images, Colors, Metrix, FontType} from '@/config';
import {RouteNames} from '@/config/routes';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {setDropDownData} from '@/redux/slice/UserSlice/userSlice';
import {dispatchToStore, RootState} from '@/redux/store';
import {APIS} from '@/services/apiMethods';
import {setCategoryType} from '@/redux/slice/AuthSlice/authSlice';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

const RegisterationType = ({route}) => {
  const type = route?.params?.type;
  const title = route?.params?.title;
  const categoryType = useSelector(
    (state: RootState) => state.auth.categoryType,
  );
  const [selectedSteps, setSelectedSteps] = useState<number>(1);
  const focused = useIsFocused();
  const getStepDataQuery = useQuery({
    queryKey: ['onboardingStep', selectedSteps],
    queryFn: () => APIS.getOnboardingStep('AGENCY_DETAIL'),
    enabled: true, // Don't run automatically
  });

  const options = [
    {
      label: 'Real Estate Agency (Dubai Based)',
      value: 'dubai',
      catType: 'Real Estate Agency (Dubai Based)',
    },
    {
      label: 'Real Estate Agency (Other Emirates)',
      value: 'other_emirates',
      catType: 'Real Estate Agency (Other Emirates)',
    },
    // { commented / removed as per client's requirment
    //   label: 'Non-Real Estate Company',
    //   value: 'non_real_estate',
    //   catType: 'Non Real Estate Company',
    // },
    // {
    //   label: 'Freelancer',
    //   value: 'freelancer',
    //   catType: 'UAE Freelancer',
    // },
  ].filter(Boolean);

  const internationalOptions = [
    {
      label: 'Real Estate Agency',
      value: 'dubai',
      catType: 'International Real Estate Agency',
    },
    {
      label: 'Non-Real Estate Company',
      value: 'non_real_estate',
      catType: 'International Non Real Estate Company',
    },
    {
      label: 'Freelancer',
      value: 'freelancer',
      catType: 'International Freelancer',
    },
  ].filter(Boolean);
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.clear();
    getStepDataQuery.data;
  }, [focused]);
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

  return (
    <MainContainer isHeader heading={title} backArrow>
      <View style={styles.cardContainer}>
        <View style={styles.labelRow}>
          <CustomText.LargeSemiBoldText customStyle={styles.label}>
            <CustomText.LargeBoldText customStyle={styles.redAsterisk}>
              *{' '}
            </CustomText.LargeBoldText>
            Select Type
          </CustomText.LargeSemiBoldText>
        </View>
        <View style={styles.optionsWrapper}>
          {(type === 'uae' ? options : internationalOptions).map(
            (item, idx) => {
              return (
                <TouchableOpacity
                  key={item.value}
                  style={styles.optionCard}
                  activeOpacity={0.7}
                  onPress={() => {
                    // Navigate to appropriate form based on selection
                    let targetRoute =
                      RouteNames.AuthRoutes.RegisterationDetails;

                    if (type === 'uae') {
                      // UAE routes
                      switch (item.value) {
                        case 'dubai':
                          targetRoute =
                            RouteNames.AuthRoutes.DubaiBasedRealEstate;
                          break;
                        case 'other_emirates':
                          targetRoute =
                            RouteNames.AuthRoutes.OtherEmiratesRealEstate;
                          break;
                        case 'non_real_estate':
                          targetRoute =
                            RouteNames.AuthRoutes.NonRealEstateCompany;
                          break;
                        case 'freelancer':
                          targetRoute = RouteNames.AuthRoutes.UaeFreelancer;
                          break;
                      }
                    } else {
                      // International routes
                      switch (item.value) {
                        case 'dubai':
                          targetRoute =
                            RouteNames.AuthRoutes.InternationalRealEstate;
                          break;
                        case 'non_real_estate':
                          targetRoute =
                            RouteNames.AuthRoutes.InternationalNonRealEstate;
                          break;
                        case 'freelancer':
                          targetRoute =
                            RouteNames.AuthRoutes.InternationalFreelancer;
                          break;
                      }
                    }
                    if (
                      getStepDataQuery?.data?.data?.data?.category ===
                        undefined &&
                      getStepDataQuery?.data?.data?.data?.agency?.category ===
                        undefined
                    ) {
                      dispatchToStore(setCategoryType(item.catType));
                      NavigationService.navigate(targetRoute);
                    } else if (
                      getStepDataQuery?.data?.data?.data?.category !==
                        undefined &&
                      getStepDataQuery?.data?.data?.data?.category !=
                        item?.catType
                    ) {
                      Alert.alert(
                        'Are you sure you want to change the type?',
                        'All unsaved changes will be lost',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              queryClient.clear();
                              dispatchToStore(setCategoryType(item.catType));
                              NavigationService.navigate(targetRoute);
                            },
                          },
                        ],
                      );
                    } else if (
                      getStepDataQuery?.data?.data?.data?.agency?.category !=
                        undefined &&
                      getStepDataQuery?.data?.data?.data?.agency?.category !=
                        item?.catType
                    ) {
                      Alert.alert(
                        'Are you sure you want to change the type?',
                        'All unsaved changes will be lost',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              queryClient.clear();
                              dispatchToStore(setCategoryType(item.catType));
                              NavigationService.navigate(targetRoute);
                            },
                          },
                        ],
                      );
                    } else {
                      dispatchToStore(setCategoryType(item.catType));
                      NavigationService.navigate(targetRoute);
                    }

                    // if (categoryType == '') {
                    //   dispatchToStore(setCategoryType(item.catType));
                    //   NavigationService.navigate(targetRoute);
                    // } else if (categoryType != item?.catType) {
                    //   Alert.alert(
                    //     'Are you sure you want to change the type?',
                    //     'All unsaved changes will be lost',
                    //     [
                    //       {
                    //         text: 'Cancel',
                    //         style: 'cancel',
                    //       },
                    //       {
                    //         text: 'OK',
                    //         onPress: () => {
                    //           dispatchToStore(setCategoryType(item.catType));
                    //           NavigationService.navigate(targetRoute);
                    //         },
                    //       },
                    //     ],
                    //   );
                    // } else {
                    //   dispatchToStore(setCategoryType(item.catType));
                    //   NavigationService.navigate(targetRoute);
                    // }
                  }}>
                  <CustomText.RegularText>{item.label}</CustomText.RegularText>
                  <Image
                    source={Images.RightArrow}
                    style={styles.arrowIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            },
          )}
        </View>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    padding: Metrix.VerticalSize(20),
    marginTop: Metrix.VerticalSize(10),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrix.VerticalSize(25),
  },
  label: {
    fontSize: FontType.FontLarge,
  },
  redAsterisk: {
    color: Colors.Error,
  },
  optionsWrapper: {
    gap: Metrix.VerticalSize(12),
  },
  optionCard: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Metrix.HorizontalSize(15),
    marginBottom: Metrix.VerticalSize(10),
    justifyContent: 'space-between',
  },
  optionText: {
    // width: '80%',
  },
  arrowIcon: {
    width: Metrix.HorizontalSize(13),
    height: Metrix.VerticalSize(13),
  },
});

export default RegisterationType;
