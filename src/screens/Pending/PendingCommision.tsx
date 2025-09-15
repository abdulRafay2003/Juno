import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {MainContainer} from '@/components/MainContainer';
import CommissionCard from '@/components/CommissionCard';
import {Metrix, Images, Colors, NavigationService} from '@/config';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {CommissionFilterValidation} from '@/components/Validations';
import {RouteNames} from '@/config/routes';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import PendingAccessCard from '@/components/PendingAccessCard';
import { usePendingStatusCheck } from '@/hooks/usePendingStatusCheck';

const PendingCommissions = () => {
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
    resolver: yupResolver(CommissionFilterValidation),
  });

  const handleOpenFilterSheet = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.Filter, {
      from: 'Commission',
    });
  };

  if (loading) {
    return (
      <MainContainer
        isHeader
        backArrow={false}
        heading="Commission"
        isFlatList
        firstIconPress={handleOpenFilterSheet}
        customeStyle={{paddingBottom: Metrix.VerticalSize(0)}}>
        <View style={styles.skeletonListContainer}>
          {[...Array(6)].map((_, idx) => (
            <SkeletonPlaceholder borderRadius={8} key={idx}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                borderRadius={Metrix.Radius}
                marginBottom={12}
                padding={15}
                height={170}
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
                      width={120}
                      height={18}
                      borderRadius={4}
                      marginBottom={6}
                    />
                    {/* agency */}
                    <SkeletonPlaceholder.Item
                      width={100}
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
                <SkeletonPlaceholder.Item
                  width={370}
                  height={1}
                  borderRadius={4}
                  marginBottom={6}
                  marginTop={Metrix.VerticalSize(10)}
                />
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  marginTop={Metrix.VerticalSize(10)}>
                  <SkeletonPlaceholder.Item
                    width={120}
                    height={18}
                    borderRadius={4}
                    marginBottom={6}
                  />
                  <SkeletonPlaceholder.Item flexDirection="row">
                    <SkeletonPlaceholder.Item
                      width={70}
                      height={22}
                      borderRadius={12}
                      marginRight={20}
                    />
                    <SkeletonPlaceholder.Item
                      width={18}
                      height={18}
                      borderRadius={2}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          ))}
        </View>
      </MainContainer>
    );
  }

  return (
    <MainContainer
      isHeader
      backArrow={false}
      heading="Commission"
      disabled={true}
      customeStyle={styles.mainContainer}>
      <View style={styles.pendingAccessContainer}>
        <PendingAccessCard />
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
  listContent: {
    paddingBottom: Metrix.VerticalSize(20),
    paddingTop: Metrix.HorizontalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(15),
  },
  skeletonListContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  pendingAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Metrix.HorizontalSize(15),
  },
});

export default PendingCommissions;
