import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {MainContainer, PrimaryButton, EoiCard} from '@/components';
import {Images, NavigationService} from '@/config';
import {Metrix} from '@/config';
import {RouteNames} from '@/config/routes';
import {EoiFilterValidation} from '@/components/Validations';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from '@/config';
import PendingAccessCard from '@/components/PendingAccessCard';
import {getAccountStatus} from '@/utils/business.helper';
import { usePendingStatusCheck } from '@/hooks/usePendingStatusCheck';

const PendingEoi = () => {
  // Check user status on every screen focus
  usePendingStatusCheck();
  
  const filterSheetRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [loading]);

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(EoiFilterValidation),
  });

  const handleCaptureEoi = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.CaptureEoi);
  };

  const handleOpenFilterSheet = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.Filter, {
      from: 'EOI',
    });
  };

  const handleCloseFilterSheet = () => {
    if (filterSheetRef?.current) {
      filterSheetRef?.current?.close();
    }
  };

  const renderEoiItem = ({item}) => {
    return (
      <EoiCard
        {...item}
        onPress={() =>
          NavigationService.navigate(RouteNames.HomeRoutes.EoiOverview, {
            eoi: item,
          })
        }
      />
    );
  };

  if (loading) {
    return (
      <MainContainer
        firstIcon={() => <Images.RefreshSVG />}
        secondIconPress={handleOpenFilterSheet}
        isHeader
        isFlatList
        heading="EOI "
        disabled={true}
        subheading={'(Expression Of Interest)'}
        backArrow={false}
        customeStyle={{paddingBottom: Metrix.VerticalSize(0)}}>
        <View style={styles.skeletonListContainer}>
          {[...Array(6)].map((_, idx) => (
            <SkeletonPlaceholder borderRadius={8} key={idx}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                borderRadius={Metrix.Radius}
                marginBottom={12}
                padding={15}
                height={120}
                marginTop={10}
                backgroundColor={Colors.White}
                borderWidth={1}
                borderColor={Colors.TextInputBorderColor}>
                {/* Top row: seq, agency, badge */}
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  marginBottom={Metrix.VerticalSize(8)}>
                  <SkeletonPlaceholder.Item>
                    {/* seq */}
                    <SkeletonPlaceholder.Item
                      width={160}
                      height={18}
                      borderRadius={4}
                      marginBottom={6}
                    />
                    {/* agency */}
                    <SkeletonPlaceholder.Item
                      width={90}
                      height={12}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder.Item>
                  {/* badge */}
                  <SkeletonPlaceholder.Item
                    width={70}
                    height={22}
                    borderRadius={12}
                  />
                </SkeletonPlaceholder.Item>
                {/* Info row: 4 items */}
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  marginTop={Metrix.VerticalSize(5)}>
                  {[0, 1, 2, 3].map(i => (
                    <SkeletonPlaceholder.Item
                      key={i}
                      marginRight={Metrix.HorizontalSize(20)}>
                      {/* label */}
                      <SkeletonPlaceholder.Item
                        width={40}
                        height={10}
                        borderRadius={3}
                        marginBottom={4}
                      />
                      {/* value */}
                      <SkeletonPlaceholder.Item
                        width={55}
                        height={14}
                        borderRadius={3}
                      />
                    </SkeletonPlaceholder.Item>
                  ))}
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          ))}
        </View>
        <View style={styles.skeletonButtonContainer}>
          <SkeletonPlaceholder borderRadius={8}>
            <SkeletonPlaceholder.Item
              width={'100%'}
              height={48}
              borderRadius={8}
            />
          </SkeletonPlaceholder>
        </View>
      </MainContainer>
    );
  }

  return (
    <MainContainer
      firstIcon={() => <Images.RefreshSVG />}
      firstIconPress={() => setLoading(true)}
      secondIconPress={handleOpenFilterSheet}
      isHeader
      heading="EOI "
      disabled={true}
      subheading={'(Expression Of Interest)'}
      backArrow={false}
      customeStyle={styles.mainContainer}>
      <View style={styles.pendingAccessContainer}>
        <PendingAccessCard />
      </View>
      <View style={styles.addButtonContainer}>
        <PrimaryButton
          title="Capture EOI"
          onPress={handleCaptureEoi}
          disabled={getAccountStatus()}
        />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: Metrix.VerticalSize(0),
    paddingHorizontal: Metrix.HorizontalSize(0),
    flex: 1,
  },
  pendingAccessContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Metrix.HorizontalSize(15),
  },
  addButtonContainer: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: Metrix.VerticalSize(5),
    paddingHorizontal: Metrix.HorizontalSize(15),
    zIndex: 10,
  },
  contentContainer: {
    paddingBottom: Metrix.VerticalSize(70),
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(15),
  },
  skeletonListContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  skeletonButtonContainer: {
    marginTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  skeletonFilterContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
});

export default PendingEoi;
