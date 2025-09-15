import React, {useEffect, useState} from 'react';
import {View, ImageBackground, StyleSheet, Alert} from 'react-native';
import {Images, Colors, Metrix, NavigationService, FontType} from '@/config';
import {RouteNames} from '@/config/routes';
import {MainContainer} from '@/components/MainContainer';
import CustomText from '@/components/CustomText';
import {PrimaryButton} from '@/components/PrimaryButton';
import {dispatchToStore, RootState} from '@/redux/store';
import {useSelector} from 'react-redux';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {setDropDownData} from '@/redux/slice/UserSlice/userSlice';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useIsFocused} from '@react-navigation/native';
import {set} from 'react-hook-form';

const Registeration = () => {
  const isFocused = useIsFocused();
  const [isInternational, setIsInternational] = useState<null | boolean>(null);
  const registerationCardData = [
    {
      title: 'Commercial & Freelancer - UAE',
      description:
        'Launch your business in the UAE to access a vibrant market and benefit from its strategic location. This registration ensures compliance with local regulations and unlocks various growth avenues.',
      image: Images.Registeration_1, // Set Images.Registeration_1 in Registeration
      resume: isInternational != null ? !isInternational : false,
    },
    {
      title: 'Commercial & Freelancer - International',
      description:
        'Launch your business in the UAE to access a vibrant market and benefit from its strategic location. This registration ensures compliance with local regulations and unlocks various growth avenues.',
      image: Images.Registeration_2, // Set Images.Registeration_2 in Registeration
      resume: isInternational != null ? isInternational : false,
    },
  ];
  const {data: dropdownData} = useQuery({
    queryKey: ['dropdownData'],
    queryFn: () => APIS.getDropDownData(),
    staleTime: 0,
  });

  const query = useMutation({
    mutationFn: () => APIS.getOnboardingStep('AGENCY_DETAIL'),
    onSuccess(data, variables, context) {
      handleInternationalType(data);
    },
    onError(error, variables, context) {
      setIsInternational(null);
    },
  });

  useEffect(() => {
    if (dropdownData) {
      dispatchToStore(setDropDownData(dropdownData?.data?.data?.dropdowns));
    }
  }, [dropdownData]);

  useEffect(() => {
    if (isFocused) {
      query.mutate();
    }
  }, [isFocused]);

  const handleInternationalType = queryData => {
    // if freelance (International or UAE)
    if (queryData?.data?.data?.agency) {
      if (queryData?.data?.data?.agency?.category.includes('International')) {
        setIsInternational(true);
      } else {
        setIsInternational(false);
      }
    } else {
      if (queryData?.data?.data?.category?.includes('International')) {
        setIsInternational(true);
      } else {
        setIsInternational(false);
      }
    }
  };

  const handleBackNavigation = () => {
    Alert.alert(
      'Do you want to go back?',
      'By logging in, you can proceed with your registration',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => NavigationService.reset_0(RouteNames.AuthRoutes.Login),
        },
      ],
    );
  };

  if (query.isPending) {
    return (
      <MainContainer
        backFunction={handleBackNavigation}
        isHeader
        heading="Broker Agency Registration"
        backArrow>
        <View style={styles.topMarginContainer}>
          <SkeletonPlaceholder borderRadius={Metrix.Radius}>
            {[...Array(2)].map((_, idx) => (
              <View key={idx} style={styles.skeletonCardWrapper}>
                <View style={styles.skeletonCardInner} />
              </View>
            ))}
          </SkeletonPlaceholder>
        </View>
      </MainContainer>
    );
  }

  return (
    <MainContainer
      backFunction={handleBackNavigation}
      isHeader
      heading="Broker Agency Registration"
      backArrow>
      <View style={styles.topMarginContainer}>
        {registerationCardData.map((item, index) => (
          <ImageBackground
            // resizeMode={'contain'}
            key={index}
            source={item.image}
            style={styles.card}
            imageStyle={styles.cardImage}>
            <View style={styles.overlay}>
              <CustomText.LargeSemiBoldText
                customStyle={styles.title}
                isWhiteColor>
                {item.title}
              </CustomText.LargeSemiBoldText>
              <CustomText.RegularText
                customStyle={styles.description}
                isWhiteColor>
                {item.description}
              </CustomText.RegularText>
              <PrimaryButton
                title={
                  item?.resume ? 'Resume Registration' : 'Start Registration'
                }
                onPress={() =>
                  NavigationService.navigate(
                    RouteNames.AuthRoutes.RegisterationType,
                    {
                      type: index === 0 ? 'uae' : 'international',
                      title: item?.title,
                    },
                  )
                }
                color={Colors.White}
                textColor={Colors.LightBlack}
              />
            </View>
          </ImageBackground>
        ))}
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    height: Metrix.VerticalSize(290),
    marginBottom: Metrix.VerticalSize(15),
    borderRadius: Metrix.Radius,
    overflow: 'hidden',
  },
  cardImage: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.BlackColorOpacity(),
    paddingHorizontal: Metrix.VerticalSize(20),
    paddingVertical: Metrix.VerticalSize(15),
    justifyContent: 'flex-end',
  },
  topMarginContainer: {
    marginTop: Metrix.VerticalSize(10),
  },
  skeletonCardWrapper: {
    marginBottom: Metrix.VerticalSize(15),
    borderWidth: 1,
  },
  skeletonCardInner: {
    height: Metrix.VerticalSize(290),
    borderRadius: Metrix.Radius,
    overflow: 'hidden',
    backgroundColor: '#eee',
    justifyContent: 'flex-end',
    paddingHorizontal: Metrix.VerticalSize(20),
    paddingVertical: Metrix.VerticalSize(15),
  },
  title: {
    fontSize: FontType.FontExtraLarge,
    marginBottom: Metrix.VerticalSize(5),
  },
  description: {
    marginBottom: Metrix.VerticalSize(20),
  },
});

export default Registeration;
